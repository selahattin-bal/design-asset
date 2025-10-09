import { AssetCard } from '../components/AssetCard';
import { newModelAssets } from '../data/homeContent';

export function ModelsPage() {
  return (
    <div className="bg-gray-50 py-12 md:py-16 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500">Catalog</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">3D Models</h1>
            <p className="mt-2 text-sm text-gray-500">
              Explore our complete library of premium 3D models curated for interior and exterior projects.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span>Category</span>
              <select className="bg-transparent text-sm text-gray-700 focus:outline-none">
                <option>All</option>
                <option>Furniture</option>
                <option>Decoration</option>
                <option>Lighting</option>
                <option>Technology</option>
              </select>
            </label>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:border-gray-300">Reset</button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newModelAssets.map(({ id, ...asset }) => (
            <AssetCard key={id} {...asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
