import React from 'react';
import { Sparkles, Route, BrainCircuit, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';

const RoadmapGeneratorBanner = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);

  const handleGeneratorClick = () => {
    if (isSignedIn) {
      navigate('/roadmap-generator');
      window.scrollTo(0, 0);
    } else {
      setShowLoginPrompt(true);
    }
  };

  const handleLoginClick = () => {
    setShowLoginPrompt(false);
    openSignIn();
  };

  return (
    <section className="relative bg-indigo-50/50 overflow-hidden py-24 md:py-32 lg:py-40 font-sans border-y border-indigo-100">
      <div className="container mx-auto px-6 flex flex-col items-center text-center relative z-10 fade-in">
        {/* Tagline */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full border border-indigo-100 shadow-sm slide-up">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <span className="text-sm font-bold text-gray-700">AI-Powered Roadmap Generator</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold max-w-3xl leading-tight mb-6 text-gray-900 tracking-tight slide-up" style={{ animationDelay: '100ms' }}>
          Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Personalized</span> Learning Journey
        </h1>

        {/* Subheading */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-10 font-medium slide-up" style={{ animationDelay: '200ms' }}>
          Our intelligent system crafts tailored learning paths based on your goals, 
          skills, and preferences to maximize your success.
        </p>

        {/* Professional Generator Button */}
        <div className="mt-2 slide-up" style={{ animationDelay: '300ms' }}>
          <button 
            onClick={handleGeneratorClick}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary-dull transition-all duration-300 rounded-xl font-bold shadow-md hover:shadow-lg text-white group transform hover:-translate-y-1"
          >
            <Sparkles className="w-5 h-5 transition-transform group-hover:rotate-12" />
            <span>Generate Your Roadmap</span>
          </button>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl slide-up" style={{ animationDelay: '400ms' }}>
          {[
            {
              icon: <BrainCircuit className="w-8 h-8 text-indigo-500" />,
              title: "Intelligent Recommendations",
              description: "AI-curated paths based on your unique profile"
            },
            {
              icon: <Route className="w-8 h-8 text-purple-500" />,
              title: "Structured Learning",
              description: "Step-by-step progression from beginner to advanced"
            },
            {
              icon: <Rocket className="w-8 h-8 text-pink-500" />,
              title: "Adaptive Updates",
              description: "Roadmap evolves as you progress and learn"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-sm"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-5 p-4 bg-indigo-50 rounded-2xl shadow-inner border border-indigo-100">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Login Prompt */}
        {showLoginPrompt && (
          <div className="mt-8 bg-white border border-gray-200 shadow-xl rounded-xl p-6 max-w-md mx-auto slide-up z-20">
            <p className="mb-5 text-gray-900 font-bold text-lg">Please login to access the roadmap generator</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="px-6 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleLoginClick}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dull text-white font-bold rounded-xl transition-colors shadow-sm"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RoadmapGeneratorBanner;