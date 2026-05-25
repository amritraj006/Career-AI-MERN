import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  MessageSquare,
  Brain,
  Layers,
  HelpCircle,
  LogOut,
  X,
  Compass,
  Bookmark,
  ClipboardList,
  User,
  Home,
  Info,
  LogIn,
} from 'lucide-react';
import SidebarItem from './SidebarItem';
import Logo from '../Logo';

export const MobileSidebar = ({ isOpen, onClose }) => {
  const { user, isSignedIn } = useUser();
  const { signOut, openSignIn } = useClerk();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(() => navigate('/'));
    onClose();
  };

  const appItems = [
    { label: 'Home', icon: <Home className="w-5 h-5" />, to: '/' },
    { label: 'About', icon: <Info className="w-5 h-5" />, to: '/about' },
  ];

  const workspaceItems = isSignedIn
    ? [
        {
          label: 'Dashboard',
          icon: <LayoutDashboard className="w-5 h-5" />,
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col justify-between z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 flex items-center justify-between border-b border-slate-50">
              <Link to="/" className="flex items-center gap-3 group" onClick={onClose}>
                <Logo className="w-10 h-10" />
                <span className="text-xl font-bold text-slate-900 tracking-tight">PathCraft</span>
              </Link>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar">

              {/* App Section */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                  App
                </p>
                <div className="space-y-1">
                  {appItems.map((item, idx) => (
                    <SidebarItem key={idx} {...item} onClick={onClose} />
                  ))}
                </div>
              </div>

              {/* Workspace (signed in only) */}
              {isSignedIn && workspaceItems.length > 0 && (
                <div>
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                    Workspace
                  </p>
                  <div className="space-y-1">
                    {workspaceItems.map((item, idx) => (
                      <SidebarItem key={idx} {...item} onClick={onClose} />
                    ))}
                  </div>
                </div>
              )}

              {/* AI Coach */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                  AI Coach
                </p>
                <div className="space-y-1">
                  {aiCoachingItems.map((item, idx) => (
                    <SidebarItem key={idx} {...item} onClick={onClose} />
                  ))}
                </div>
              </div>

              {/* Explore */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3.5 mb-2">
                  Explore
                </p>
                <div className="space-y-1">
                  {explorerItems.map((item, idx) => (
                    <SidebarItem key={idx} {...item} onClick={onClose} />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-50 space-y-2 bg-white">
              {/* User info if signed in */}
              {isSignedIn && user && (
                <div className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-xl mb-1">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {user.firstName?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{user.fullName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              )}

              {isSignedIn ? (
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3.5 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all font-semibold cursor-pointer"
                >
                  <LogOut className="w-5 h-5 mr-3 flex-shrink-0 text-primary" />
                  <span className="text-sm">Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => { openSignIn(); onClose(); }}
                  className="flex items-center w-full px-3.5 py-2.5 text-white bg-primary hover:bg-primary-dull rounded-xl transition-all font-semibold cursor-pointer"
                >
                  <LogIn className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-sm">Sign In</span>
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;
