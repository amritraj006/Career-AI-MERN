import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { UserButton, useUser, useClerk } from '@clerk/clerk-react';
import { Menu, Sparkles, ChevronRight, LogIn } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Breadcrumbs Generator
  const getBreadcrumbs = () => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab') || 'overview';

    const crumbs = [{ label: 'PathCraft', to: '/' }];

    if (path === '/') {
      crumbs.push({ label: 'Home' });
    } else if (path === '/about') {
      crumbs.push({ label: 'About' });
    } else if (path.startsWith('/my-dashboard')) {
      crumbs.push({ label: 'Dashboard', to: '/my-dashboard' });
      const tabLabels = {
        overview: 'Overview',
        saved: 'Saved Careers',
        roadmaps: 'Saved Roadmaps',
        assessment: 'My Assessment',
        profile: 'Profile Details',
      };
      crumbs.push({ label: tabLabels[tab] || 'Overview' });
    } else if (path.startsWith('/roadmap-generator')) {
      crumbs.push({ label: 'AI Coach' });
      crumbs.push({ label: 'Roadmap Generator', to: '/roadmap-generator' });
    } else if (path.startsWith('/interview-prep')) {
      crumbs.push({ label: 'AI Coach' });
      crumbs.push({ label: 'Interview Prep', to: '/interview-prep' });
    } else if (path.startsWith('/career-test')) {
      crumbs.push({ label: 'AI Coach' });
      crumbs.push({ label: 'Career Assessment', to: '/career-test' });
    } else if (path.startsWith('/pathways')) {
      crumbs.push({ label: 'Explore' });
      if (path === '/pathways') {
        crumbs.push({ label: 'Career Pathways', to: '/pathways' });
      } else {
        crumbs.push({ label: 'Pathways', to: '/pathways' });
        crumbs.push({ label: 'Pathway Details' });
      }
    } else if (path.startsWith('/comparison-tool-page')) {
      crumbs.push({ label: 'Explore' });
      crumbs.push({ label: 'Comparison Tool', to: '/comparison-tool-page' });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex">
      {/* Desktop Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Mobile Drawer Navigation */}
      <MobileSidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      {/* Main Body */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isCollapsed ? 'md:pl-20' : 'md:pl-64'
        }`}
      >
        {/* Sticky Top Navbar */}
        <header className="sticky top-0 z-30 h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 shadow-sm">
          {/* Left Side: Mobile Menu Toggle & Breadcrumbs */}
          <div className="flex items-center space-x-4">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Links */}
            <nav className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300" />}
                  {crumb.to ? (
                    <Link
                      to={crumb.to}
                      className="hover:text-primary transition-colors hover:underline"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-800 font-bold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* AI Engine Tag */}
            <div className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 shadow-sm text-xs font-bold text-primary animate-pulse-glow">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Engine Active</span>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-100">
              {isSignedIn ? (
                <>
                  {user && (
                    <div className="hidden lg:flex flex-col text-right">
                      <span className="text-xs font-bold text-slate-800">{user.fullName}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {user.primaryEmailAddress?.emailAddress}
                      </span>
                    </div>
                  )}
                  <UserButton
                    appearance={{
                      elements: {
                        userButtonAvatarBox: 'w-9 h-9 border border-slate-100 shadow-sm',
                      },
                    }}
                  />
                </>
              ) : (
                <Link
                  id="header-sign-in-btn"
                  to="/sign-in"
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull text-white text-xs font-bold rounded-full transition-colors shadow-sm cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
