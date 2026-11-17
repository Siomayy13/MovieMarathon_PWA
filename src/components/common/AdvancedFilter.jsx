import { Search, SlidersHorizontal, Film } from 'lucide-react'

export default function AdvancedFilter({
  search,
  onSearch,
  categories,
  activeCategory,
  onCategory,
  sortKey,
  sortOrder,
  onSort,
}) {
  return (
    <div className="adv-filter">
      {/* Search Input */}
      <div className="adv-filter__search">
        <Search size={18} className="adv-filter__icon" />
        <input
          type="search"
          placeholder="Cari judul film, drama, sutradara, aktor, atau genre..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="adv-filter__input"
          aria-label="Cari Film dan Drama"
        />
      </div>

      {/* Type / Category Pills */}
      <div className="adv-filter__row">
        <div className="adv-filter__pills">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`pill ${activeCategory === cat ? 'pill--active' : ''}`}
              onClick={() => onCategory(cat)}
            >
              {cat === 'All' && <Film size={14} style={{ marginRight: '4px' }} />}
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Controls */}
        <div className="adv-filter__sort">
          <SlidersHorizontal size={15} />
          <select
            value={`${sortKey}_${sortOrder}`}
            onChange={(e) => {
              const [key, order] = e.target.value.split('_')
              onSort({ key, order })
            }}
            aria-label="Urutkan film"
            className="adv-filter__select"
          >
            <option value="rating_desc">⭐ Rating: Tertinggi</option>
            <option value="rating_asc">⭐ Rating: Terendah</option>
            <option value="release_year_desc">📅 Tahun: Terbaru</option>
            <option value="release_year_asc">📅 Tahun: Terlama</option>
            <option value="title_asc">🔤 Judul: A - Z</option>
            <option value="title_desc">🔤 Judul: Z - A</option>
          </select>
        </div>
      </div>
    </div>
  )
}
