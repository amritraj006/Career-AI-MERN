import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  Sparkles,
  Zap,
  Trophy,
  Timer,
  ChevronLeft,
  ChevronRight,
  Copy,
  RotateCcw,
  Target,
  Flame,
  CheckCircle2,
  XCircle,
  Brain,
  Share2,
  Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { domains, levelDescriptions, domainInsights, levelBadgeStyles } from '../utils/constants';
import { apiService } from '../services/apiService';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
const QUESTION_COUNTS = [8, 10, 12];

const getLevelFromPercentage = (percentage) => {
  if (percentage >= 85) return 'expert';
  if (percentage >= 70) return 'advanced';
  if (percentage >= 50) return 'intermediate';
  return 'beginner';
};

const buildLocalResult = (domainId, percentage) => {
  const level = getLevelFromPercentage(percentage);
  const insights = domainInsights[domainId] || {
    strengths: ['Problem solving', 'Technical curiosity', 'Learning consistency'],
    improvement: ['Practical experience', 'Tool depth', 'Project portfolio'],
    nextSteps: ['Build a domain project', 'Follow a structured path', 'Practice weekly'],
  };
  return {
    level,
    recommendation: `${levelDescriptions[level]} Focus your next sprint on hands-on projects in ${domainId}.`,
    strengths: insights.strengths,
    areas_for_improvement: insights.improvement,
    next_steps: insights.nextSteps,
  };
};

