import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CareerPathwayCard } from './CareerPathwayCard';
import { carouselPathways } from '../assets/pathwaysData';

const CareerPathways = () => {
  const navigate = useNavigate();
  const carouselRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = (index) => {
    const container = carouselRef.current;
    if (container && container.children[index]) {
      const item = container.children[index];
      item.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setCurrentIndex(index);
    }
  };

  const handleNavigate = (pathwayId) => {
    navigate(`/pathways/${pathwayId}`);
    window.scrollTo(0,0);
  };

  return (
    <section className="relative py-16 md:py-24 bg-gray-50 overflow-hidden text-gray-900">
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Popular <span className="text-primary">Career Pathways</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore in-demand careers with strong growth potential
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Navigation */}
          <div className="flex justify-between items-center mb-6">
            <button 
              onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
              className="p-3 rounded-full bg-white hover:bg-primary border border-gray-200 text-gray-500 hover:text-white hover:border-primary shadow-sm transition-all"
              aria-label="Previous career"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scrollToIndex(Math.min(carouselPathways.length - 1, currentIndex + 1))}
              className="p-3 rounded-full bg-white hover:bg-primary border border-gray-200 text-gray-500 hover:text-white hover:border-primary shadow-sm transition-all"
              aria-label="Next career"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Career Cards */}
          <div 
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 scrollbar-hide"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {carouselPathways.map((career) => (
              <CareerPathwayCard
                key={career.id}
                id={career.id}
                title={career.title}
                growth={career.growth}
                salary={career.salary}
                skills={career.skills}
                onNavigate={handleNavigate}
                className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[30%] snap-center"
              />
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <button 
              onClick={()=> {navigate('/pathways');scrollTo(0,0)}}
              className="px-8 py-3.5 bg-primary hover:bg-primary-dull rounded-full font-medium text-white shadow-md transition-all duration-300"
            >
              View All Pathways
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPathways;