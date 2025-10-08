import { Search, ChevronDown, Menu, Download, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import React, { useState } from 'react';
import { AssetCard } from './components/AssetCard';

function App() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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
  const furnitureSubcategories = [
    'Cabinets', 'Sofas', 'Tables', 'Chairs', 'Bar stools', 'Beds', 'Desks', 'Office furniture', 'Armchairs', 'Other seating',
    'Table + Chair', 'Shelves', 'Sideboard & Chest of Drawer', 'Other'
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <div className="text-2xl font-bold text-gray-900">ILMIORA</div>
              </div>

              <nav className="hidden md:flex space-x-6">
                <div className="relative group">
                    <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                      3D Models
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                    {/* Dropdown menu for 3D Models */}
                    <div className="absolute left-0 top-full z-20 w-[900px] bg-gray-100 shadow-xl rounded-2xl mt-2 p-8 flex opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200">
                      {/* Left column: categories */}
                      <div className="w-1/3">
                        <div className="text-xl font-bold mb-4">3D Models</div>
                        <ul className="space-y-2">
                          {categories.map(cat => (
                            <li key={cat}>
                              <a
                                href="#"
                                className={`flex justify-between items-center text-lg font-medium text-gray-800 hover:text-gray-900 ${hoveredCategory === cat ? 'underline' : ''}`}
                                onMouseEnter={() => setHoveredCategory(cat)}
                                onMouseLeave={() => setHoveredCategory(null)}
                              >
                                {cat}
                                <ChevronDown className="h-4 w-4" />
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Right column: subcategories, only for Furniture */}
                      {hoveredCategory === 'Furniture' && (
                        <div className="w-2/3 grid grid-cols-2 gap-x-8 gap-y-2">
                          <div>
                            <div className="text-xl font-bold mb-4">Furniture</div>
                            <ul className="space-y-2">
                              {furnitureSubcategories.slice(0, 10).map(sub => (
                                <li key={sub}><a href="#" className="text-lg text-gray-800 hover:text-gray-900">{sub}</a></li>
                              ))}
                            </ul>
                          </div>
                          <div className="pt-8">
                            <ul className="space-y-2">
                              {furnitureSubcategories.slice(10).map(sub => (
                                <li key={sub}><a href="#" className="text-lg text-gray-800 hover:text-gray-900">{sub}</a></li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                </div>
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    3D Scenes
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </div>
                <div className="relative group">
                  <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Textures
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </div>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Brands
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Artists
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Works
                </a>
                <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Blog
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Search className="h-5 w-5" />
              </button>
              <button className="hidden md:inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Sign In
              </button>
              <button className="hidden md:inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-gray-900 hover:bg-gray-800">
                Sign Up
              </button>
              <button className="md:hidden p-2 text-gray-600">
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
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
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <AssetCard
                image="https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=800"
                title="Modern Chair Design"
                subtitle="Furniture / Seating"
                author="LETO"
                views={630}
                likes={28}
                date="13.09.2025"
                credits="free"
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
                title="Dining Table Set"
                subtitle="Furniture / Dining"
                author="DESIGN CO"
                views={845}
                likes={42}
                date="12.09.2025"
                credits={5}
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=800"
                title="Pendant Light"
                subtitle="Lighting / Ceiling"
                author="LUXE"
                views={1240}
                likes={89}
                date="11.09.2025"
                credits={3}
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=800"
                title="Modern Sofa"
                subtitle="Furniture / Seating"
                author="STUDIO"
                views={2100}
                likes={156}
                date="10.09.2025"
                credits="free"
                size="small"
                aspectRatio="square"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">New 3D Scenes</h2>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AssetCard
                image="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200"
                title="Modern Living Room"
                subtitle="Interior / Residential"
                author="INTERIOR PRO"
                views={3420}
                likes={285}
                date="15.09.2025"
                credits="free"
                size="medium"
                aspectRatio="video"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=1200"
                title="Contemporary Bedroom"
                subtitle="Interior / Residential"
                author="ARCH STUDIO"
                views={2890}
                likes={198}
                date="14.09.2025"
                credits={8}
                size="medium"
                aspectRatio="video"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1743231/pexels-photo-1743231.jpeg?auto=compress&cs=tinysrgb&w=1200"
                title="Luxury Kitchen"
                subtitle="Interior / Kitchen"
                author="DESIGN LAB"
                views={4150}
                likes={342}
                date="13.09.2025"
                credits={10}
                size="medium"
                aspectRatio="video"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">New Textures</h2>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <AssetCard
                image="https://images.pexels.com/photos/326311/pexels-photo-326311.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Wood Texture"
                author="TEXTURE CO"
                views={520}
                likes={45}
                credits="free"
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Marble"
                author="MATERIALS"
                views={780}
                likes={67}
                credits={2}
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Concrete"
                author="TEXTURE CO"
                views={645}
                likes={52}
                credits="free"
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1152237/pexels-photo-1152237.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Brick"
                author="ARCH TEX"
                views={890}
                likes={71}
                credits={3}
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1029710/pexels-photo-1029710.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Fabric"
                author="MATERIALS"
                views={420}
                likes={38}
                credits="free"
                size="small"
                aspectRatio="square"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1909791/pexels-photo-1909791.jpeg?auto=compress&cs=tinysrgb&w=600"
                title="Leather"
                author="LUXE TEX"
                views={1050}
                likes={95}
                credits={4}
                size="small"
                aspectRatio="square"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Works</h2>
              <a href="#" className="text-sm font-medium text-gray-700 hover:text-gray-900">
                View All →
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AssetCard
                image="https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg?auto=compress&cs=tinysrgb&w=1200"
                title="Contemporary Office Space"
                subtitle="Commercial / Workspace"
                author="PRO DESIGNER"
                views={5280}
                likes={425}
                date="16.09.2025"
                credits={15}
                size="large"
                aspectRatio="video"
              />
              <AssetCard
                image="https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=1200"
                title="Minimalist Interior Design"
                subtitle="Residential / Living"
                author="CREATIVE STUDIO"
                views={6720}
                likes={548}
                date="15.09.2025"
                credits="free"
                size="large"
                aspectRatio="video"
              />
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Download Our Mobile App</h2>
              <p className="text-gray-400 mb-8">Access thousands of resources on the go</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="h-5 w-5 mr-2" />
                  App Store
                </button>
                <button className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download className="h-5 w-5 mr-2" />
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">3D Models</a></li>
                <li><a href="#" className="hover:text-white">3D Scenes</a></li>
                <li><a href="#" className="hover:text-white">Textures</a></li>
                <li><a href="#" className="hover:text-white">Brands</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Artists</a></li>
                <li><a href="#" className="hover:text-white">Works</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Forum</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
                <li><a href="#" className="hover:text-white">Licenses</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold mb-4 md:mb-0">ILMIORA</div>
            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-400">© 2024 Ilmiora. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
