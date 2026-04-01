import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { CareerPathwayCard } from '../components/CareerPathwayCard';
import { pathways, categories } from '../assets/pathwaysData';
import { useUser, useClerk } from '@clerk/clerk-react';

const AllPathways = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredPathways, setFilteredPathways] = useState([]);

  // 🧠 Filter logic
  useEffect(() => {
    if (!isSignedIn) {
      setFilteredPathways([]);
      return;
    }

    let results = [...pathways];

    if (filter !== 'all') {
      results = results.filter((p) => p.category === filter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(search) ||
          p.skills.some((skill) => skill.toLowerCase().includes(search))
      );
    }

    setFilteredPathways(results);
  }, [searchTerm, filter, isSignedIn]);

  const handleNavigate = (pathwayId) => {
    navigate(`/pathways/${pathwayId}`);
    window.scrollTo(0, 0);
  };

  if (!isLoaded) {
    return (
      <section className="py-16 md:pt-50 bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen pt-24 pb-16 bg-gray-50 overflow-hidden font-sans text-gray-900">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Explore <span className="text-primary">Career Pathways</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our comprehensive collection of in-demand careers
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
              <p className="text-gray-500 mb-6">
                You need to be logged in to view career pathways
              </p>
              <button
                onClick={() => openSignIn()}
                className="inline-flex items-center px-8 py-3 bg-primary hover:bg-primary-dull text-white shadow-md hover:shadow-lg rounded-xl font-medium transition-all duration-300"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 fade-in">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-300"
                  placeholder="Search pathways..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 appearance-none shadow-sm transition-all duration-300"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {/* Custom select arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="text-sm font-medium text-gray-500 mb-6 slide-up">
              {filteredPathways.length} {filteredPathways.length === 1 ? 'pathway' : 'pathways'} found
            </div>

            {filteredPathways.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-8 slide-up">
                {filteredPathways.map((pathway) => (
                  <CareerPathwayCard
                     key={pathway.id}
                     id={pathway.id}
                     title={pathway.title}
                     growth={pathway.growth}
                     salary={pathway.salary}
                     skills={pathway.skills}
                     onNavigate={handleNavigate}
                  />
                ))}
            </div>
            ) : (
              <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm fade-in">
                <p className="text-gray-500 text-lg mb-4">No pathways match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="text-primary font-medium hover:text-primary-dull transition-colors"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllPathways;