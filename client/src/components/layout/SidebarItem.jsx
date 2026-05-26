import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const SidebarItem = ({
  icon,
  label,
  to,
  tab, // Query param check e.g. "overview" for /my-dashboard?tab=overview
  subItems = [],
  isCollapsed = false,
  onClick,
  onExpandSidebar,
}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Check if item or any of its sub-items are active
  const isUrlActive = (path, queryTab) => {
    if (!path) return false;
    const samePath = location.pathname === path;
    if (!samePath) return false;
    if (queryTab) {
      const searchParams = new URLSearchParams(location.search);
      return searchParams.get('tab') === queryTab;
    }
    // If no tab is expected but URL has tab, maybe it's not active
    if (!queryTab && location.search && path === '/my-dashboard') {
      const searchParams = new URLSearchParams(location.search);
      return !searchParams.get('tab') || searchParams.get('tab') === 'overview';
    }
    return true;
  };

  const isActive = isUrlActive(to, tab) || subItems.some(item => isUrlActive(item.to, item.tab));

  useEffect(() => {
    if (isActive && !isCollapsed && subItems.length > 0) {
      setIsOpen(true);
    }
  }, [isActive, isCollapsed, subItems.length]);

  const hasSubItems = subItems.length > 0;

  const itemContent = (
    <div className="flex items-center w-full justify-between">
      <div className="flex items-center min-w-0">
        {icon && <span className={`mr-3 flex-shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-slate-500'}`}>{icon}</span>}
        {!isCollapsed && <span className="font-semibold text-sm truncate transition-opacity duration-200">{label}</span>}
      </div>
      {hasSubItems && !isCollapsed && (
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </motion.div>
      )}
    </div>
  );

  const baseClasses = `flex items-center px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none group relative`;
  const activeClasses = `bg-rose-50/60 text-primary font-bold`;
  const inactiveClasses = `text-slate-600 hover:bg-slate-50 hover:text-slate-900`;

  const renderedLink = to ? (
    <Link
      to={to + (tab ? `?tab=${tab}` : '')}
      onClick={(e) => {
        if (isCollapsed && onExpandSidebar) {
          onExpandSidebar();
        }
        if (onClick) onClick(e);
      }}
      className={`${baseClasses} ${isActive && !hasSubItems ? activeClasses : inactiveClasses}`}
    >
      {isActive && !hasSubItems && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 w-1 h-6 rounded-r bg-primary"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
      {itemContent}
    </Link>
  ) : (
    <button
      onClick={() => {
        if (isCollapsed && onExpandSidebar) {
          onExpandSidebar();
        }
        if (hasSubItems) {
          setIsOpen(!isOpen);
        } else if (onClick) {
          onClick();
        }
      }}
      className={`${baseClasses} ${isActive ? 'text-slate-900 font-bold bg-slate-50/40' : inactiveClasses} w-full text-left`}
    >
      {itemContent}
    </button>
  );

  return (
    <div className="w-full">
      {renderedLink}

      {/* Sub Items */}
      {hasSubItems && !isCollapsed && (
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden pl-7 mt-1 space-y-1 border-l border-slate-100 ml-5"
            >
              {subItems.map((sub, idx) => {
                const subActive = isUrlActive(sub.to, sub.tab);
                return (
                  <Link
                    key={idx}
                    to={sub.to + (sub.tab ? `?tab=${sub.tab}` : '')}
                    onClick={onClick}
                    className={`flex items-center py-2 px-3 text-xs rounded-lg font-medium transition-colors relative ${
                      subActive ? 'text-primary font-bold' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {subActive && (
                      <div className="absolute left-0 w-1 h-3 rounded-r bg-primary" />
                    )}
                    {sub.icon && <span className="mr-2">{sub.icon}</span>}
                    <span className="truncate">{sub.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default SidebarItem;
