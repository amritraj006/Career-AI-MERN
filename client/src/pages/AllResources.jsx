import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import { ResourceCard } from '../components/ResourceCard';
import { resources } from '../assets/resources';
import { useUser, useClerk } from '@clerk/clerk-react';

const categories = [
  { id: 'all', name: 'All Resources', color: 'from-gray-500 to-gray-600' },
  { id: 'ml', name: 'Machine Learning', color: 'from-purple-500 to-indigo-600' },
  { id: 'ds', name: 'Data Science', color: 'from-blue-500 to-cyan-600' },
  { id: 'web', name: 'Web Dev', color: 'from-emerald-500 to-teal-600' },
  { id: 'ai', name: 'AI', color: 'from-rose-500 to-pink-600' },
  { id: 'cyber', name: 'Security', color: 'from-amber-500 to-orange-600' },
  { id: 'cloud', name: 'Cloud', color: 'from-sky-500 to-blue-600' },
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
  const url = import.meta.env.VITE_BACKEND_URL;

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
  }, [isSignedIn, user, url]);

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
      <section className="min-h-screen pt-16 md:pt-50 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section className="min-h-screen pt-24 pb-16 bg-gray-50 text-gray-900 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Discover Learning Resources
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our premium collection of courses and resources to accelerate your career
          </p>
        </div>

        {!isSignedIn ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm fade-in">
            <div className="mx-auto max-w-md">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Please login to continue
              </h3>
              <p className="text-gray-500 mb-6 font-medium">
                You need to be logged in to view our learning resources
              </p>
              <button
                onClick={() => openSignIn()}
                className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-12 fade-in">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
                <div className="relative w-full md:w-96">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    </button>
                  )}
                </div>

                <div className="relative w-full md:w-auto">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="w-full pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 appearance-none shadow-sm transition-all duration-300 font-medium"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {(searchTerm || filter !== 'all') && (
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 mb-4 shadow-sm slide-up">
                  <div className="flex items-center gap-2">
                    {filter !== 'all' && (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${categories.find(c => c.id === filter)?.color} text-white shadow-sm`}>
                        {categories.find(c => c.id === filter)?.name}
                        <button 
                          onClick={() => setFilter('all')}
                          className="ml-2 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {searchTerm && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                        Search: "{searchTerm}"
                        <button 
                          onClick={() => setSearchTerm('')}
                          className="ml-2 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary font-medium hover:text-primary-dull flex items-center transition-colors"
                  >
                    Clear all
                    <X className="ml-1 w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-6 slide-up">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filter === 'all' ? 'All Resources' : categories.find(c => c.id === filter)?.name}
                </h2>
                <div className="text-sm text-gray-500 font-medium bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                  Showing <span className="font-bold text-gray-900">{filteredResources.length}</span> results
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : filteredResources.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 slide-up">
                  {filteredResources.map((resource) => (
                    <div key={resource.resourceId}>
                      <ResourceCard
                        {...resource}
                        onNavigate={(id) => {
                          navigate(`/resources/${id}`);
                          window.scrollTo(0, 0);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm fade-in">
                  <div className="mx-auto max-w-md">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-100">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      No resources found
                    </h3>
                    <p className="text-gray-500 mb-6 font-medium">
                      {searchTerm
                        ? `No results for "${searchTerm}"`
                        : 'Try adjusting your filters'}
                    </p>
                    <button
                      onClick={clearFilters}
                      className="inline-flex items-center px-6 py-2.5 bg-primary hover:bg-primary-dull text-white rounded-xl font-medium transition-all duration-300 shadow-sm"
                    >
                      Clear filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default AllResources;