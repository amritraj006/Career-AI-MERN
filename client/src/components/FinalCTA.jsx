import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FinalCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="relative py-24 md:py-32 bg-gray-50 overflow-hidden border-t border-gray-100">
      {/* Subtle Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-[0.05]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#000_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto bg-white rounded-3xl p-10 md:p-16 shadow-xl border border-gray-100">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 tracking-tight">
            Ready to Discover Your <span className="text-primary italic">Ideal Career Path?</span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
            Join thousands who found their perfect career match with our AI-powered system.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => {navigate('/career-test'); window.scrollTo(0, 0);}}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white hover:bg-primary-dull rounded-full font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              Start Free Assessment <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;