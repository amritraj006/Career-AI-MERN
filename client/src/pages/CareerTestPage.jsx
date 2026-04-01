import { useState, useEffect, useRef } from 'react';
import preDefinedQuestions from '../assets/carrier-test/preDefinedQuestions';
import { useUser } from '@clerk/clerk-react';
import { domains, levelDescriptions, domainInsights } from '../utils/constants';
import { apiService } from '../services/apiService';

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

  const getLevelFromPercentage = (percentage) => {
    if (percentage >= 85) return 'expert';
    if (percentage >= 70) return 'advanced';
    if (percentage >= 50) return 'intermediate';
    return 'beginner';
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

  // ------------------ Fetch Saved Assessment ------------------ //
  useEffect(() => {
    const fetchSavedAssessment = async () => {
      if (user?.primaryEmailAddress?.emailAddress && step === 'select') {
        try {
          setLoading(true);
          const res = await apiService.getAssessment(user.primaryEmailAddress.emailAddress);
          if (res.success && res.assessment) {
            setResult(res.assessment);
            setDomain(res.assessment.domain);
            setStep('result');
          }
        } catch (error) {
          console.log("No saved assessment found or error fetching.");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchSavedAssessment();
  }, [user]);

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
      const finalResult = { ...data, percentage, totalScore, maxPossibleScore };
      setResult(finalResult);
      setStep('result');

      // Save to backend
      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          await apiService.saveAssessment({
            email: user.primaryEmailAddress.emailAddress,
            domain,
            ...finalResult
          });
        } catch (saveError) {
          console.error("Failed to save assessment to backend", saveError);
        }
      }
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
            <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-500 mt-4 text-lg">
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
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900">Choose Your Career Domain</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {domains.map((d) => (
                <button
                  key={d.id}
                  onClick={() => fetchQuestions(d.id)}
                  className="p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-300 flex flex-col items-center group hover:shadow-md border border-gray-100 hover:border-primary/50"
                  >
                  <div className="text-4xl mb-3">{d.icon}</div>
                  <span className="text-lg font-medium text-center text-gray-800">{d.name}</span>
                  <span className="text-sm text-gray-500 mt-1">10-question skill assessment</span>
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
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Question {current + 1} of {questions.length}</span>
                <span className="flex items-center gap-2">
                  <span className={`font-medium ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'}`}>
                    Time left: {timeLeft}s
                  </span>
                  {domains.find(d => d.id === domain)?.icon} {getDomainName(domain)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${((current + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-8 text-gray-900">{questions[current].question}</h3>

            <div className="space-y-3">
              {questions[current].options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all border border-gray-200 hover:border-primary/50 text-gray-800 hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-medium">
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
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-2 text-gray-900">Assessment Complete!</h3>
              <p className="text-gray-500 text-lg">Your {getDomainName(domain)} results</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-lg mb-3 text-gray-800">🎯 Skill Level</h4>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-primary capitalize">{result.level}</span>
                  <span className="text-gray-500">({result.percentage}%)</span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  Score: {result.totalScore}/{result.maxPossibleScore}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="font-semibold text-lg mb-3 text-gray-800">💪 Strengths</h4>
                <ul className="space-y-1">
                  {result.strengths?.map((s, idx) => (
                    <li key={idx} className="text-green-600 text-sm font-medium">• {s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
              <h4 className="font-semibold text-lg mb-3 text-gray-800">🚀 Recommendation</h4>
              <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-6">
              <h4 className="font-semibold text-lg mb-3 text-gray-800">📈 Areas for Improvement</h4>
              <ul className="space-y-1">
                {result.areas_for_improvement?.map((a, idx) => (
                  <li key={idx} className="text-amber-600 text-sm font-medium">• {a}</li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h4 className="font-semibold text-lg mb-3 text-gray-800">🎯 Next Steps</h4>
              <ol className="space-y-2">
                {result.next_steps?.map((ns, idx) => (
                  <li key={idx} className="text-blue-600 text-sm font-medium">{idx + 1}. {ns}</li>
                ))}
              </ol>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={restartTest}
                className="px-8 py-3 bg-primary hover:bg-primary-dull text-white shadow-md hover:shadow-lg rounded-lg font-medium transition-all"
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 text-gray-900 flex flex-col items-center px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 text-gray-900">
            AI Career Assessment
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            {user?.firstName
              ? `${user.firstName}, discover your career readiness with a guided assessment`
              : "Discover your career readiness with a guided assessment"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => setError(null)}
              className="mt-2 text-red-500 hover:text-red-700 text-sm font-medium"
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
