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



const DashboardContent = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("profile");


  const sidebarItems = [
    { id: "profile", icon: <User className="w-5 h-5" />, label: "Profile" },
   
  ];

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

          
                </div>
              </div>
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