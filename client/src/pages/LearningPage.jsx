import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resources } from '../assets/resources';
import { useUser, useClerk } from '@clerk/clerk-react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiChevronRight } from 'react-icons/fi';

const LearningPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const url = import.meta.env.VITE_BACKEND_URL;

  const checkCourseAccess = useCallback(async () => {
    try {
      const foundCourse = resources.find(res => res.resourceId === resourceId);
      setCourse(foundCourse);

      if (!foundCourse) {
        setIsLoading(false);
        return;
      }

      if (isSignedIn) {
        const response = await fetch(`${url}/api/course/enrolled-ids`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: user.primaryEmailAddress.emailAddress }),
        });

        if (response.ok) {
          const data = await response.json();
          setHasAccess(data.enrolledIds.includes(resourceId));
        }
      } else {
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking course access:', error);
      setHasAccess(false);
    } finally {
      setIsLoading(false);
    }
  }, [resourceId, isSignedIn, user, url]);

  useEffect(() => {
    checkCourseAccess();
    const handleAuthChange = () => isSignedIn ? checkCourseAccess() : setHasAccess(false);
    window.addEventListener('clerk:session', handleAuthChange);
    return () => window.removeEventListener('clerk:session', handleAuthChange);
  }, [checkCourseAccess, isSignedIn]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center fade-in">
        <div className="text-center p-8 max-w-md bg-white rounded-2xl shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Course Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The requested course doesn't exist in our library.
          </p>
          <button
            onClick={() => navigate('/resources')}
            className="px-6 py-3 bg-primary hover:bg-primary-dull text-white rounded-xl font-medium shadow-sm transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center fade-in">
        <div className="text-center p-10 max-w-md bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-8 font-medium">
            {isSignedIn ? 'You need to enroll in this course to access the content.' : 'Please sign in to access this course.'}
          </p>
          <button
            onClick={() => isSignedIn ? navigate(`/resources/${resourceId}`) : openSignIn()}
            className="w-full px-6 py-3 rounded-xl font-bold shadow-sm transition-colors bg-primary hover:bg-primary-dull text-white"
          >
            {isSignedIn ? 'View Course Details' : 'Sign In'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 text-gray-900 font-sans">
      {/* Navigation Bars */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/my-dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors font-medium group"
          >
            <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            <span>Dashboard</span>
          </button>
          
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors font-medium group"
          >
            <span>Browse Courses</span>
            <FiArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 fade-in">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Video & Details */}
          <div className="lg:w-2/3">
            {/* Video Player */}
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-gray-900">
              {!videoLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                </div>
              )}
              <iframe
                src={course.video}
                title={course.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setVideoLoaded(true)}
                loading="eager"
              />
            </div>

            {/* Course Details */}
            <div className="mt-8 p-8 rounded-2xl bg-white shadow-sm border border-gray-200 slide-up">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                    {course.name}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                      {course.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-50 text-green-700 border border-green-200">
                      {course.price} • Paid Course
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this course</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {course.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-primary/10 p-1.5 rounded-lg text-primary">
                    <FiCheck />
                  </span>
                  Skills You'll Gain
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.skillsRequired.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Course Features */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 md:p-8 rounded-2xl bg-white shadow-sm border border-gray-200 slide-up">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
                  <span className="bg-primary/10 p-2 rounded-lg text-primary">
                    <FiCheck />
                  </span>
                  Course Features
                </h3>
                <ul className="space-y-4">
                  {[
                    'Professional certification included',
                    'Self-paced learning path',
                    'Industry-relevant curriculum',
                    'Access to expert instructor support',
                    'Lifetime access to course materials',
                    'Downloadable resources & guides'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1 text-green-500 font-bold">
                        <FiCheck className="w-5 h-5"/>
                      </span>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 md:p-8 rounded-2xl bg-gray-50 shadow-sm border border-gray-200 slide-up">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3 pb-4 border-b border-gray-200">
                  <span className="bg-white p-2 rounded-lg text-primary shadow-sm border border-gray-100">
                    <FiChevronRight />
                  </span>
                  Learning Outcomes
                </h3>
                <ul className="space-y-4">
                  {[
                    'Master core concepts and principles',
                    'Build real-world application projects',
                    'Develop a portfolio-ready body of work',
                    'Gain a competitive advantage in the job market',
                    'Prepare for technical interviews'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 mt-1 text-primary">
                        <FiChevronRight className="w-5 h-5"/>
                      </span>
                      <span className="text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LearningPage;