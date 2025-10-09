import { Link } from 'react-router-dom';
import { AssetCard } from '../components/AssetCard';
import { featuredWorkAssets, newModelAssets, newSceneAssets, textureAssets } from '../data/homeContent';

export function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-gray-50 to-gray-100 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              The First Digital Platform
              <br />
              <span className="text-gray-600">Designed for Designers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Access thousands of professional 3D models, scenes, and textures curated specifically for architects, interior designers, and creative professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center px-8 py-4 rounded-md text-base font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors">
                Explore Resources
              </button>
              <button className="inline-flex items-center px-8 py-4 rounded-md text-base font-medium text-gray-900 bg-white border-2 border-gray-900 hover:bg-gray-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">New 3D Models</h2>
            <Link to="/models" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {newModelAssets.slice(0, 8).map(({ id, ...asset }) => (
              <AssetCard key={id} {...asset} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">New 3D Scenes</h2>
            <Link to="/scenes" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {newSceneAssets.slice(0, 6).map(({ id, ...asset }) => (
              <AssetCard key={id} {...asset} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">New Textures</h2>
            <Link to="/textures" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {textureAssets.slice(0, 6).map(({ id, ...asset }) => (
              <AssetCard key={id} {...asset} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Works</h2>
            <Link to="/scenes" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featuredWorkAssets.slice(0, 3).map(({ id, ...asset }) => (
              <AssetCard key={id} {...asset} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
