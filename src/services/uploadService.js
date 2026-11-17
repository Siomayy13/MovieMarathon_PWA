import axios from 'axios'
import { BASE_URL, SUPABASE_KEY, IS_SUPABASE } from '../config/api'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

class UploadService {
  /**
   * Upload image to Supabase Storage bucket 'posters', with offline base64 fallback.
   */
  async uploadImage(file) {
    if (!file) {
      throw new Error('Pilih file gambar poster terlebih dahulu.')
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, atau WebP.')
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new Error('Ukuran file poster melebihi batas 5MB.')
    }

    // --- Supabase Storage flow ---
    if (IS_SUPABASE && SUPABASE_KEY) {
      const ext = file.name.split('.').pop() || 'jpg'
      const fileName = `poster_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`
      const bucketName = 'posters'

      try {
        const uploadUrl = `${BASE_URL}/storage/v1/object/${bucketName}/${fileName}`
        await axios.post(uploadUrl, file, {
          headers: {
            'Content-Type': file.type,
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
          timeout: 20000,
        })
        const publicUrl = `${BASE_URL}/storage/v1/object/public/${bucketName}/${fileName}`
        return {
          success: true,
          data: { url: publicUrl, filename: fileName },
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, menggunakan fallback Base64 data URL:', err)
      }
    }

    // --- Fallback: Offline Base64 Data URL ---
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        resolve({
          success: true,
          data: {
            url: reader.result,
            filename: file.name,
          },
        })
      }
      reader.onerror = () => reject(new Error('Gagal membaca gambar secara lokal.'))
      reader.readAsDataURL(file)
    })
  }
}

export default new UploadService()
