import { useState, useEffect, useRef } from 'react';
import preDefinedQuestions from '../assets/carrier-test/preDefinedQuestions';
import { useUser } from '@clerk/clerk-react';

export default function CareerTestPage() {
  const [step, setStep] = useState('select');
  const [domain, setDomain] = useState('');
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(50);
  const timerRef = useRef(null);
  const { user } = useUser();

  const domains = [
    { id: 'webdev', name: 'Web Development', icon: '🌐' },
    { id: 'datascience', name: 'Data Science', icon: '📊' },
    { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒' },
    { id: 'cloud', name: 'Cloud Computing', icon: '☁️' },
    { id: 'blockchain', name: 'Blockchain', icon: '⛓️' },
    { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
    { id: 'mobile', name: 'Mobile Development', icon: '📱' },
    { id: 'devops', name: 'DevOps', icon: '🔧' }
  ];

  const getLevelFromPercentage = (percentage) => {
    if (percentage >= 85) return 'expert';
    if (percentage >= 70) return 'advanced';
    if (percentage >= 50) return 'intermediate';
    return 'beginner';
  };

  const levelDescriptions = {
    beginner: 'You have early interest and a starting foundation. Focus on core concepts, consistency, and hands-on practice.',
    intermediate: 'You have usable fundamentals and are ready to deepen your skills through structured projects and real-world problem solving.',
    advanced: 'You show strong applied capability and should now emphasize system design, optimization, and portfolio-quality execution.',
    expert: 'You demonstrate high readiness for complex work. Continue refining leadership, architecture, and domain specialization.'
  };

  const domainInsights = {
    webdev: {
      strengths: ['UI implementation', 'responsive thinking', 'frontend problem solving'],
      improvement: ['performance optimization', 'security best practices', 'system design depth'],
      nextSteps: ['Build and deploy a full-stack project', 'Practice React performance and API integration', 'Learn testing and web security fundamentals']
    },
    datascience: {
      strengths: ['data analysis mindset', 'pattern recognition', 'statistical thinking'],
      improvement: ['model evaluation', 'feature engineering', 'production-ready workflows'],
      nextSteps: ['Complete an end-to-end data project', 'Strengthen SQL, pandas, and visualization skills', 'Practice model validation and storytelling with data']
    },
    cybersecurity: {
      strengths: ['security awareness', 'risk thinking', 'defensive mindset'],
      improvement: ['network security depth', 'incident response practice', 'tool familiarity'],
      nextSteps: ['Set up a home lab for security practice', 'Study common vulnerabilities and mitigations', 'Work through CTFs or security labs consistently']
    },
    cloud: {
      strengths: ['infrastructure thinking', 'service selection', 'deployment awareness'],
      improvement: ['cost optimization', 'resilience design', 'automation depth'],
      nextSteps: ['Deploy a project on AWS, Azure, or GCP', 'Learn IAM, networking, and monitoring basics', 'Automate infrastructure with Terraform or similar tools']
    },
    blockchain: {
      strengths: ['distributed systems curiosity', 'protocol awareness', 'problem-solving'],
      improvement: ['smart contract security', 'ecosystem tooling', 'practical architecture'],
      nextSteps: ['Build a simple dApp or smart contract project', 'Study wallet, gas, and token standards carefully', 'Practice auditing basic contract logic']
    },
    ai: {
      strengths: ['model intuition', 'applied experimentation', 'learning agility'],
      improvement: ['evaluation rigor', 'data quality discipline', 'deployment understanding'],
      nextSteps: ['Ship a small AI-powered application', 'Practice prompt design and model evaluation', 'Learn vector search, APIs, and responsible AI basics']
    },
    mobile: {
      strengths: ['app flow thinking', 'user experience awareness', 'platform fundamentals'],
      improvement: ['performance tuning', 'state management', 'release readiness'],
      nextSteps: ['Build and publish a mobile portfolio app', 'Practice API integration and offline handling', 'Learn testing, accessibility, and app performance tuning']
    },
    devops: {
      strengths: ['automation mindset', 'delivery awareness', 'systems thinking'],
      improvement: ['observability depth', 'container orchestration', 'security automation'],
      nextSteps: ['Create a CI/CD pipeline for a sample app', 'Practice Docker, Kubernetes, and monitoring tools', 'Learn infrastructure as code and deployment rollback strategies']
    }
  };

  const buildLocalResult = (domainId, percentage) => {
    const level = getLevelFromPercentage(percentage);
    const insights = domainInsights[domainId] || {
      strengths: ['problem solving', 'technical curiosity', 'learning consistency'],
      improvement: ['practical experience', 'tool familiarity', 'project depth'],
      nextSteps: ['Build a project in this domain', 'Follow a structured learning path', 'Practice regularly with real-world scenarios']
    };

    return {
      level,
      recommendation: `${levelDescriptions[level]} In ${getDomainName(domainId)}, your next gains will come from focused practice and progressively harder projects.`,
      strengths: insights.strengths,
      areas_for_improvement: insights.improvement,
      next_steps: insights.nextSteps
    };
  };

  // ------------------ State Persistence ------------------ //
  useEffect(() => {
    const savedState = sessionStorage.getItem('careerTestState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.step && parsed.domain) {
          setStep(parsed.step);
          setDomain(parsed.domain);
          setQuestions(parsed.questions || []);
          setCurrent(parsed.current || 0);
          setAnswers(parsed.answers || []);
          setResult(parsed.result || null);
        }
      } catch (e) {
        console.error("Failed to parse saved state:", e);
        sessionStorage.removeItem('careerTestState');
      }
    }
  }, []);

  useEffect(() => {
    const stateToSave = { step, domain, questions, current, answers, result };
    sessionStorage.setItem('careerTestState', JSON.stringify(stateToSave));
  }, [step, domain, questions, current, answers, result]);

  // ------------------ Timer ------------------ //
  useEffect(() => {
    if (step === 'test' && questions.length > 0) {
      setTimeLeft(60);

      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleAnswer(1);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [current, questions, step]);

  // ------------------ Question Generation ------------------ //
  const getDomainName = (domainId) =>
    domains.find(d => d.id === domainId)?.name || domainId;

  const generateQuestions = async (domainId) => {
    if (!preDefinedQuestions[domainId]) {
      throw new Error(`No assessment questions available for ${getDomainName(domainId)} yet.`);
    }

    const shuffled = [...preDefinedQuestions[domainId]].sort(() => 0.5 - Math.random());
    return { questions: shuffled.slice(0, 10) };
  };


  const fetchQuestions = async (domainId) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise(r => setTimeout(r, 500));
      const data = await generateQuestions(domainId);

      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid question data received");
      }

      setQuestions(data.questions);
      setDomain(domainId);
      setStep('test');
      setCurrent(0);
      setAnswers([]);
      setTimeLeft(50);
    } catch (err) {
      console.error("Question generation error:", err);
      setError(err.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Answer Handling ------------------ //
  const handleAnswer = (score) => {
    clearInterval(timerRef.current);
    const updatedAnswers = [...answers, score];
    setAnswers(updatedAnswers);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      evaluateResult(updatedAnswers);
    }
  };

  const evaluateResult = async (scores) => {
    setLoading(true);
    setError(null);

    const totalScore = scores.reduce((a, b) => a + b, 0);
    const maxPossibleScore = questions.length * 4;
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

    try {
      const data = buildLocalResult(domain, percentage);
      setResult({ ...data, percentage, totalScore, maxPossibleScore });
      setStep('result');
    } catch (err) {
      console.error("Evaluation error:", err);
      setError(err.message || "Failed to evaluate results.");
    } finally {
      setLoading(false);
    }
  };

  const restartTest = () => {
    setStep('select');
    setQuestions([]);
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setDomain('');
    setError(null);
    setTimeLeft(50);
    clearInterval(timerRef.current);
    sessionStorage.removeItem('careerTestState');
  };

  useEffect(() => {
    return () => sessionStorage.removeItem('careerTestState');
  }, []);

  // ------------------ UI Rendering ------------------ //
  const renderStep = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-400/30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 mt-4 text-lg">
            {step === 'select' ? 'Preparing your assessment...' :
             step === 'test' ? 'Processing your answer...' :
             'Analyzing your results...'}
          </p>
        </div>
      );
    }

    switch (step) {
      case 'select':
        return (
          <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50">
            <h3 className="text-2xl font-semibold mb-8 text-center">Choose Your Career Domain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => fetchQuestions(d.id)}
                  className="p-6 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl transition-all duration-300 flex flex-col items-center group hover:scale-105 border border-gray-600/50 hover:border-blue-400/50"
                >
                  <div className="text-4xl mb-3">{d.icon}</div>
                  <span className="text-lg font-medium text-center">{d.name}</span>
                  <span className="text-sm text-gray-400 mt-1">10-question skill assessment</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'test':
        if (questions.length === 0) {
          setError("Questions not loaded properly.");
          setStep('select');
          return null;
        }
        return (
          <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Question {current + 1} of {questions.length}</span>
                <span className="flex items-center gap-2">
                  <span className={`font-medium ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`}>
                    Time left: {timeLeft}s
                  </span>
                  {domains.find(d => d.id === domain)?.icon} {getDomainName(domain)}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-8">{questions[current].question}</h3>

            <div className="space-y-3">
              {questions[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full p-4 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl text-left transition-all border border-gray-600/50 hover:border-blue-400/50 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt.text}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'result':
        if (!result) {
          setError("Results not loaded properly.");
          setStep('select');
          return null;
        }
        return (
          <div className="bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2">Assessment Complete!</h3>
              <p className="text-gray-400 text-lg">Your {getDomainName(domain)} results</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                <h4 className="font-semibold text-lg mb-3">🎯 Skill Level</h4>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-blue-400 capitalize">{result.level}</span>
                  <span className="text-gray-400">({result.percentage}%)</span>
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  Score: {result.totalScore}/{result.maxPossibleScore}
                </div>
              </div>

              <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
                <h4 className="font-semibold text-lg mb-3">💪 Strengths</h4>
                <ul className="space-y-1">
                  {result.strengths?.map((s, idx) => (
                    <li key={idx} className="text-green-400 text-sm">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 mb-6">
              <h4 className="font-semibold text-lg mb-3">🚀 Recommendation</h4>
              <p className="text-gray-300">{result.recommendation}</p>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50 mb-6">
              <h4 className="font-semibold text-lg mb-3">📈 Areas for Improvement</h4>
              <ul className="space-y-1">
                {result.areas_for_improvement?.map((a, idx) => (
                  <li key={idx} className="text-yellow-400 text-sm">• {a}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-700/30 p-6 rounded-xl border border-gray-600/50">
              <h4 className="font-semibold text-lg mb-3">🎯 Next Steps</h4>
              <ol className="space-y-1">
                {result.next_steps?.map((ns, idx) => (
                  <li key={idx} className="text-blue-400 text-sm">{idx + 1}. {ns}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={restartTest}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 rounded-lg font-medium"
              >
                Take Another Test
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-16 md:pt-50 from-gray-900 via-blue-900 to-gray-900 text-white flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI Career Assessment
          </h1>
          <p className="text-gray-300 text-lg">
            {user?.firstName
              ? `${user.firstName}, discover your career readiness with a guided assessment`
              : "Discover your career readiness with a guided assessment"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-300 hover:text-white underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
}
