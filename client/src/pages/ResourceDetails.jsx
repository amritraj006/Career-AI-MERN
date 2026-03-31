import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resources } from '../assets/resources';
import { ArrowLeft, ShoppingCart, Check, Loader2, Star, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ResourceCard } from '../components/ResourceCard';
import { useUser, SignInButton } from '@clerk/clerk-react';
import BlurCircle from '../components/BlurCircle';

const ResourceDetails = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [enrolledIds, setEnrolledIds] = useState([]);
  const url = import.meta.env.VITE_BACKEND_URL;

  const resource = useMemo(
    () => resources.find((r) => r.resourceId === resourceId),
    [resourceId]
  );

  const otherResources = useMemo(() => {
    return resources
      .filter(
        (r) =>
          r.resourceId !== resourceId && !enrolledIds.includes(r.resourceId)
      )
      .slice(0, 4);
  }, [resourceId, enrolledIds]);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!resource) {
        toast.error('Resource not found');
        navigate('/resources', { replace: true });
        return;
      }

      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        setIsLoading(true);
        try {
          // Fetch all enrolled course IDs
          const res = await fetch(`${url}/api/course/enrolled-ids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: user.primaryEmailAddress.emailAddress })
          });

          const enrolledData = await res.json();
          if (res.ok && Array.isArray(enrolledData.enrolledIds)) {
            setEnrolledIds(enrolledData.enrolledIds);
          }
        } catch (err) {
          console.error('Enrollment check failed:', err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkEnrollment();
  }, [resource, navigate, isSignedIn, resourceId, user]);

  const handleBuyNow = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to buy this course');
      return;
    }
    
    // Parse price (e.g. "$49" -> 49)
    const numericPrice = parseFloat(resource.price.replace(/[^0-9.]/g, ''));
    
    navigate('/payment', { 
      state: { 
        resourceId: resource.resourceId,
        courseName: resource.name,
        totalAmount: numericPrice || 0
      } 
    });
  };

  const isEnrolled = enrolledIds.includes(resourceId);

  if (!resource) return null;

  return (
    <section className="relative py-16 pt-22 md:pt-50 bg-gradient-to-br from-gray-900 to-gray-950 px-6 min-h-screen overflow-hidden">
      {/* Decorative Circles */}
      
      <BlurCircle top="50%" right="-100px" />
      <BlurCircle bottom="-100px" right="-80px" />
      <BlurCircle bottom="10%" left="100" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.button
          onClick={() => {
            navigate('/resources');
            scrollTo(0, 0);
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex items-center text-primary hover:text-primary-dull group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Resources
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden shadow-xl"
        >
          <div className="relative h-80 w-full overflow-hidden">
            <img
              src={resource.image}
              alt={resource.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.target.src = '/course-fallback.jpg';
                e.target.className = 'w-full h-full object-contain bg-gray-800 p-4';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-2/3">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {resource.name}
                </h1>
                <p className="text-gray-300 mb-6 text-lg">{resource.description}</p>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-yellow-400">
                    <Star className="w-5 h-5 fill-yellow-400 mr-1" />
                    <span className="font-medium">{resource.rating}</span>
                    <span className="text-gray-400 ml-1">({resource.reviews})</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>{resource.duration}</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <BookOpen className="w-5 h-5 mr-1" />
                    <span>{resource.lessons} lessons</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm text-gray-400 mb-3 uppercase tracking-wider">
                    Skills You'll Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.skillsRequired.map((skill, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                        className="px-3 py-1.5 text-sm rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 md:pl-6 mt-6 md:mt-0">
                <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5 sticky top-6">
                  <div className="text-2xl font-bold text-primary mb-6">{resource.price}</div>

                  {isSignedIn ? (
                    <motion.button
                      onClick={isEnrolled ? () => navigate('/dashboard') : handleBuyNow}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      disabled={isLoading}
                      className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                        isEnrolled
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dull hover:to-indigo-700 text-white'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin h-5 w-5 mr-2" />
                      ) : isEnrolled ? (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Already Enrolled
                        </>
                      ) : (
                        <>
                          Buy Now
                        </>
                      )}
                    </motion.button>
                  ) : (
                    <SignInButton mode="modal" afterSignInUrl={`/resources/${resourceId}`}>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 px-4 rounded-lg font-medium bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dull hover:to-indigo-700 text-white flex items-center justify-center"
                      >
                        Buy Now
                      </motion.button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Courses Section */}
        {otherResources.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherResources.map((res) => (
                <ResourceCard
                  key={res.resourceId}
                  {...res}
                  onNavigate={(id) => {
                    navigate(`/resources/${id}`);
                    scrollTo(0, 0);
                  }}
                />
              ))}
            </div>
          </div>
        )}

            <div className="mt-16 flex items-center justify-center">
      <motion.button
      onClick={() => {navigate('/resources'); scrollTo(0, 0);}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className=" px-5 py-2 text-primary rounded-md flex items-center gap-2"
      >
        Explore All Course <ArrowRight />
      </motion.button>
    </div>
      </div>
    </section>
  );
};

export default ResourceDetails;