const IndustryTrends = () => {
  const trends = [
    { 
      name: "Artificial Intelligence", 
      growth: 42, 
      hot: true,
      description: "AI specialists are in highest demand across all sectors"
    },
    { 
      name: "Cybersecurity", 
      growth: 35, 
      hot: true,
      description: "Growing threats driving demand for security professionals"
    },
    { 
      name: "Renewable Energy", 
      growth: 28, 
      hot: false,
      description: "Global shift to green energy creating new career paths"
    },
    { 
      name: "Healthcare Technology", 
      growth: 31, 
      hot: true,
      description: "Digital transformation in healthcare accelerating"
    },
    { 
      name: "Digital Marketing", 
      growth: 24, 
      hot: false,
      description: "Social media and e-commerce driving continuous growth"
    }
  ];

  const insights = [
    "AI jobs pay 25% more than average tech roles",
    "Cybersecurity roles have 3.5M global workforce shortage",
    "Healthcare tech jobs grew 72% since pandemic"
  ];

  return (
    <section className="py-16 md:py-24 bg-white text-gray-900 border-t border-gray-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Emerging <span className="text-primary">Industry Trends</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Stay ahead with the fastest growing sectors and in-demand roles
          </p>
        </div>

        {/* Trends Visualization */}
        <div className="max-w-4xl mx-auto mb-16">
          {trends.map((trend, index) => (
            <div
              key={index}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-medium text-gray-800">
                    {trend.name} {trend.hot && "🔥"}
                  </h3>
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200">
                    {trend.growth}% growth
                  </span>
                </div>
                <span className="text-primary font-bold">
                  +{Math.floor(trend.growth/2)}k new jobs
                </span>
              </div>
              
              <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${Math.min(trend.growth, 100)}%` }}
                ></div>
              </div>
              
              <p className="text-gray-500 text-sm">
                {trend.description}
              </p>
            </div>
          ))}
        </div>

        {/* Insights Section */}
        <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-200 rounded-xl p-8 mb-12 shadow-sm">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900">
            <span className="text-primary">📊</span> Key Market Insights
          </h3>
          <ul className="space-y-4">
            {insights.map((insight, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-gray-700"
              >
                <span className="text-primary mt-1 font-bold">•</span>
                <span className="font-medium">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default IndustryTrends;