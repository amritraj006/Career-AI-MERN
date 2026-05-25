import React from 'react';

const Logo = ({ className = "w-10 h-10" }) => {
  return (
    <img 
      src="/logo.png" 
      alt="PathCraft Logo" 
      className={`${className} object-contain rounded-xl shadow-sm`} 
    />
  );
};

export default Logo;
