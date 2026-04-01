export const ResourceCard = ({
  resourceId,
  name,
  description,
  image,
  price,
  onNavigate
}) => {
  return (
    <div
      className="relative group h-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary/50 transition-all duration-300 flex flex-col"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Image with parallax effect */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow relative z-10 w-full">
        {/* Price Badge */}
        <div className="flex justify-between items-center mb-4 transition-transform duration-300 group-hover:translate-x-1">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wider">
            COURSE
          </span>
          <span className="text-lg font-bold text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-indigo-500 transition-all duration-300">
            {price}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 transition-all duration-300 group-hover:text-primary group-hover:translate-x-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-5 line-clamp-2 transition-opacity duration-300">
          {description}
        </p>

        {/* Automated push down to pin CTA to bottom */}
        <div className="flex-grow"></div>

        {/* CTA Button */}
        <button
          onClick={() => onNavigate(resourceId)}
          className="w-full mt-4 py-2.5 px-4 bg-primary hover:bg-primary-dull text-white rounded-xl font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center overflow-hidden group/btn"
        >
          <span className="relative z-10">View Details</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="ml-2 w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1"
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};