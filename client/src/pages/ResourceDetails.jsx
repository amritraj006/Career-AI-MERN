import { useParams, useNavigate } from 'react-router-dom';
import { resources } from '../assets/resources';
import { ArrowLeft, Check, Loader2, Star, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ResourceCard } from '../components/ResourceCard';
import { useUser, SignInButton } from '@clerk/clerk-react';

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
  }, [resource, navigate, isSignedIn, resourceId, user, url]);

  const handleBuyNow = () => {
    if (!isSignedIn) {
      toast.error('Please sign in to buy this course');
      return;
    }
    
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
    <section className="py-24 bg-gray-50 min-h-screen text-gray-900 font-sans">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <button
          onClick={() => {
            navigate('/resources');
            window.scrollTo(0, 0);
          }}
          className="mb-8 flex items-center text-gray-500 hover:text-primary font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Resources
        </button>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-80 w-full overflow-hidden bg-gray-100">
            <img
              src={resource.image}
              alt={resource.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/course-fallback.jpg';
                e.target.className = 'w-full h-full object-cover';
              }}
            />
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="md:w-2/3">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                  {resource.name}
                </h1>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">{resource.description}</p>

                <div className="flex items-center gap-6 mb-8 text-gray-600 font-medium">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mr-2" />
                    <span>{resource.rating}</span>
                    <span className="text-gray-400 ml-1">({resource.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{resource.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{resource.lessons} lessons</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">
                    Skills You'll Learn
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.skillsRequired.map((skill, i) => (
                       <span
                        key={i}
                        className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-200 shadow-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:w-1/3 md:pl-8 mt-8 md:mt-0">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
                  <div className="text-3xl font-bold text-primary mb-6">{resource.price}</div>

                  {isSignedIn ? (
                    <button
                      onClick={isEnrolled ? () => navigate('/my-dashboard') : handleBuyNow}
                      disabled={isLoading}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold shadow-sm flex items-center justify-center transition-all ${
                        isEnrolled
                          ? 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                          : 'bg-primary hover:bg-primary-dull text-white hover:shadow-md'
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
                    </button>
                  ) : (
                    <SignInButton mode="modal" afterSignInUrl={`/resources/${resourceId}`}>
                      <button
                        className="w-full py-3.5 px-4 rounded-xl font-bold shadow-sm bg-primary hover:bg-primary-dull text-white flex items-center justify-center transition-all hover:shadow-md"
                      >
                        Buy Now
                      </button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses Section */}
        {otherResources.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
              You may also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {otherResources.map((res) => (
                <div key={res.resourceId} className="h-full">
                  <ResourceCard
                    {...res}
                    onNavigate={(id) => {
                      navigate(`/resources/${id}`);
                      window.scrollTo(0, 0);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 flex flex-col items-center justify-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-4 font-medium">Looking for something else?</p>
          <button
            onClick={() => {navigate('/resources'); window.scrollTo(0, 0);}}
            className="px-8 py-3.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-full hover:bg-gray-50 hover:text-primary transition-all shadow-sm flex items-center gap-2"
          >
            Explore All Courses <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ResourceDetails;