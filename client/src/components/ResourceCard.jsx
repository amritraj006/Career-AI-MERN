// ResourceCard.js
import { motion } from 'framer-motion';

export const ResourceCard = ({
  resourceId,
  name,
  description,
  image,
  price,
  onNavigate
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ 
        type: "spring",
        stiffness: 400,
        damping: 15,
        duration: 0.3
      }}
      className="relative group h-full bg-gray-900/40 backdrop-blur-md rounded-2xl overflow-hidden border border-gray-700/50 shadow-lg hover:border-primary/50 hover:shadow-primary/20 transition-all duration-300 flex flex-col"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Image with parallax effect */}
      <motion.div 
        className="relative h-48 overflow-hidden"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
      </motion.div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow relative z-10">
        {/* Price Badge with floating animation */}
        <motion.div 
          className="flex justify-between items-center mb-4"
          whileHover={{ x: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider">
            COURSE
          </span>
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
            {price}
          </span>
        </motion.div>

        {/* Title with text gradient on hover */}
        <motion.h3 
          className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-indigo-400 transition-all duration-300"
          whileHover={{ x: 2 }}
        >
          {name}
        </motion.h3>

        {/* Description with fade-in effect */}
        <motion.p 
          className="text-gray-400 text-sm mb-5 line-clamp-2"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {description}
        </motion.p>

        {/* Automated push down to pin CTA to bottom */}
        <div className="flex-grow"></div>

        {/* Animated CTA Button */}
        <motion.button
          onClick={() => onNavigate(resourceId)}
          className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-dull hover:to-indigo-700 text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-primary/30 flex items-center justify-center overflow-hidden"
          whileHover={{ 
            scale: 1.02
          }}
        >
          <span className="relative z-10">View Details</span>
          <motion.span 
            className="absolute inset-0 bg-gradient-to-r from-primary-dull to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
          />
          <motion.svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="ml-2 w-4 h-4 relative z-10"
            viewBox="0 0 20 20" 
            fill="currentColor"
            animate={{ x: [0, 4, 0] }}
            transition={{ 
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </motion.svg>
        </motion.button>
      </div>
    </motion.div>
  );
};