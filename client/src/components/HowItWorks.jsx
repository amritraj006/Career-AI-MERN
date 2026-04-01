import { User, BrainCircuit, Route } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <User className="w-6 h-6 text-primary" />,
      title: "1. Take Assessment",
      description: "Complete our AI-powered career quiz",
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-primary" />,
      title: "2. Get Insights",
      description: "Receive personalized career matches based on your strengths",
    },
    {
      icon: <Route className="w-6 h-6 text-primary" />,
      title: "3. Explore Paths",
      description: "Discover education and skill requirements for each career",
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 overflow-x-hidden text-gray-900">
      <div className="container mx-auto px-6 w-full">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-full">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="text-primary">CareerPath AI</span> Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our 3-step process helps you discover careers perfectly aligned with your unique profile
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative w-full"
            >
              <div className="h-full bg-white border border-gray-200 shadow-sm rounded-xl p-8 transition-all duration-300 hover:shadow-md hover:-translate-y-2 w-full">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                
                {/* Connector (for desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 translate-x-1/2">
                    <div className="h-px w-16 bg-gradient-to-r from-primary to-primary/10 origin-left" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-sm" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;