import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resources } from '../assets/resources';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/clerk-react';
import { FiArrowLeft, FiArrowRight, FiCheck, FiChevronRight } from 'react-icons/fi';
import BlurCircle from '../components/BlurCircle';

const LearningPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const url = "https://career-ai-mern.onrender.com";

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
  }, [resourceId, isSignedIn, user]);

  useEffect(() => {
    checkCourseAccess();
    const handleAuthChange = () => isSignedIn ? checkCourseAccess() : setHasAccess(false);
    window.addEventListener('clerk:session', handleAuthChange);
    return () => window.removeEventListener('clerk:session', handleAuthChange);
  }, [checkCourseAccess, isSignedIn]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.02, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-6 animate-pulse"></div>
          <div className="h-6 bg-gray-700 rounded w-64 mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-700 rounded w-56 mb-3 animate-pulse"></div>
        </motion.div>
      </div>
    );
  }

  if (!course) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900 flex items-center justify-center"
      >
        <div className="text-center p-8 max-w-md">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-primary to-primary-dull bg-clip-text text-transparent"
          >
            Course Not Found
          </motion.h1>
          <motion.p className="text-lg text-gray-300">
            The requested course doesn't exist in our library.
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/resources')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-primary to-primary-dull text-white rounded-lg font-medium shadow-lg"
          >
            Browse All Courses
          </motion.button>
        </div>
      </motion.div>
    );
  }

  if (!hasAccess) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gray-900 flex items-center justify-center"
      >
        <div className="text-center p-8 max-w-md">
          <motion.h1 className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-primary to-primary-dull bg-clip-text text-transparent">
            Access Denied
          </motion.h1>
          <motion.p className="text-lg text-gray-300 mb-6">
            {isSignedIn ? 'You need to enroll in this course.' : 'Sign in to access this course.'}
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => isSignedIn ? navigate(`/course/${resourceId}/enroll`) : openSignIn()}
            className={`px-6 py-3 rounded-lg font-medium shadow-lg ${
              isSignedIn 
                ? 'bg-gradient-to-r from-primary to-primary-dull text-white'
                : 'bg-gradient-to-r from-primary to-primary-dull text-white'
            }`}
          >
            {isSignedIn ? 'Enroll Now' : 'Sign In'}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={course.resourceId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen pt-16 md:pt-30 bg-gray-900"
      >
        {/* Navigation Buttons */}
        <div className="container mx-auto px-4 pt-6">
          <div className="flex justify-between">
            <motion.button
              onClick={() => navigate('/my-dashboard')}
              whileHover={{ x: -3 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg shadow-md text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Dashboard</span>
            </motion.button>
            
            <motion.button
              onClick={() => navigate('/resources')}
              whileHover={{ x: 3 }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg shadow-md text-gray-200 hover:bg-gray-700 transition-colors"
            >
              <span>Browse Courses</span>
              <FiArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <BlurCircle top="-100px" left="-100px" color="purple" size="lg" />
          <BlurCircle bottom="-100px" right="-100px" color="blue" size="lg" />
          <BlurCircle top="30%" right="10%" color="indigo" size="md" opacity="30" />
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Video & Details */}
            <div className="lg:w-2/3">
              {/* Video Player */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black"
              >
                {!videoLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-gray-600 border-t-primary rounded-full"
                    />
                  </div>
                )}
                <iframe
                  src={course.video}
                  title={course.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  onLoad={() => setVideoLoaded(true)}
                  loading="eager"
                />
              </motion.div>

              {/* Course Details */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 p-8 rounded-xl bg-gray-800 shadow-lg border border-gray-700"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                      {course.name}
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
                        {course.category}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-400">
                        {course.price} • Paid Course
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-lg text-gray-300 mb-8">
                  {course.description}
                </p>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">
                      <FiCheck className="text-primary-light" />
                    </span>
                    Skills You'll Gain
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skillsRequired.map((skill, index) => (
                      <motion.span
                        key={index}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700 text-gray-200 hover:bg-primary/20 hover:text-primary-light transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Course Features */}
            <div className="lg:w-1/3">
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="sticky top-8 space-y-6"
              >
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl bg-gray-800 shadow-lg border border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">
                      <FiCheck className="text-primary-light" />
                    </span>
                    Course Features
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Professional certification',
                      'Self-paced learning',
                      'Industry-relevant curriculum',
                      'Expert instructor support',
                      'Lifetime access to materials'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-1 text-primary-light">
                          <FiCheck />
                        </span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-xl bg-gray-800 shadow-lg border border-gray-700"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="bg-primary/20 p-1 rounded-full">
                      <FiChevronRight className="text-primary-light" />
                    </span>
                    Learning Outcomes
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Master core concepts',
                      'Real-world applications',
                      'Professional-grade projects',
                      'Portfolio-ready work',
                      'Competitive advantage'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 mt-1 text-primary-light">
                          <FiChevronRight />
                        </span>
                        <span className="text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
};

export default LearningPage;