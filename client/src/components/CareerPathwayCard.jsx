import { motion } from 'framer-motion';

export const CareerPathwayCard = ({ 
  id,
  title, 
  growth, 
  salary, 
  skills, 
  onNavigate 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-center"
    >
      <div className="h-full flex flex-col bg-gray-900/40 backdrop-blur-md hover:bg-gray-800/60 border border-gray-700/50 hover:border-primary/50 shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 rounded-2xl p-6 group">
        {/* Career Title */}
        <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors text-white">{title}</h3>
        
        <div className="flex flex-col gap-3 mb-5">
          {/* Growth Indicator */}
          <div className="flex items-center gap-2 bg-gray-800/50 w-fit px-3 py-1.5 rounded-lg border border-gray-700/50 shadow-inner">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            <span className="text-sm text-gray-200 font-medium">{growth}% job growth</span>
          </div>
          
          {/* Salary */}
          <div className="flex items-center gap-2 bg-gray-800/50 w-fit px-3 py-1.5 rounded-lg border border-gray-700/50 shadow-inner">
            <span className="text-primary font-bold">{salary}</span>
            <span className="text-gray-400 text-xs uppercase tracking-wider">avg. salary</span>
          </div>
        </div>
        
        {/* Skills */}
        <div className="mt-2 flex-grow">
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Top Skills Needed</h4>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, i) => (
              <span 
                key={i}
                className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-400 border border-gray-700 relative group-hover:bg-gray-700 transition-colors">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
        
        {/* CTA Button */}
        <button 
          onClick={() => onNavigate(id)}
          className="mt-6 w-full py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.3)] transition-all duration-300"
        >
          Explore Path 
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};