const TimerRing = ({ seconds, max = 60 }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const sec = Math.max(0, Number(seconds) || 0);
  const offset = circ - (sec / max) * circ;
  const urgent = sec <= 10;

  return (
    <div className={`relative w-14 h-14 ${urgent ? 'animate-pulse' : ''}`}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="4" />
        <circle
          cx="24"
          cy="24"
          r={r}
          fill="none"
          stroke={urgent ? '#ef4444' : '#F84565'}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000"
        />
      </svg>
      <span
        className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${
          urgent ? 'text-red-500 scale-110 font-black' : 'text-white'
        } transition-all`}
      >
        {sec}
      </span>
    </div>
  );
};

const ScoreRing = ({ percentage, animated }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, Number(animated) || Number(percentage) || 0));
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          filter="url(#glow)"
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F84565" />
            <stop offset="100%" stopColor="#ff8fa3" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#F84565" floodOpacity="0.4" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-extrabold text-gray-900">{pct}%</span>
        <span className="text-xs text-gray-500 uppercase tracking-wide">Score</span>
      </div>
    </div>
  );
};

// Skill Mastery Horizontal Bar Chart Component
const SkillMasteryChart = ({ answerDetails }) => {
  const details = answerDetails || [];
  const total = Math.max(details.length, 1);

  const expert = details.filter((d) => d.score === 4).length;
  const proficient = details.filter((d) => d.score === 3).length;
  const developing = details.filter((d) => d.score === 2).length;
  const novice = details.filter((d) => d.score <= 1).length;

  const getPercent = (count) => Math.round((count / total) * 100);

  const categories = [
    { label: 'Perfect Mastery (Score 4/4)', count: expert, color: 'from-emerald-400 to-teal-500', text: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Proficient (Score 3/4)', count: proficient, color: 'from-blue-400 to-indigo-500', text: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Developing (Score 2/4)', count: developing, color: 'from-amber-400 to-orange-500', text: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Novice (Score 1/4)', count: novice, color: 'from-rose-400 to-red-500', text: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
      <h4 className="font-bold text-gray-900 text-xs tracking-wide uppercase">Response Strength Profile</h4>
      <div className="space-y-4">
        {categories.map((c) => {
          const pct = getPercent(c.count);
          return (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-600">{c.label}</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${c.text} ${c.bg}`}>
                  {c.count} Qs · {pct}%
                </span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${c.color} transition-all duration-1000 ease-out`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Key Performance Indicators Component
const KpiGrid = ({ answerDetails, result, bestStreak }) => {
  const scores = (answerDetails || []).map((d) => Number(d.score) || 0);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '0.0';
  const accuracy = result.percentage || 0;
  
  let accuracyRating = 'Growing';
  let accuracyColor = 'text-red-500 bg-red-50';
  if (accuracy >= 85) {
    accuracyRating = 'Elite (A+)';
    accuracyColor = 'text-emerald-500 bg-emerald-50';
  } else if (accuracy >= 70) {
    accuracyRating = 'Strong (A)';
    accuracyColor = 'text-indigo-500 bg-indigo-50';
  } else if (accuracy >= 50) {
    accuracyRating = 'Capable (B)';
    accuracyColor = 'text-amber-500 bg-amber-50';
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {[
        { label: 'Avg Answer Weight', val: `${avgScore} / 4.0`, desc: 'Average points per question', icon: Target, color: 'text-primary bg-rose-50' },
        { label: 'Accuracy Rating', val: accuracyRating, desc: 'Overall competency tier', icon: Trophy, color: accuracyColor },
        { label: 'Longest Streak', val: `${bestStreak || result.bestStreak || 0} correct`, desc: 'Consecutive strong responses', icon: Flame, color: 'text-amber-500 bg-amber-50' },
        { label: 'Focus & Pace', val: 'Consistent', desc: 'Time limit compliance', icon: Timer, color: 'text-emerald-500 bg-emerald-50' },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <div key={item.label} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{item.label}</span>
              <span className={`p-1.5 rounded-lg ${item.color}`}>
                <Icon className="w-4 h-4" />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-lg font-extrabold text-gray-900 leading-tight">{item.val}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Question-by-Question Timeline Area Chart Component
const PerformanceTimelineChart = ({ answerDetails }) => {
  const [hoveredIdx, setHoveredIdx] = useState(0);
  const details = answerDetails || [];
  const N = details.length;
  if (N === 0) return null;

  // SVG dimensions
  const width = 500;
  const height = 150;
  const paddingLeft = 40;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = details.map((d, i) => {
    const x = paddingLeft + (i * chartWidth) / (N - 1 || 1);
    const scoreVal = Math.min(4, Math.max(1, Number(d.score) || 1));
    const y = paddingTop + chartHeight - ((scoreVal - 1) / 3) * chartHeight;
    return { x, y, ...d, index: i };
  });

  let linePath = '';
  let areaPath = '';
  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    const bottomY = paddingTop + chartHeight;
    areaPath = `${linePath} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }

  const activePoint = points[hoveredIdx] || points[0];

  const getScoreBadge = (score) => {
    if (score === 4) return { text: 'Expert (4/4)', bg: 'bg-emerald-100 text-emerald-800' };
    if (score === 3) return { text: 'Proficient (3/4)', bg: 'bg-blue-100 text-blue-800' };
    if (score === 2) return { text: 'Developing (2/4)', bg: 'bg-amber-100 text-amber-800' };
    return { text: 'Novice (1/4)', bg: 'bg-rose-100 text-rose-800' };
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-gray-900 text-sm tracking-wide uppercase">Question-by-Question Timeline</h4>
          <p className="text-xs text-gray-400 mt-0.5">Hover or click dots to analyze response details.</p>
        </div>
        {activePoint && (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getScoreBadge(activePoint.score).bg} self-start sm:self-center transition-all duration-300`}>
            Q{activePoint.index + 1}: {getScoreBadge(activePoint.score).text}
          </span>
        )}
      </div>

      <div className="relative">
        <svg className="w-full h-auto" viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F84565" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#F84565" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F84565" />
              <stop offset="100%" stopColor="#ff8fa3" />
            </linearGradient>
          </defs>

          {/* Gridlines */}
          {[1, 2, 3, 4].map((s) => {
            const y = paddingTop + chartHeight - ((s - 1) / 3) * chartHeight;
            return (
              <g key={s}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="text-[9px] font-bold text-gray-400 fill-current"
                >
                  Score {s}
                </text>
              </g>
            );
          })}

          {/* Filled Area */}
          {points.length > 0 && (
            <path d={areaPath} fill="url(#areaGrad)" className="transition-all duration-500" />
          )}

          {/* Connective Line */}
          {points.length > 0 && (
            <path
              d={linePath}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-500"
            />
          )}

          {/* Nodes / Dots */}
          {points.map((p) => {
            const isHovered = hoveredIdx === p.index;
            return (
              <g key={p.index} className="cursor-pointer">
                {/* Larger invisible hit target */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="transparent"
                  onMouseEnter={() => setHoveredIdx(p.index)}
                  onClick={() => setHoveredIdx(p.index)}
                />
                {/* Glow ring around hovered point */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill="rgba(248, 69, 101, 0.2)"
                    className="animate-ping"
                  />
                )}
                {/* Outer circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "6" : "4.5"}
                  fill="#ffffff"
                  stroke={isHovered ? "#F84565" : "#e2e8f0"}
                  strokeWidth={isHovered ? "3" : "1.5"}
                  onMouseEnter={() => setHoveredIdx(p.index)}
                  onClick={() => setHoveredIdx(p.index)}
                  className="transition-all duration-200"
                />
                {/* X axis labels (Q1, Q2, etc.) */}
                <text
                  x={p.x}
                  y={height - 5}
                  textAnchor="middle"
                  className={`text-[9px] font-bold fill-current ${
                    isHovered ? 'text-primary fill-primary' : 'text-gray-400 fill-gray-400'
                  } transition-colors`}
                >
                  Q{p.index + 1}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {activePoint && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 animate-fade-in transition-all duration-300">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question Focus</p>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{activePoint.question}</p>
          <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <div>
              <p className="text-[10px] font-bold text-gray-400">Selected Answer</p>
              <p className="text-xs font-medium text-slate-700 mt-0.5">{activePoint.selectedText}</p>
            </div>
            {activePoint.score < 4 && activePoint.correctText && (
              <div>
                <p className="text-[10px] font-bold text-emerald-500">Expert Standard (Score 4/4)</p>
                <p className="text-xs font-medium text-emerald-800 mt-0.5">{activePoint.correctText}</p>
              </div>
            )}
            {activePoint.score === 4 && (
              <div>
                <p className="text-[10px] font-bold text-emerald-600">✓ Perfect Match</p>
                <p className="text-xs font-semibold text-emerald-700 mt-0.5">You selected the absolute strongest expert-level strategy!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CareerTestPage() {
  const [step, setStep] = useState('select');
  const [domain, setDomain] = useState('');
  const [pendingDomain, setPendingDomain] = useState(null);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [timedMode, setTimedMode] = useState(true);
  const [customSubject, setCustomSubject] = useState('');
  const [timeLimit, setTimeLimit] = useState(60);

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerDetails, setAnswerDetails] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [ringProgress, setRingProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const [slideKey, setSlideKey] = useState(0);

  const timerRef = useRef(null);
  const skipAutoResume = useRef(false);
  const isSubmittingRef = useRef(false);
  const questionsRef = useRef(questions);
  const currentRef = useRef(0);
  questionsRef.current = questions;
  currentRef.current = current;
  const { user } = useUser();
  const navigate = useNavigate();

  const getDomainName = (domainId) => domains.find((d) => d.id === domainId)?.name || domainId;
  const domainInfo = domains.find((d) => d.id === domain);

  const clearTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    const fetchSaved = async () => {
      if (
        skipAutoResume.current ||
        !user?.primaryEmailAddress?.emailAddress ||
        step !== 'select'
      ) {
        return;
      }
      try {
        setLoading(true);
        const res = await apiService.getAssessment(user.primaryEmailAddress.emailAddress);
        if (res.success && res.assessment) {
          setResult(res.assessment);
          setDomain(res.assessment.domain);
          const pct = Number(res.assessment.percentage) || 0;
          setRingProgress(pct);
          setStep('result');
        }
      } catch {
        /* no saved assessment */
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, [user, step]);

  useEffect(() => {
    const saved = sessionStorage.getItem('careerTestState');
    if (!saved) return;
    try {
      const p = JSON.parse(saved);
      if (p.step && p.domain && p.step !== 'select') {
        setStep(p.step);
        setDomain(p.domain);
        setQuestions(p.questions || []);
        setCurrent(p.current || 0);
        setAnswers(p.answers || []);
        setAnswerDetails(p.answerDetails || []);
        setResult(p.result || null);
        setDifficulty(p.difficulty || 'Medium');
        setBestStreak(p.bestStreak || 0);
      }
    } catch {
      sessionStorage.removeItem('careerTestState');
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      'careerTestState',
      JSON.stringify({
        step,
        domain,
        questions,
        current,
        answers,
        answerDetails,
        result,
        difficulty,
        bestStreak,
      })
    );
  }, [step, domain, questions, current, answers, answerDetails, result, difficulty, bestStreak]);

  useEffect(() => {
    if (step !== 'ready' || countdown === null) return;
    if (countdown <= 0) {
      setStep('test');
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 700);
    return () => clearTimeout(t);
  }, [step, countdown]);

  const submitAnswer = useCallback((score, idx, auto = false) => {
    if (isSubmittingRef.current) return;

    const qs = questionsRef.current;
    const qIndex = currentRef.current;
    const q = qs[qIndex];
    if (!q) return;

    isSubmittingRef.current = true;
    clearTimer();
    if (!auto) setSelectedIdx(idx);

    const opt = idx != null ? q.options[idx] : q.options[0];
    const detail = {
      question: q.question,
      score,
      selectedText: opt?.text || '',
      correctText: q.options.find((o) => o.score === 4)?.text,
    };

    const delay = auto ? 0 : 350;
    setTimeout(() => {
      setAnswers((prev) => [...prev, score]);
      setAnswerDetails((prev) => [...prev, detail]);
      setSelectedIdx(null);

      setStreak((prevStreak) => {
        const newStreak = score >= 3 ? prevStreak + 1 : 0;
        setBestStreak((b) => Math.max(b, newStreak));
        return newStreak;
      });

      if (qIndex < qs.length - 1) {
        const next = qIndex + 1;
        currentRef.current = next;
        setSlideKey((k) => k + 1);
        setCurrent(next);
      } else {
        setStep('review');
      }
      isSubmittingRef.current = false;
    }, delay);
  }, []);

  useEffect(() => {
    if (step !== 'test' || !timedMode || questions.length === 0) return;
    setTimeLeft(timeLimit);
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimer();
          submitAnswer(1, null, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return clearTimer;
  }, [current, questions.length, step, timedMode, timeLimit, submitAnswer]);

  useEffect(() => {
    if (step !== 'test') return;
    const onKey = (e) => {
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 4 && selectedIdx === null) {
        const idx = n - 1;
        if (questions[current]?.options[idx]) {
          submitAnswer(questions[current].options[idx].score, idx);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, current, questions, selectedIdx, submitAnswer]);

  const startQuiz = async () => {
    let domainId = pendingDomain || domain;
    if (!domainId) return;

    if (domainId === 'custom_topic') {
      if (!customSubject.trim()) {
        toast.error('Please enter a custom domain or subject!');
        return;
      }
      domainId = customSubject.trim();
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiService.generateAssessmentQuestions({
        domain: domainId,
        domainName: getDomainName(domainId),
        difficulty,
        questionCount,
      });

      if (!res.success || !res.questions?.length) {
        throw new Error(res.message || 'Could not load questions');
      }

      setDomain(domainId);
      setQuestions(res.questions);
      currentRef.current = 0;
      setCurrent(0);
      setAnswers([]);
      setAnswerDetails([]);
      setStreak(0);
      setResult(null);
      setPendingDomain(null);
      setCountdown(3);
      setStep('ready');
      toast.success('Your custom quiz is ready!');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const finishAssessment = async () => {
    setLoading(true);
    setError(null);

    const activeDomain = domain || pendingDomain;
    if (!activeDomain) {
      setError('Assessment domain is missing. Please start a new quiz.');
      setLoading(false);
      return;
    }

    const details = answerDetails;
    const scores =
      answers.length > 0 ? answers : details.map((d) => Number(d.score) || 0);

    if (details.length === 0) {
      setError('No answers recorded. Please take the quiz again.');
      setLoading(false);
      setStep('select');
      return;
    }

    const totalScore = scores.reduce((a, b) => a + b, 0);
    const qCount = Math.max(questions.length, details.length, scores.length, 1);
    const maxPossibleScore = qCount * 4;
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);
    const safePercentage = Number.isFinite(percentage) ? percentage : 0;
    const level = getLevelFromPercentage(safePercentage);

    try {
      let insights = buildLocalResult(activeDomain, safePercentage);

      try {
        const aiRes = await apiService.evaluateAssessment({
          domain: activeDomain,
          domainName: getDomainName(activeDomain),
          percentage: safePercentage,
          level,
          responses: details,
        });
        if (aiRes.success && aiRes.insights) {
          insights = { level, ...aiRes.insights };
        }
      } catch {
        console.warn('AI insights fallback to local');
      }

      const finalResult = {
        ...insights,
        percentage: safePercentage,
        totalScore,
        maxPossibleScore,
        bestStreak,
        difficulty,
      };

      setDomain(activeDomain);
      setResult(finalResult);
      setStep('result');
      setRingProgress(0);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setRingProgress(safePercentage));
      });

      if (user?.primaryEmailAddress?.emailAddress) {
        try {
          await apiService.saveAssessment({
            email: user.primaryEmailAddress.emailAddress,
            domain: activeDomain,
            ...finalResult,
          });
        } catch {
          /* save optional */
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to evaluate');
    } finally {
      setLoading(false);
    }
  };

  const restartTest = () => {
    clearTimer();
    skipAutoResume.current = true;
    isSubmittingRef.current = false;
    setStep('select');
    setDomain('');
    setPendingDomain(null);
    setCustomSubject('');
    setTimeLimit(60);
    setQuestions([]);
    currentRef.current = 0;
    setCurrent(0);
    setAnswers([]);
    setAnswerDetails([]);
    setResult(null);
    setStreak(0);
    setBestStreak(0);
    setRingProgress(0);
    setError(null);
    setLoading(false);
    sessionStorage.removeItem('careerTestState');
  };

  const copyResults = async () => {
    if (!result) return;
    const text = `Career AI Assessment — ${getDomainName(domain)}
Score: ${result.percentage}% (${result.level})
${result.recommendation}

Strengths: ${result.strengths?.join(', ')}
Next steps: ${result.next_steps?.join('; ')}`;
    await navigator.clipboard.writeText(text);
    toast.success('Results copied!');
  };

  const scoreColor = (score) => {
    if (score >= 4) return 'border-green-300 bg-green-50';
    if (score >= 3) return 'border-blue-300 bg-blue-50';
    if (score >= 2) return 'border-amber-300 bg-amber-50';
    return 'border-red-200 bg-red-50';
  };

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-slate-50 -z-10" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-100/40 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-gray-200 shadow-sm mb-4">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-gray-700">Powered by Gemini AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            AI Career <span className="text-primary">Assessment</span>
          </h1>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">
            Fresh questions every time · Personalized AI feedback · Level up your career readiness
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex justify-between items-start gap-4">
            <p className="text-red-700 text-sm">{error}</p>
            <button type="button" onClick={() => setError(null)} className="text-red-500 text-sm font-medium">
              Dismiss
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-24">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-rose-100 rounded-full" />
              <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-primary rounded-full animate-spin" />
            </div>
            <p className="mt-6 text-gray-600 font-medium">
              {step === 'test' || step === 'review'
                ? 'Analyzing your answers with AI...'
                : 'Crafting your unique question set...'}
            </p>
            <div className="flex gap-1 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && step === 'select' && (
          <div className="space-y-8">
            {/* Stats strip */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Sparkles, label: 'AI Questions', sub: 'Never the same twice' },
                { icon: Timer, label: 'Timed Mode', sub: 'Optional challenge' },
                { icon: Trophy, label: 'AI Report', sub: 'Personalized insights' },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="bg-white/70 backdrop-blur rounded-2xl p-4 border border-white shadow-sm text-center"
                >
                  <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="font-semibold text-sm text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {domains.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setPendingDomain(d.id)}
                  className={`group text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    pendingDomain === d.id
                      ? 'border-primary bg-white shadow-md ring-4 ring-primary/10'
                      : 'border-gray-100 bg-white/80 hover:border-primary/40'
                  }`}
                >
                  <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">
                    {d.icon}
                  </span>
                  <p className="font-bold text-gray-900">{d.name}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{d.description}</p>
                </button>
              ))}

              {/* Custom Topic Card */}
              <button
                type="button"
                onClick={() => {
                  setPendingDomain('custom_topic');
                }}
                className={`group text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer ${
                  pendingDomain === 'custom_topic' || (pendingDomain && !domains.find((d) => d.id === pendingDomain))
                    ? 'border-primary bg-white shadow-md ring-4 ring-primary/10'
                    : 'border-gray-100 bg-white/80 hover:border-primary/40'
                }`}
              >
                <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform">
                  ✨
                </span>
                <p className="font-bold text-gray-900">Custom Topic / Subject</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  Test your skills on any custom technology, subject, or niche career skill.
                </p>
              </button>
            </div>

            {/* Custom Subject Input Field (if selected) */}
            {(pendingDomain === 'custom_topic' || (pendingDomain && !domains.find((d) => d.id === pendingDomain))) && (
              <div className="p-6 bg-white border border-gray-200 rounded-3xl shadow-xl animate-fade-in space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Enter Custom Domain or Subject details
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => {
                    setCustomSubject(e.target.value);
                    setPendingDomain(e.target.value || 'custom_topic');
                  }}
                  placeholder="e.g., React Native Development, Organic Chemistry, Kubernetes Administration..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-gray-900 placeholder-gray-400 transition-all"
                />
                <p className="text-xs text-gray-400">
                  AI will generate completely fresh, tailored questions to evaluate your competency in this exact subject.
                </p>
              </div>
            )}

            {pendingDomain && (
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Configure your quiz — {getDomainName(pendingDomain === 'custom_topic' ? 'Custom Topic' : pendingDomain)}
                </h3>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Difficulty</p>
                    <div className="flex flex-col gap-2">
                      {DIFFICULTIES.map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setDifficulty(d)}
                          className={`py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                            difficulty === d
                              ? 'bg-primary text-white shadow-md'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Questions</p>
                    <div className="flex gap-2">
                      {QUESTION_COUNTS.map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setQuestionCount(n)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold ${
                            questionCount === n ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Mode</p>
                    <button
                      type="button"
                      onClick={() => setTimedMode(!timedMode)}
                      className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium flex items-center justify-center gap-2 ${
                        timedMode ? 'bg-primary/10 text-primary border-2 border-primary' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Timer className="w-4 h-4" />
                      {timedMode ? 'Timed' : 'Untimed'}
                    </button>
                    {/* Dynamic Timer Limit Picker */}
                    {timedMode && (
                      <div className="mt-3 space-y-1.5 animate-fade-in">
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Time Limit per Q</p>
                        <div className="flex gap-1.5">
                          {[15, 30, 60, 90].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setTimeLimit(t)}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                                timeLimit === t
                                  ? 'bg-primary text-white border-primary shadow-sm'
                                  : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
                              }`}
                            >
                              {t}s
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={startQuiz}
                  className="w-full py-4 bg-primary hover:bg-primary-dull text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all hover:scale-[1.01]"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Assessment
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && step === 'ready' && (
          <div className="flex flex-col items-center justify-center py-32">
            <p className="text-gray-500 text-lg mb-4">Get ready...</p>
            <span className="text-8xl font-black text-primary animate-pulse">
              {countdown > 0 ? countdown : 'Go!'}
            </span>
            <p className="text-gray-600 mt-6">{getDomainName(domain)} · {difficulty}</p>
          </div>
        )}

        {!loading && step === 'test' && questions[current] && (
          <div key={slideKey} className="transition-all duration-300">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Top bar */}
              <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{domainInfo?.icon || '✨'}</span>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">Question</p>
                    <p className="font-bold">
                      {current + 1} / {questions.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {streak >= 2 && (
                    <span className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                      <Flame className="w-4 h-4" /> {streak} streak
                    </span>
                  )}
                  {timedMode && <TimerRing seconds={timeLeft} max={timeLimit} />}
                </div>
              </div>

              {/* Progress dots */}
              <div className="px-6 pt-4 flex gap-1.5 flex-wrap">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 min-w-[8px] max-w-8 rounded-full transition-colors ${
                      i < current ? 'bg-primary' : i === current ? 'bg-primary/50' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <div className="p-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-8">
                  {questions[current].question}
                </h2>

                <div className="space-y-3">
                  {questions[current].options.map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => submitAnswer(opt.score, idx)}
                      disabled={selectedIdx !== null}
                      className={`w-full p-4 rounded-2xl text-left border-2 transition-all duration-200 ${
                        selectedIdx === idx
                          ? 'border-primary bg-primary/10 scale-[1.02] shadow-md'
                          : 'border-gray-100 bg-gray-50 hover:border-primary/30 hover:bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center font-bold text-primary shadow-sm">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-gray-800 font-medium">{opt.text}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                  Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">1</kbd>–
                  <kbd className="px-1.5 py-0.5 bg-gray-100 rounded border">4</kbd> to answer quickly
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && step === 'review' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-gray-900">Review your answers</h2>
              {result && (
                <button
                  type="button"
                  onClick={() => setStep('result')}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  ← Back to results
                </button>
              )}
            </div>
            {answerDetails.length === 0 && (
              <p className="text-gray-500 text-center py-8">
                No answers saved. Please start a new quiz.
              </p>
            )}
            {answerDetails.map((a, i) => (
              <div key={i} className={`p-5 rounded-2xl border-2 ${scoreColor(a.score)}`}>
                <div className="flex items-start gap-3">
                  {a.score >= 3 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Q{i + 1}. {a.question}</p>
                    <p className="text-sm text-gray-600 mt-2">Your answer: {a.selectedText}</p>
                    {a.score < 4 && (
                      <p className="text-sm text-green-700 mt-1">Strongest: {a.correctText}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {answerDetails.length > 0 && !result && (
              <button
                type="button"
                onClick={finishAssessment}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dull transition-colors"
              >
                Get AI Results
              </button>
            )}
          </div>
        )}

        {!loading && step === 'result' && result && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-rose-400 px-8 py-10 text-white text-center">
                <Trophy className="w-12 h-12 mx-auto mb-3 opacity-90" />
                <h2 className="text-3xl font-extrabold">Assessment Complete!</h2>
                <p className="opacity-90 mt-1">{getDomainName(domain)} · {difficulty}</p>
              </div>

              <div className="p-8 flex flex-col items-center">
                <ScoreRing percentage={result.percentage} animated={ringProgress} />
                <span
                  className={`mt-5 px-6 py-2 rounded-full text-sm font-bold border capitalize ${
                    levelBadgeStyles[result.level] || levelBadgeStyles.beginner
                  }`}
                >
                  {result.level}
                </span>

                <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-8">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">{result.totalScore}</p>
                    <p className="text-xs text-gray-500">Points</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-primary">{bestStreak || result.bestStreak || 0}</p>
                    <p className="text-xs text-gray-500">Best streak</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <p className="text-2xl font-bold text-gray-900">{questions.length || 10}</p>
                    <p className="text-xs text-gray-500">Questions</p>
                  </div>
                </div>
              </div>
            </div>

            {/* UPGRADE: Premium Visual Analytics Dashboard */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 space-y-8 animate-fade-in">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" /> Visual Analytics & Diagnostics
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  A real-time visual breakdown of your performance, question pacing, and mastery profile.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* 1. Skill Mastery Strength Profile */}
                <SkillMasteryChart answerDetails={answerDetails} />

                {/* 2. Key Performance Indicators Grid */}
                <KpiGrid answerDetails={answerDetails} result={result} bestStreak={bestStreak} />
              </div>

              <hr className="border-gray-100" />

              {/* 3. Performance Timeline Area Chart */}
              <PerformanceTimelineChart answerDetails={answerDetails} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-green-500" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {result.strengths?.map((s, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-green-500">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-500" /> Improve
                </h4>
                <ul className="space-y-2">
                  {result.areas_for_improvement?.map((a, i) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">
                      <span className="text-amber-500">→</span> {a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-2">AI Coach says</h4>
              <p className="text-gray-700 leading-relaxed">{result.recommendation}</p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-rose-50 p-6 rounded-2xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4">Your action plan</h4>
              <ol className="space-y-3">
                {result.next_steps?.map((ns, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 pt-1">{ns}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Review accordion */}
            {answerDetails.length > 0 && (
              <details className="bg-white rounded-2xl border border-gray-100 p-6">
                <summary className="font-bold text-gray-900 cursor-pointer">View answer breakdown</summary>
                <div className="mt-4 space-y-3">
                  {answerDetails.map((a, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${scoreColor(a.score)}`}>
                      <p className="text-sm font-medium text-gray-900">
                        Q{i + 1}. {a.question}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">You: {a.selectedText}</p>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="flex flex-wrap gap-3 justify-center pt-4">
              <button
                type="button"
                onClick={() =>
                  navigate('/roadmap-generator', {
                    state: {
                      prefilledPrompt: `Career roadmap for ${getDomainName(domain)} at ${result.level} level (${result.percentage}% on skills quiz)`,
                    },
                  })
                }
                className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dull shadow-lg shadow-primary/20"
              >
                Generate Roadmap
              </button>
              <button
                type="button"
                onClick={copyResults}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" /> Copy results
              </button>
              {answerDetails.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStep('review')}
                  className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50"
                >
                  <Share2 className="w-4 h-4" /> Review answers
                </button>
              )}
              <button
                type="button"
                onClick={restartTest}
                className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold flex items-center gap-2 hover:bg-gray-50"
              >
                <RotateCcw className="w-4 h-4" /> New quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
