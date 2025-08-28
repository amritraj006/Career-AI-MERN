// AllResources.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResourceCard } from '../components/ResourceCard';
import { resources } from '../assets/resources';
import { useUser, useClerk } from '@clerk/clerk-react';
import BlurCircle from '../components/BlurCircle';

const categories = [
  { id: 'all', name: 'All Resources', color: 'from-gray-600 to-gray-500' },
  { id: 'ml', name: 'Machine Learning', color: 'from-purple-600 to-indigo-500' },
  { id: 'ds', name: 'Data Science', color: 'from-blue-600 to-cyan-500' },
  { id: 'web', name: 'Web Dev', color: 'from-emerald-600 to-teal-500' },
  { id: 'ai', name: 'AI', color: 'from-rose-600 to-pink-500' },
  { id: 'cyber', name: 'Security', color: 'from-amber-600 to-orange-500' },
  { id: 'cloud', name: 'Cloud', color: 'from-sky-600 to-blue-500' },
];

const AllResources = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredResources, setFilteredResources] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const url = "https://career-ai-mern.onrender.com";

  useEffect(() => {
    const fetchEnrolled = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${url}/api/course/enrolled-ids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: user?.primaryEmailAddress?.emailAddress })
        });
        const data = await res.json();
        if (res.ok) setEnrolledIds(data.enrolledIds || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isSignedIn && user?.primaryEmailAddress?.emailAddress) fetchEnrolled();
  }, [isSignedIn, user]);

  useEffect(() => {
    if (!isSignedIn) {
      setFilteredResources([]);
      return;
    }

    let results = resources.filter((res) => !enrolledIds.includes(res.resourceId));

    if (filter !== 'all') {
      results = results.filter((res) => res.resourceId.toLowerCase().startsWith(filter.toLowerCase()));
    }

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter((res) =>
        res.name.toLowerCase().includes(lowerSearch) ||
        res.description.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredResources(results);
  }, [searchTerm, filter, enrolledIds, isSignedIn]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilter('all');
  };

  if (!isLoaded) {
    return (
      <section className="min-h-screen pt-16 md:pt-50 bg-gradient-to-br from-gray-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-16 md:pt-50 bg-gradient-to-br from-gray-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <BlurCircle top='-80px' left='-80px' />
     <BlurCircle top='-10px' right='100px'/>
    
      
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500 mb-4">
            Discover Learning Resources
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Explore our premium collection of courses and resources to accelerate your career
          </p>
        </motion.div>

        {!isSignedIn ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800"
          >
            <div className="mx-auto max-w-md">
              <div className="w-20 h-20 bg-gradient-to-r from-rose-600/20 to-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-rose-500">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Please login to continue
              </h3>
              <p className="text-gray-400 mb-6">
                You need to be logged in to view our learning resources
              </p>
              <button
                onClick={() => openSignIn()}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-10 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white placeholder-gray-500 transition-all duration-200"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                    </button>
                  )}
                </div>

                <div className="relative w-full md:w-auto">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-10 pr-8 py-3 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-white appearance-none transition-all duration-200"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {(searchTerm || filter !== 'all') && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm p-3 rounded-lg border border-gray-800 mb-4"
                >
                  <div className="flex items-center gap-2">
                    {filter !== 'all' && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categories.find(c => c.id === filter)?.color} text-white`}>
                        {categories.find(c => c.id === filter)?.name}
                        <button 
                          onClick={() => setFilter('all')}
                          className="ml-1.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300">
                        Search: "{searchTerm}"
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="ml-1.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-rose-400 hover:text-rose-300 flex items-center"
                  >
                    Clear all
                    <X className="ml-1 w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-white">
                  {filter === 'all' ? 'All Resources' : categories.find(c => c.id === filter)?.name}
                </h2>
                <div className="text-sm text-gray-400">
                  Showing <span className="font-medium text-white">{filteredResources.length}</span> results
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                </div>
              ) : filteredResources.length > 0 ? (
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  <AnimatePresence>
                    {filteredResources.map((resource) => (
                      <motion.div
                        key={resource.resourceId}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ResourceCard
                          {...resource}
                          onNavigate={(id) => {
                            navigate(`/resources/${id}`);
                            window.scrollTo(0, 0);
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800"
                >
                  <div className="mx-auto max-w-md">
                    <div className="w-20 h-20 bg-gradient-to-r from-rose-600/20 to-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                      <Search className="w-8 h-8 text-rose-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No resources found
                    </h3>
                    <p className="text-gray-400 mb-6">
                      {searchTerm
                        ? `No results for "${searchTerm}"`
                        : 'Try adjusting your filters'}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Clear filters
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AllResources;