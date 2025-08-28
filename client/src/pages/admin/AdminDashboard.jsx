import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, BookOpen, Map, PlusCircle, ChevronRight, ChevronDown, LogOut, CheckCircle, Upload, Image } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BlurCircle from '../../components/BlurCircle';
import { toast } from 'sonner';
import { resources } from '../../assets/resources';
import { pathways } from '../../assets/pathwaysData';

const AdminDashboardContent = () => {
  const navigate = useNavigate();
  const url = "https://career-ai-mern.onrender.com";
  const [activeSection, setActiveSection] = useState(() => {
    // Get last active section from localStorage
    return localStorage.getItem('adminActiveSection') || 'profile';
  });
  const [totalUsers, setTotalUsers] = useState(0);

useEffect(() => {
  const fetchActiveUsers = async () => {
    try {
      const res = await fetch(`${url}/api/admin/active-users`);
      if (!res.ok) throw new Error('Network response was not ok');

      const data = await res.json();
      setTotalUsers(data.count); // ✅ sets count
    } catch (err) {
      console.error('Failed to fetch active users', err);
    }
  };

  fetchActiveUsers();
}, []);


  const [isEnvReady, setIsEnvReady] = useState(false);
  const [profileImage, setProfileImage] = useState(() => {
    // Get profile image from localStorage
    return localStorage.getItem('adminProfileImage') || '';
  });
  const fileInputRef = useRef(null);

  // Get admin info from .env with validation
  const adminName = import.meta.env.VITE_ADMIN_NAME || 'Admin';
  const adminEmail = import.meta.env.VITE_EMAIL_USER;

  useEffect(() => {
    if (!adminEmail) {
      toast.error('Admin email not configured in environment variables');
      console.error('Missing VITE_EMAIL_USER in .env');
    } else {
      setIsEnvReady(true);
    }
  }, [adminEmail]);

  // Save active section to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('adminActiveSection', activeSection);
  }, [activeSection]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match('image.*')) {
      toast.error('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      setProfileImage(imageUrl);
      localStorage.setItem('adminProfileImage', imageUrl);
      toast.success('Profile image updated');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const sidebarItems = [
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Admin Profile' },
    
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' }
  ];

  if (!isEnvReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#09090B] to-[#1A1A1E]">
        <div className="bg-[#1A1A1E] p-8 rounded-xl border border-red-500/30 text-center max-w-md">
          <div className="w-16 h-16 mx-auto bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <Settings className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Configuration Error</h2>
          <p className="text-gray-400 mb-4">Admin email is not properly configured in system settings.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium border border-red-500/20 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#09090B] to-[#1A1A1E] font-sans text-white overflow-hidden">
      {/* Background elements */}
     
      <BlurCircle bottom="10%" right="5%" color="blue" size="lg" opacity="20" />
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />
      
      {/* Glass Sidebar */}
      <motion.aside
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="w-72 bg-[#1A1A1E]/80 backdrop-blur-lg shadow-2xl flex flex-col border-r border-gray-800/50 z-10"
      >
        {/* Logo */}
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

        {/* Admin Info */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              className="relative cursor-pointer"
              onClick={triggerFileInput}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Admin Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#F84565]/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F84565] to-[#D63854] flex items-center justify-center text-white font-bold">
                  {adminName.charAt(0)}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#1A1A1E] flex items-center justify-center">
                <Upload className="w-3 h-3 text-white" />
              </div>
            </motion.div>
            <div className="ml-3">
              <p className="font-semibold text-white">{adminName}</p>
              <p className="text-xs text-gray-400/80">{adminEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-4 space-y-1 flex-grow">

          {sidebarItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSection(item.id)}
              
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-[#F84565]/20 to-[#D63854]/10 text-[#F84565] shadow-md"
                  : "text-gray-400 hover:bg-gray-800/30"
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>
              {activeSection === item.id ? (
                <ChevronDown className="w-5 h-5 text-[#F84565]" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-500" />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-800/50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin');
            }}
            className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-gray-800/30 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3 text-[#F84565]" />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeSection === 'profile' && (
            <motion.section
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1A1A1E]/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800/50"
            >
              <div className="flex flex-col md:flex-row gap-8">
                {/* Admin Profile Card */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#1A1A1E] rounded-2xl p-6 border border-gray-800/50 shadow-lg w-full md:w-1/3"
                >
                  <div className="flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      className="relative mb-6 cursor-pointer"
                      onClick={triggerFileInput}
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Admin Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-[#F84565]/30"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-[#F84565] to-[#D63854] flex items-center justify-center text-white text-4xl font-bold">
                          {adminName.charAt(0)}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-[#1A1A1E] flex items-center justify-center">
                        <Image className="w-3 h-3 text-white" />
                      </div>
                    </motion.div>
                    <h1 className="text-2xl font-bold text-center mb-1">
                      {adminName}
                    </h1>
                    <p className="text-gray-400 text-sm mb-4">Super Admin</p>
                    <button
                      onClick={triggerFileInput}
                      className="w-full bg-[#F84565] hover:bg-[#D63854] text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors shadow-sm mb-4"
                    >
                      Change Profile Image
                    </button>
                    <div className="grid grid-cols-2 gap-4 w-full">
                      <div className="bg-[#1A1A1E] p-3 rounded-lg border border-gray-800/30 text-center">
                        <p className="text-sm text-gray-400">Active Users</p>
                        <p className="font-bold text-white">{totalUsers}</p>
                      </div>
                      <div className="bg-[#1A1A1E] p-3 rounded-lg border border-gray-800/30 text-center">
                        <p className="text-sm text-gray-400">Admin Since</p>
                        <p className="font-bold text-white">2025</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Admin Details */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-[#F84565] to-[#FF8A9B] bg-clip-text text-transparent">
                    Admin Dashboard
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1A1A1E] p-6 rounded-xl border border-gray-800/30 shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="bg-[#F84565]/10 p-2 rounded-lg mr-3">
                          <User className="w-5 h-5 text-[#F84565]" />
                        </div>
                        <h3 className="font-semibold">Admin Details</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-400/80">Name</p>
                          <p className="font-medium">{adminName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400/80">Email</p>
                          <p className="font-medium">{adminEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#1A1A1E] p-6 rounded-xl border border-gray-800/30 shadow-md">
                      <div className="flex items-center mb-4">
                        <div className="bg-[#F84565]/10 p-2 rounded-lg mr-3">
                          <Settings className="w-5 h-5 text-[#F84565]" />
                        </div>
                        <h3 className="font-semibold">System Status</h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-400/80">Total Users</p>
                          <p className="font-medium">{totalUsers}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400/80">Status</p>
                          <p className="font-medium text-green-500">All Systems Operational</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="bg-[#1A1A1E] p-6 rounded-xl border border-gray-800/30 shadow-md mb-8">
                    <h3 className="font-semibold mb-4">Quick Stats</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-[#1A1A1E] p-3 rounded-lg border border-gray-800/30 text-center">
                        <p className="text-sm text-gray-400">Courses</p>
                        <p className="font-bold text-white">{resources.length}</p>
                      </div>
                      <div className="bg-[#1A1A1E] p-3 rounded-lg border border-gray-800/30 text-center">
                        <p className="text-sm text-gray-400">Pathways</p>
                        <p className="font-bold text-white">{pathways.length}</p>
                      </div>
                      <div className="bg-[#1A1A1E] p-3 rounded-lg border border-gray-800/30 text-center">
                        <p className="text-sm text-gray-400">Posts</p>
                        <p className="font-bold text-white">0</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Placeholder for other sections */}
          {activeSection !== 'profile' && (
            <motion.section
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-[#1A1A1E]/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-gray-800/50 flex items-center justify-center h-96"
            >
              <div className="text-center">
                <div className="mx-auto w-24 h-24 bg-[#1A1A1E] rounded-full flex items-center justify-center mb-6 border border-gray-800/30">
                  {activeSection === 'settings' && <Settings className="w-10 h-10 text-[#F84565]" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeSection === 'settings' && 'Settings Section'}
                </h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  This section will be implemented soon
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const AdminDashboardLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#09090B] to-[#1A1A1E]">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#F84565] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-white">Loading Admin Dashboard</h2>
      <p className="text-gray-400">Initializing admin privileges</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/admin';
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <AdminDashboardLoader />;
  }

  return (
    <Suspense fallback={<AdminDashboardLoader />}>
      <AdminDashboardContent />
    </Suspense>
  );
};

export default AdminDashboard;