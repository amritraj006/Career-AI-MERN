// components/Result.jsx

const Result = ({ result, onRestart }) => {
  const getCareerSuggestion = () => {
    const maxType = Object.keys(result).reduce((a, b) => 
      result[a] > result[b] ? a : b
    );
    
    const suggestions = {
      ai: [
        { name: "Machine Learning Engineer", emoji: "🤖", desc: "Develop AI models and algorithms" },
        { name: "AI Research Scientist", emoji: "🔍", desc: "Advance the field of artificial intelligence" }
      ],
      data: [
        { name: "Data Scientist", emoji: "📊", desc: "Extract insights from complex data" }
      ],
      design: [
        { name: "UI/UX Designer", emoji: "🎨", desc: "Create intuitive user experiences" }
      ],
      security: [
        { name: "Cybersecurity Analyst", emoji: "🔐", desc: "Protect systems from digital attacks" }
      ]
    };
    
    return suggestions[maxType];
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl border border-gray-200 shadow-sm fade-in">
      <h2 className="text-2xl font-bold text-center mb-8 text-primary">
        Your Career Matches
      </h2>
      
      <div className="space-y-4">
        {getCareerSuggestion().map((career, index) => (
          <div
            key={index}
            className="p-5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-default slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{career.emoji}</span>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">{career.name}</h3>
                <p className="text-gray-600 text-sm">{career.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button
        onClick={onRestart}
        className="mt-8 w-full py-3.5 bg-primary hover:bg-primary-dull text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Take Test Again
      </button>
    </div>
  );
};

export default Result;