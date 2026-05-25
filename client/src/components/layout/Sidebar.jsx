import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import {
  LayoutDashboard,
  Map,
  MessageSquare,
  Brain,
  Layers,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Bookmark,
  User,
  Compass,
  Home,
  Info,
  LogIn,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import Logo from '../Logo';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(() => navigate('/'));
  };

  // Navigation sections
  const appItems = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, to: '/' },
    { label: 'About', icon: <Info className="w-5 h-5" />, to: '/about' },
  ];

  const workspaceItems = isSignedIn
    ? [
        {
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
          to: '/my-dashboard',
          tab: 'overview',
          subItems: [
            { label: 'Overview', to: '/my-dashboard', tab: 'overview', icon: <Compass className="w-4 h-4" /> },
            { label: 'Saved Careers', to: '/my-dashboard', tab: 'saved', icon: <Bookmark className="w-4 h-4" /> },
            { label: 'Saved Roadmaps', to: '/my-dashboard', tab: 'roadmaps', icon: <Map className="w-4 h-4" /> },
            { label: 'My Assessment', to: '/my-dashboard', tab: 'assessment', icon: <ClipboardList className="w-4 h-4" /> },
            { label: 'Profile', to: '/my-dashboard', tab: 'profile', icon: <User className="w-4 h-4" /> },
          ],
        },
      ]
    : [];

  const aiCoachingItems = [
    { label: 'Roadmap Generator', icon: <Map className="w-5 h-5" />, to: '/roadmap-generator' },
    { label: 'Interview Coach', icon: <MessageSquare className="w-5 h-5" />, to: '/interview-prep' },
    { label: 'Career Assessment', icon: <Brain className="w-5 h-5" />, to: '/career-test' },
  ];

  const explorerItems = [
    { label: 'Career Pathways', icon: <Layers className="w-5 h-5" />, to: '/pathways' },
    { label: 'Comparison Tool', icon: <HelpCircle className="w-5 h-5" />, to: '/comparison-tool-page' },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-100 flex flex-col justify-between transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      } hidden md:flex`}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 min-h-0">
        {/* Logo */}
        <div className={`p-5 flex items-center border-b border-slate-50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          <Link to="/" className="flex items-center gap-3 group px-2">
            <Logo className="w-10 h-10" />
            {!isCollapsed && (
              <span className="text-xl font-bold text-slate-900 tracking-tight">PathCraft</span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 no-scrollbar">

          {/* App Section */}
          <div>
            {!isCollapsed && (
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                App
              </p>
            )}
            <div className="space-y-1">
              {appItems.map((item, idx) => (
                <SidebarItem key={idx} {...item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>

          {/* Workspace Group (only if signed in) */}
          {isSignedIn && workspaceItems.length > 0 && (
            <div>
              {!isCollapsed && (
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                  Workspace
                </p>
              )}
              <div className="space-y-1">
                {workspaceItems.map((item, idx) => (
                  <SidebarItem key={idx} {...item} isCollapsed={isCollapsed} />
                ))}
              </div>
            </div>
          )}

          {/* AI Tools Group */}
          <div>
            {!isCollapsed && (
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                AI Coach
              </p>
            )}
            <div className="space-y-1">
              {aiCoachingItems.map((item, idx) => (
                <SidebarItem key={idx} {...item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>

          {/* Explorer Group */}
          <div>
            {!isCollapsed && (
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                Explore
              </p>
            )}
            <div className="space-y-1">
              {explorerItems.map((item, idx) => (
                <SidebarItem key={idx} {...item} isCollapsed={isCollapsed} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-3.5 border-t border-slate-50 space-y-1 bg-white">
        {/* User Info (signed in) */}
        {isSignedIn && !isCollapsed && user && (
          <div className="flex items-center gap-3 px-3.5 py-2.5 mb-1 bg-slate-50 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {/** If image url is present display image else First Letter */}
        {user.imageUrl ? (
            <img src={user.imageUrl} alt="" className="w-full h-full object-cover rounded-full" />
        ) : (
            <span className="text-xs font-bold text-primary">
                {user.firstName?.charAt(0) || '?'}
              </span>
        )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
              
              <p className="text-[10px] text-slate-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        )}

        {/* Toggle Collapse */}
        <button
          id="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center w-full px-3.5 py-2.5 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all font-medium cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 mx-auto" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 mr-3 flex-shrink-0" />
              <span className="text-sm font-semibold">Collapse</span>
            </>
          )}
        </button>

        {/* Sign In / Sign Out */}
        {isSignedIn ? (
          <button
            id="sidebar-signout-btn"
            onClick={handleSignOut}
            className="flex items-center w-full px-3.5 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all font-medium cursor-pointer"
          >
            {isCollapsed ? (
              <LogOut className="w-5 h-5 mx-auto text-primary" />
            ) : (
              <>
                <LogOut className="w-5 h-5 mr-3 flex-shrink-0 text-primary" />
                <span className="text-sm font-semibold">Sign Out</span>
              </>
            )}
          </button>
        ) : (
          <button
            id="sidebar-signin-btn"
            onClick={() => openSignIn()}
            className="flex items-center w-full px-3.5 py-2.5 text-white bg-primary hover:bg-primary-dull rounded-xl transition-all font-medium cursor-pointer"
          >
            {isCollapsed ? (
              <LogIn className="w-5 h-5 mx-auto" />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-3 flex-shrink-0" />
                <span className="text-sm font-semibold">Sign In</span>
              </>
            )}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
