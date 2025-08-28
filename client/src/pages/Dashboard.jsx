import {
  useUser,
  UserButton,
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, Suspense, useMemo, memo } from "react";
import {
  User,
  BookOpen,
  Map,
  ChevronRight,
  ChevronDown,
  LogOut,
  Home,
  Loader2,
  CheckCircle,
  BarChart2,
  Clock,
  Award
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { pathways as allPathways } from "../assets/pathwaysData";
import { resources } from "../assets/resources";

// Optimized Course Card Component
const CourseCard = memo(({ course, navigate }) => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-900/70 p-5 shadow-lg hover:shadow-xl transition-all duration-200 h-full">
      {/* Course Thumbnail */}
      <div className="overflow-hidden rounded-lg mb-4 aspect-video relative">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Category + Price Row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs bg-rose-500/20 text-rose-400 px-2.5 py-1 rounded-full font-medium tracking-wide">
          {course.category || "General"}
        </span>
        <span className="text-sm text-gray-300 font-medium bg-gray-800/50 px-2.5 py-1 rounded-md">
          {course.price || "Free"}
        </span>
      </div>

      {/* Course Title */}
      <h3 className="text-lg font-bold text-white mb-4 leading-tight line-clamp-2 hover:text-rose-400 transition-colors duration-150">
        {course.name}
      </h3>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 rounded-full h-1.5 mb-4">
        <div 
          className="bg-gradient-to-r from-rose-500 to-amber-400 h-1.5 rounded-full" 
          style={{ width: `${course.progress || 0}%` }}
        ></div>
      </div>

      {/* CTA Button */}
      <button 
        className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white py-2.5 rounded-lg text-sm font-semibold shadow-md transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
        onClick={() => navigate(`/resources/learning-page/${course.resourceId}`)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        {course.progress > 0 ? "Continue Learning" : "Start Learning"}
      </button>
    </div>
  );
});

const DashboardContent = () => {
  
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");
  const [pathways, setPathways] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const url = "https://career-ai-mern.onrender.com";

  const sidebarItems = [
    { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
    { id: "courses", icon: <BookOpen className="w-5 h-5" />, label: "My Courses" },
    { id: "pathway", icon: <Map className="w-5 h-5" />, label: "Learning Path" }
  ];

  // Memoize the enrolled courses to prevent unnecessary re-renders
  const memoizedCourses = useMemo(() => enrolledCourses, [enrolledCourses]);

  useEffect(() => {
    const fetchSubscribedPathways = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${url}/api/user-pathways`, {
          params: { email: user.primaryEmailAddress.emailAddress }
        });

        const subscribedIds = res.data.pathwayIds;
        const matchedPathways = allPathways.filter((path) =>
          subscribedIds.includes(path.id)
        );

        setPathways(matchedPathways);
      } catch (error) {
        console.error("Failed to fetch subscribed pathways:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchSubscribedPathways();
    }
  }, [user]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.post(`${url}/api/course/enrolled-ids`, {
          userEmail: user.primaryEmailAddress.emailAddress,
        });

        const enrolledIds = res.data.enrolledIds || [];
        const matchedCourses = resources.filter(resource =>
          enrolledIds.includes(resource.resourceId)
        );

        setEnrolledCourses(matchedCourses);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
      }
    };

    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 font-sans text-gray-100">
      {/* Enhanced Glass Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-72 bg-gray-900/80 backdrop-blur-md shadow-2xl flex flex-col border-r border-gray-800/50"
      >
        {/* Logo with subtle animation */}
        <div className="p-6 border-b border-gray-800/50">
           <Link to='/' className='max-md:flex-1 flex items-center gap-2'>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
                      </svg>
                    </div>
                    <span className="text-xl max-md:hidden font-medium ">CareerAI</span>
                  </div>
              </Link>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-800/50 flex items-center justify-between">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-500/50 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-900 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </motion.div>
            <div className="ml-3">
              <p className="font-semibold text-white truncate max-w-[120px]">{user.fullName}</p>
              <p className="text-xs text-gray-400/80 truncate max-w-[120px]">
                {user.primaryEmailAddress.emailAddress}
              </p>
            </div>
          </div>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8",
                userButtonPopoverCard: "bg-gray-900 border border-gray-800/50 backdrop-blur-lg",
                userButtonPopoverActionButtonText: "text-white",
                userButtonPopoverActionButton: "hover:bg-gray-800/50"
              }
            }} 
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col p-4 space-y-1 flex-grow">
          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-rose-600/20 to-rose-500/10 text-rose-400 shadow-md"
                  : "text-gray-400 hover:bg-gray-800/30"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {activeSection === item.id ? (
                <ChevronDown className="w-5 h-5 text-rose-400" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 border-t border-gray-800/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => signOut(() => navigate("/"))}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-800/30 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3 text-rose-500" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-800/50"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Card */}
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="bg-gray-900 rounded-2xl p-6 border border-gray-800/50 shadow-lg w-full lg:w-1/3"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="relative mb-6"
                    >
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-rose-500/30 shadow-xl"
                      />
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-900 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-center mb-1">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-400 text-sm mb-6 flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-400" />
                      Premium Member
                    </p>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-gray-900 p-4 rounded-xl border border-gray-800/30 text-center hover:bg-gray-800/50 transition-colors">
                        <p className="text-sm text-gray-400 mb-1">Enrolled Courses</p>
                        <p className="font-bold text-white text-xl">{enrolledCourses.length}</p>
                      </div>
                      <div className="bg-gray-900 p-4 rounded-xl border border-gray-800/30 text-center hover:bg-gray-800/50 transition-colors">
                        <p className="text-sm text-gray-400 mb-1">Learning Paths</p>
                        <p className="font-bold text-white text-xl">{pathways.length}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Profile Details */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">
                    Personal Dashboard
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Account Details Card */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800/30 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="bg-rose-500/10 p-2 rounded-lg mr-3">
                          <User className="w-5 h-5 text-rose-400" />
                        </div>
                        <h3 className="font-semibold">Account Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-400/80 mb-1">Email</p>
                          <p className="font-medium text-gray-200">{user.primaryEmailAddress.emailAddress}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400/80 mb-1">Username</p>
                          <p className="font-medium text-gray-200">{user.username || "Not set"}</p>
                        </div>
                      </div>
                    </div>

                    {/* Membership Card */}
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800/30 shadow-md hover:shadow-lg transition-shadow">
                      <div className="flex items-center mb-4">
                        <div className="bg-rose-500/10 p-2 rounded-lg mr-3">
                          <CheckCircle className="w-5 h-5 text-rose-400" />
                        </div>
                        <h3 className="font-semibold">Membership</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-400/80 mb-1">Member Since</p>
                          <p className="font-medium text-gray-200">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400/80 mb-1">Status</p>
                          <p className="font-medium text-gray-200 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Active
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activity Overview */}
                  <div className="bg-gray-900 p-6 rounded-xl border border-gray-800/30 shadow-md">
                    <div className="flex items-center mb-4">
                      <div className="bg-rose-500/10 p-2 rounded-lg mr-3">
                        <BarChart2 className="w-5 h-5 text-rose-400" />
                      </div>
                      <h3 className="font-semibold">Learning Activity</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Last Active</p>
                        <p className="font-medium text-gray-200 flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Today
                        </p>
                      </div>
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Completion Rate</p>
                        <p className="font-medium text-gray-200">
                          {enrolledCourses.length > 0 
                            ? `${Math.round(enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) / enrolledCourses.length)}%` 
                            : "0%"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Courses Section */}
          {activeSection === "courses" && (
            <motion.section
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-800/50"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">
                    My Courses
                  </h2>
                  <p className="text-gray-400">
                    {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button 
                  className="flex items-center bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg"
                  onClick={() => navigate('/resources')}
                >
                  Explore More Courses
                </button>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800/30">
                    <BookOpen className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Enrolled Courses</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    You haven't enrolled in any courses yet. Browse our catalog to start learning.
                  </p>
                  <button
                    className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                    onClick={() => navigate("/resources")}
                  >
                    Browse Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {memoizedCourses.map((course) => (
                    <CourseCard key={course.resourceId} course={course} navigate={navigate} />
                  ))}
                </div>
              )}
            </motion.section>
          )}

          {/* Learning Path Section */}
          {activeSection === "pathway" && (
            <motion.section
              key="pathway"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-800/50"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-amber-400 bg-clip-text text-transparent">
                    Learning Paths
                  </h2>
                  <p className="text-gray-400">
                    {pathways.length} active path{pathways.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button 
                  className="flex items-center bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg"
                  onClick={() => navigate('/pathways')}
                >
                  Explore All Paths
                </button>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                </div>
              ) : pathways.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-6 border border-gray-800/30">
                    <Map className="w-10 h-10 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Learning Paths Yet</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto">
                    You haven't subscribed to any learning paths yet. Explore our curated paths to start your career journey.
                  </p>
                  <button
                    className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
                    onClick={() => navigate("/pathways")}
                  >
                    Browse Learning Paths
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pathways.map((path) => (
                    <motion.div
                      key={path.id}
                      whileHover={{ y: -5 }}
                      className="bg-gray-900 border border-gray-800/50 rounded-xl p-6 hover:shadow-lg transition-all group"
                    >
                      <div className="flex items-start mb-4">
                        <div className="bg-rose-500/10 p-3 rounded-lg mr-4 border border-gray-800/30">
                          <Map className="w-6 h-6 text-rose-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold group-hover:text-rose-400 transition-colors">
                            {path.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2">{path.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-6">
                        <div className="flex items-center text-sm text-gray-400">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {path.courses?.length || 0} courses
                        </div>
                        <button
                          className="bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white py-2 px-4 rounded-lg transition-all text-sm font-medium shadow-sm"
                          onClick={() => navigate(`/pathways/${path.id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const DashboardLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-950">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full mx-auto mb-4"
      ></motion.div>
      <h2 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h2>
      <p className="text-gray-400">Preparing your learning experience</p>
    </div>
  </div>
);

const Dashboard = () => (
  <>
    <SignedIn>
      <Suspense fallback={<DashboardLoader />}>
        <DashboardContent />
      </Suspense>
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default Dashboard;