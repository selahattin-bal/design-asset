import { Search, ChevronDown, Menu, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Link, NavLink, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ModelsPage } from './pages/ModelsPage';
import { ScenesPage } from './pages/ScenesPage';
import { TexturesPage } from './pages/TexturesPage';

function App() {
  // Categories and subcategories
  const categories = [
    'Furniture',
    'Decoration',
    'Childroom',
    'Technology',
    'Bathroom',
    'Lighting',
    'Kitchen',
    'Other Models',
    'Exterior',
  ];
  const sceneCategories = ['Interior', 'Exterior'];

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1 transition-colors ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-gray-950 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-20">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold tracking-wide">
                ILMIORA
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
              <div className="relative group">
                <NavLink to="/models" className={navLinkClass} end>
                  3D Models
                  <ChevronDown className="h-4 w-4" />
                </NavLink>
                {/* Dropdown menu for 3D Models */}
                <div className="absolute left-0 top-full z-20 mt-3 w-[760px] rounded-3xl bg-gray-900/95 backdrop-blur shadow-2xl border border-gray-800 p-8 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                  <div className="flex flex-col gap-8">
                    <div>
                      <div className="text-base font-semibold text-white mb-5">3D Models</div>
                      <div className="grid grid-cols-3 gap-8">
                        {[categories.slice(0,3), categories.slice(3,6), categories.slice(6)].map((column, columnIndex) => (
                          <div key={columnIndex} className="space-y-3">
                            {column.map(cat => (
                              <a
                                key={cat}
                                href="#"
                                className="block text-sm font-medium text-gray-300 hover:text-white transition-colors"
                              >
                                {cat}
                              </a>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <Link
                        to="/models"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:translate-x-1 transition-transform"
                      >
                        All 3D Models
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <NavLink to="/scenes" className={navLinkClass} end>
                  3D Scenes
                  <ChevronDown className="h-4 w-4" />
                </NavLink>
                <div className="absolute left-0 top-full z-20 mt-3 w-[760px] rounded-3xl bg-gray-900/95 backdrop-blur shadow-2xl border border-gray-800 p-8 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                  <div className="flex flex-col gap-8">
                    <div>
                      <div className="text-base font-semibold text-white mb-5">3D Scenes</div>
                      <div className="grid grid-cols-2 gap-6 max-w-md">
                        {sceneCategories.map((scene, index) => (
                          <a
                            key={scene}
                            href="#"
                            className={`block rounded-2xl border border-gray-800 px-6 py-4 text-sm font-medium transition-colors ${index === 0 ? 'bg-gray-800 text-white' : 'text-gray-300 hover:text-white hover:border-gray-700 hover:bg-gray-800/70'}`}
                          >
                            {scene}
                          </a>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-800">
                      <Link
                        to="/scenes"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:translate-x-1 transition-transform"
                      >
                        All 3D Scenes
                        <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <NavLink to="/textures" className={navLinkClass} end>
                Textures
              </NavLink>
            </nav>

            <div className="hidden md:flex flex-1 justify-center">
              <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <input
                  type="search"
                  placeholder="Search assets or start creating"
                  className="w-full rounded-full bg-gray-900/90 border border-gray-800 py-3 pl-12 pr-4 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
                />
              </div>
            </div>

            <div className="ml-auto flex items-center gap-4">
              <button className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-200 hover:text-white transition-colors">
                Sign In
              </button>
              <button className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-black bg-white hover:bg-gray-200 transition-colors">
                Sign Up
              </button>
              <button className="md:hidden p-2 text-gray-300">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ModelsPage />} />
          <Route path="/scenes" element={<ScenesPage />} />
          <Route path="/textures" element={<TexturesPage />} />
        </Routes>
      </main>

      <footer className="bg-gray-950 text-gray-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-12 mb-12 text-center sm:text-left">
            <div className="min-w-[160px]">
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/models" className="hover:text-white">3D Models</Link></li>
                <li><Link to="/scenes" className="hover:text-white">3D Scenes</Link></li>
                <li><Link to="/textures" className="hover:text-white">Textures</Link></li>
                <li><a href="#" className="hover:text-white">Brands</a></li>
              </ul>
            </div>
            <div className="min-w-[160px]">
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div className="min-w-[160px]">
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
                <li><a href="#" className="hover:text-white">Licenses</a></li>
              </ul>
            </div>https://zeelproject.com/55195-modern-kitchen-25.html
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold tracking-wide">ILMIORA</div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-gray-500">© 2024 Ilmiora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
