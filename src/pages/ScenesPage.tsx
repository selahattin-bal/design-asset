import { AssetCard } from '../components/AssetCard';
import { newSceneAssets } from '../data/homeContent';

export function ScenesPage() {
  return (
    <div className="bg-gray-50 py-12 md:py-16 min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-500">Catalog</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">3D Scenes</h1>
            <p className="mt-2 text-sm text-gray-500">
              Discover immersive scene compositions ready to showcase residential and commercial designs.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
              <span>Type</span>
              <select className="bg-transparent text-sm text-gray-700 focus:outline-none">
                <option>All</option>
                <option>Interior</option>
                <option>Exterior</option>
                <option>Commercial</option>
              </select>
            </label>
            <button className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm hover:border-gray-300">Reset</button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newSceneAssets.map(({ id, ...asset }) => (
            <AssetCard key={id} {...asset} />
          ))}
        </div>
      </div>
    </div>
  );
}
