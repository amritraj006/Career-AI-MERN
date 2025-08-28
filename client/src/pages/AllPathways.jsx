import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { CareerPathwayCard } from '../components/CareerPathwayCard';
import { pathways, categories } from '../assets/pathwaysData';
import BlurCircle from '../components/BlurCircle';
import { useUser, useClerk } from '@clerk/clerk-react';

const AllPathways = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [filteredPathways, setFilteredPathways] = useState([]);
  const [subscribedPathwayIds, setSubscribedPathwayIds] = useState([]);
  const url = "https://career-ai-mern.onrender.com";

  // 🔁 Fetch subscribed pathway IDs
  useEffect(() => {
    const fetchSubscribedPathways = async () => {
      if (!isSignedIn || !user?.primaryEmailAddress?.emailAddress) return;

      try {
        const res = await fetch(
          `${url}/api/user-pathways?email=${user.primaryEmailAddress.emailAddress}`
        );
        const data = await res.json();
        if (res.ok && data.pathwayIds) {
          setSubscribedPathwayIds(data.pathwayIds);
        }
      } catch (error) {
        console.error('Error fetching subscribed pathways:', error);
      }
    };

    fetchSubscribedPathways();
  }, [isSignedIn, user]);

  // 🧠 Filter logic
  useEffect(() => {
    if (!isSignedIn) {
      setFilteredPathways([]);
      return;
    }

    let results = pathways.filter(
      (p) => !subscribedPathwayIds.includes(p.id) // 🔥 filter out subscribed
    );

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
  }, [searchTerm, filter, subscribedPathwayIds, isSignedIn]);

  const handleNavigate = (pathwayId) => {
    navigate(`/pathways/${pathwayId}`);
    window.scrollTo(0, 0);
  };

  if (!isLoaded) {
    return (
      <section className="py-16 md:pt-50 bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </section>
    );
  }

  return (
    <section className="py-16 md:pt-50 bg-gray-950">
      <BlurCircle top="-80px" left="-100px" />
      <BlurCircle bottom="100px" right="880px" />
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore <span className="text-primary">Career Pathways</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Browse through our comprehensive collection of in-demand careers
          </p>
        </motion.div>

        {!isSignedIn ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-900/50 rounded-xl border border-gray-800"
          >
            <div className="mx-auto max-w-md">
              <div className="w-20 h-20 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-primary">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Please login to continue
              </h3>
              <p className="text-gray-400 mb-6">
                You need to be logged in to view career pathways
              </p>
              <button
                onClick={() => openSignIn()}
                className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary-darker text-white rounded-lg font-medium transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Search and Filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Search pathways..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-400 mb-6"
            >
              {filteredPathways.length} {filteredPathways.length === 1 ? 'pathway' : 'pathways'} found
            </motion.div>

            {filteredPathways.length > 0 ? (
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide">
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 mb-4">No pathways match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilter('all');
                  }}
                  className="text-primary hover:text-primary-dull text-sm"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AllPathways;