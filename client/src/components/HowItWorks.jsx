import { User, BrainCircuit, Route, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const steps = [
    {
      icon: <User className="w-6 h-6 text-primary" />,
      title: '1. Take Assessment',
      description: 'Complete our AI-powered career quiz',
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: '2. Get Insights',
      description: 'Receive personalized career matches based on your strengths',
    },
    {
      icon: <Route className="w-6 h-6 text-primary" />,
      title: '3. Explore Paths',
      description: 'Discover education and skill requirements for each career',
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: '4. Ace Interviews',
      description: 'Practice with AI-generated technical, behavioral, and HR questions',
      link: '/interview-prep',
      linkLabel: 'Try Interview Prep →',
    },
  ];

  const cardClass =
    'h-full bg-white border border-gray-200 shadow-sm rounded-xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2 hover:scale-[1.02] w-full block';

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-x-hidden text-gray-900">
      <div className="container mx-auto px-6 w-full">
        <div className="text-center mb-16 max-w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-primary">CareerPath AI</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our 4-step process helps you discover careers and prepare for success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {steps.map((step, index) => (
            <div key={index} className="relative w-full">
              {step.link ? (
                <Link
                  to={step.link}
                  onClick={() => window.scrollTo(0, 0)}
                  className={`${cardClass} group`}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  <span className="inline-block mt-4 text-sm font-medium text-primary group-hover:underline">
                    {step.linkLabel}
                  </span>
                </Link>
              ) : (
                <div className={cardClass}>
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
