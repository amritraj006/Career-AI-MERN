import { TrendingUp, Shield, Zap, HeartPulse, Smartphone, Target, ArrowUpRight, BarChart3, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IndustryTrends = () => {
  const navigate = useNavigate();
  
  const trends = [
    { 
      name: "Artificial Intelligence", 
      growth: 42, 
      hot: true,
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      color: "from-amber-400 to-orange-500",
      description: "AI specialists are in highest demand across all tech sectors, driving unprecedented cross-industry innovation."
    },
    { 
      name: "Cybersecurity", 
      growth: 35, 
      hot: true,
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      color: "from-blue-400 to-indigo-500",
      description: "Growing threat landscapes are creating massive shortages for skilled security professionals worldwide."
    },
    { 
      name: "Healthcare Tech", 
      growth: 31, 
      hot: true,
      icon: <HeartPulse className="w-5 h-5 text-rose-500" />,
      color: "from-rose-400 to-red-500",
      description: "Digital transformation in healthcare is accelerating demand for health informatics and med-tech developers."
    },
    { 
      name: "Renewable Energy", 
      growth: 28, 
      hot: false,
      icon: <Globe className="w-5 h-5 text-emerald-500" />,
      color: "from-emerald-400 to-green-500",
      description: "Global shifts toward sustainability are creating entire new categories of green engineering roles."
    },
    { 
      name: "Digital Marketing", 
      growth: 24, 
      hot: false,
      icon: <Smartphone className="w-5 h-5 text-purple-500" />,
      color: "from-purple-400 to-pink-500",
      description: "E-commerce and social media ecosystems continue to drive steady growth for digital strategists."
    }
  ];

  const insights = [
    {
      title: "Salary Premium",
      stat: "+25%",
      desc: "AI & ML roles command significantly higher starting salaries than average tech positions.",
      icon: <TrendingUp className="w-6 h-6 text-emerald-500" />
    },
    {
      title: "Workforce Gap",
      stat: "3.5M",
      desc: "Current global shortage of qualified cybersecurity professionals needed immediately.",
      icon: <AlertCircle className="w-6 h-6 text-amber-500" />
    },
    {
      title: "Post-Pandemic Growth",
      stat: "72%",
      desc: "Increase in digital healthcare technology jobs since 2020.",
      icon: <BarChart3 className="w-6 h-6 text-blue-500" />
    }
  ];

  return (
    <section className="py-24 bg-gray-50 text-gray-900 border-t border-gray-200 overflow-hidden font-sans">
      <div className="container mx-auto px-6 max-w-6xl">
        
        {/* Section Header */}
        <div className="text-center mb-20 fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-gray-700 uppercase tracking-widest">Market Analysis</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-gray-900">
            Emerging <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-rose-400">Industry Trends</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Stay ahead of the curve. Discover the fastest growing sectors, in-demand roles, and key market insights shaping the future of work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Trends Visualization - Left Side (8 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-gray-400" />
              Fastest Growing Sectors
            </h3>
            
            <div className="flex flex-col gap-4">
              {trends.map((trend, index) => (
                <div
                  key={index}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Subtle background gradient on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${trend.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                        {trend.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          {trend.name}
                          {trend.hot && (
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-100 text-amber-700 tracking-wider">Hot</span>
                          )}
                        </h4>
                        <p className="text-sm text-gray-500 font-medium mt-0.5">+{Math.floor(trend.growth * 1.5)}k projected jobs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-extrabold text-gray-900 group-hover:text-primary transition-colors duration-300">
                        {trend.growth}%
                      </span>
                      <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden relative">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${trend.color} transition-all duration-1000 ease-out`}
                      style={{ width: `${trend.growth * 2}%` }}
                    ></div>
                  </div>
                  
                  <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-2xl">
                    {trend.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Section - Right Side (4 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-gray-400" />
              Key Market Insights
            </h3>
            
            <div className="flex flex-col gap-6">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 slide-up relative overflow-hidden group"
                  style={{ animationDelay: `${(index + 5) * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/5 transition-colors duration-500 pointer-events-none"></div>
                  
                  <div className="flex items-start gap-5 relative z-10">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                      {insight.icon}
                    </div>
                    <div>
                      <div className="flex items-end gap-3 mb-2">
                        <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{insight.stat}</span>
                        <span className="text-sm font-bold text-gray-500 uppercase tracking-widest pb-1">{insight.title}</span>
                      </div>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed">
                        {insight.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Premium CTA Box inside the insights column */}
              <div className="mt-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl slide-up relative overflow-hidden" style={{ animationDelay: '800ms' }}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                <h4 className="text-xl font-bold mb-3 relative z-10">Ready to pivot your career?</h4>
                <p className="text-gray-300 text-sm mb-6 relative z-10 font-medium leading-relaxed">
                  Join thousands of professionals transitioning into these high-growth sectors.
                </p>
                <button 
                  onClick={() => { navigate('/pathways'); window.scrollTo(0,0); }}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 font-bold py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md transform hover:-translate-y-0.5 relative z-10 flex items-center justify-center gap-2"
                >
                  Explore Pathways
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

// Simple Globe icon component since we hit a missing import for it
const Globe = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

export default IndustryTrends;