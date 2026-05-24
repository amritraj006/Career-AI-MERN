import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { toast } from 'sonner';
import { isCareerSaved, toggleSavedCareer } from '../utils/savedCareers';

export const CareerPathwayCard = ({
  id,
  title,
  growth,
  salary,
  skills,
  onNavigate,
  className = 'w-full',
}) => {
  const [saved, setSaved] = useState(() => isCareerSaved(id));

  useEffect(() => {
    const sync = () => setSaved(isCareerSaved(id));
    window.addEventListener('savedCareersUpdated', sync);
    return () => window.removeEventListener('savedCareersUpdated', sync);
  }, [id]);

  const handleBookmark = (e) => {
    e.stopPropagation();
    const nowSaved = toggleSavedCareer(id);
    setSaved(nowSaved);
    toast.success(nowSaved ? 'Career saved to bookmarks' : 'Removed from saved careers');
  };

  return (
    <div className={`h-full ${className}`}>
      <div className="relative flex flex-col bg-white border border-gray-200 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 rounded-2xl p-6 group h-full">
        <button
          type="button"
          onClick={handleBookmark}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
          aria-label={saved ? 'Remove bookmark' : 'Save career'}
        >
          <Bookmark
            className={`w-5 h-5 transition-colors ${
              saved ? 'fill-primary text-primary' : 'text-gray-400 hover:text-primary'
            }`}
          />
        </button>

        <h3 className="text-xl font-bold mb-4 pr-10 group-hover:text-primary transition-colors text-gray-900">
          {title}
        </h3>

        <div className="flex flex-col gap-3 mb-5">
          <div className="flex items-center gap-2 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            <span className="text-sm text-gray-800 font-medium">{growth}% job growth</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 w-fit px-3 py-1.5 rounded-lg border border-gray-100 shadow-sm">
            <span className="text-primary font-bold">{salary}</span>
            <span className="text-gray-500 text-xs uppercase tracking-wider">avg. salary</span>
          </div>
        </div>

        <div className="mt-2 flex-grow">
          <h4 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            Top Skills Needed
          </h4>
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
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onNavigate(id)}
          className="mt-6 w-full py-2.5 text-sm font-medium rounded-xl flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all duration-300"
        >
          Explore Path
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};
