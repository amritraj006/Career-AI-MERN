import React from 'react';
import { ArrowRight, BrainCircuit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';

const MainBanner = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);

  const handleCareerTestClick = () => {
    if (!isSignedIn) {
      setShowLoginPrompt(true);
      return;
    }
    navigate('/career-test');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    openSignIn();
  };

  return (
    <section className="relative bg-white overflow-hidden text-gray-900 border-b border-gray-100">
      {/* Very subtle background pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white z-0" />

      <div className="container mx-auto px-6 py-24 md:py-32 lg:py-40 flex flex-col items-center text-center relative z-10 fade-in-up">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
          <BrainCircuit className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Career Guidance</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-4xl leading-tight mb-6 text-gray-900 tracking-tight">
          Discover Your Perfect <span className="text-primary bg-primary/5 px-2 rounded-lg">Career Path</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Our intelligent system analyzes your strengths, interests and goals to recommend 
          personalized career trajectories just for you.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={handleCareerTestClick}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dull transition-colors duration-200 rounded-full font-medium text-white shadow-md hover:shadow-lg"
          >
            Take Career Test <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => { navigate('/pathways'); scrollTo(0,0) }}
            className="px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-800 transition-colors duration-200 rounded-full font-medium border border-gray-200 shadow-sm hover:shadow"
          >
            Explore Pathways
          </button>
        </div>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="mt-6 bg-white border border-gray-200 shadow-xl rounded-xl p-5 max-w-sm mx-auto animate-fade-in-up">
            <p className="mb-4 text-gray-800 font-medium">Please login to take the career test</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleLoginClick}
                className="px-6 py-2 bg-primary hover:bg-primary-dull text-white rounded-lg font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-6 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-12 mt-20 pt-10 border-t border-gray-100 w-full max-w-3xl">
          {[
            { value: "10,000+", label: "Career Paths" },
            { value: "97%", label: "Accuracy Rate" },
            { value: "50+", label: "Industries" }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="text-3xl md:text-4xl font-extrabold text-gray-900 group-hover:text-primary transition-colors">{stat.value}</div>
              <div className="text-gray-500 font-medium text-sm mt-2 uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MainBanner;