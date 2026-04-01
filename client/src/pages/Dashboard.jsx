import {
  useUser,
  UserButton,
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn
} from "@clerk/clerk-react";
import { useState, useEffect, Suspense, useMemo, memo } from "react";
import {
  User,
  BookOpen,
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
import apiService from "../services/apiService";
import { resources } from "../assets/resources";

// Optimized Course Card Component
const CourseCard = memo(({ course, navigate }) => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
      {/* Course Thumbnail */}
      <div className="overflow-hidden rounded-lg mb-4 aspect-video relative group">
        <img
          src={course.image}
          alt={course.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </div>

      {/* Category + Price Row */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs bg-rose-50 text-primary px-2.5 py-1 rounded-full font-medium tracking-wide">
          {course.category || "General"}
        </span>
        <span className="text-sm text-gray-700 font-medium bg-gray-100 px-2.5 py-1 rounded-md">
          {course.price || "Free"}
        </span>
      </div>

      {/* Course Title */}
      <h3 className="text-lg font-bold text-gray-900 mb-4 leading-tight line-clamp-2 hover:text-primary transition-colors duration-150">
        {course.name}
      </h3>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div 
          className="bg-primary h-1.5 rounded-full" 
          style={{ width: `${course.progress || 0}%` }}
        ></div>
      </div>

      {/* CTA Button */}
      <button 
        className="w-full bg-primary hover:bg-primary-dull text-white py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
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
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const sidebarItems = [
    { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
    { id: "courses", icon: <BookOpen className="w-5 h-5" />, label: "My Courses" }
  ];

  const memoizedCourses = useMemo(() => enrolledCourses, [enrolledCourses]);

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const data = await apiService.getEnrolledCourses(user.primaryEmailAddress.emailAddress);
        const enrolledIds = data.enrolledIds || [];
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
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-lg flex flex-col border-r border-gray-200">
        <div className="p-6 border-b border-gray-100">
           <Link to='/' className='max-md:flex-1 flex items-center gap-2'>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mr-2">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
                      </svg>
                    </div>
                    <span className="text-xl max-md:hidden font-medium text-gray-900">CareerAI</span>
                  </div>
              </Link>
        </div>

        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative hover:scale-105 transition-transform">
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-900 truncate max-w-[120px]">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate max-w-[120px]">
                {user.primaryEmailAddress.emailAddress}
              </p>
            </div>
          </div>
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "w-8 h-8"
              }
            }} 
          />
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-grow">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-rose-50 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {activeSection === item.id ? (
                <ChevronDown className="w-5 h-5 text-primary" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut(() => navigate("/"))}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3 text-primary" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Areas */}
      <main className="flex-1 p-8 overflow-y-auto">
          {activeSection === "profile" && (
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 fade-in">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Profile Card */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 w-full lg:w-1/3 text-center">
                  <div className="flex justify-center mb-6">
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto"
                    />
                  </div>
                  <h1 className="text-2xl font-bold mb-1 text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-gray-500 text-sm mb-6 flex items-center justify-center gap-1">
                    <Award className="w-4 h-4 text-primary" />
                    Premium Member
                  </p>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-sm text-gray-500 mb-1">Enrolled Courses</p>
                    <p className="font-bold text-gray-900 text-xl">{enrolledCourses.length}</p>
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-8 text-gray-900">
                    Personal Dashboard
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Account Details</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <p className="font-medium text-gray-900">{user.primaryEmailAddress.emailAddress}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Username</p>
                          <p className="font-medium text-gray-900">{user.username || "Not set"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <div className="flex items-center mb-4">
                        <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Membership</h3>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Member Since</p>
                          <p className="font-medium text-gray-900">
                            {new Date(user.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', month: 'long', day: 'numeric' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Status</p>
                          <p className="font-medium text-gray-900 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Active
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center mb-4">
                      <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                        <BarChart2 className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Learning Activity</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Last Active</p>
                        <p className="font-medium text-gray-900 flex items-center gap-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          Today
                        </p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">Completion Rate</p>
                        <p className="font-medium text-gray-900">
                          {enrolledCourses.length > 0 
                            ? `${Math.round(enrolledCourses.reduce((acc, course) => acc + (course.progress || 0), 0) / enrolledCourses.length)}%` 
                            : "0%"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeSection === "courses" && (
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 fade-in">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">My Courses</h2>
                  <p className="text-gray-500">
                    {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <button 
                  className="bg-primary hover:bg-primary-dull text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                  onClick={() => navigate('/resources')}
                >
                  Explore More Courses
                </button>
              </div>

              {enrolledCourses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">No Enrolled Courses</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    You haven't enrolled in any courses yet. Browse our catalog to start learning.
                  </p>
                  <button
                    className="bg-primary hover:bg-primary-dull text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
            </section>
          )}
      </main>
    </div>
  );
};

const DashboardLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
      <p className="text-gray-500">Preparing your learning experience</p>
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