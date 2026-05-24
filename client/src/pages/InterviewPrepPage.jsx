import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import {
  MessageSquare,
  Loader2,
  RotateCcw,
  Sparkles,
  History,
  Trash2,
  Shuffle,
  Copy,
  Star,
  ChevronLeft,
  ChevronRight,
  Timer,
  LayoutGrid,
  Mic,
  Plus,
  CheckCircle2,
  Lightbulb,
  Building2,
} from 'lucide-react';
import { apiService } from '../services/apiService';
import {
  QUESTION_TYPES,
  DIFFICULTIES,
  EXPERIENCE_LEVELS,
  ROLE_SUGGESTIONS,
  TYPE_META,
  MOCK_TIMER_SECONDS,
} from '../utils/interviewPrepConstants';

const FlipCard = ({
  question,
  answer,
  tip,
  index,
  starred,
  practiced,
  onToggleStar,
  onMarkPracticed,
}) => {
  const [flipped, setFlipped] = useState(false);

  const copyText = async (text, label) => {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all h-full min-h-[280px] ${
        practiced ? 'border-green-300 bg-green-50/30' : 'border-gray-200 bg-white'
      } ${starred ? 'ring-2 ring-amber-300/60' : ''}`}
    >
      <div className="absolute top-3 right-3 flex gap-1 z-10">
        <button
          type="button"
          onClick={() => onToggleStar(index)}
          className="p-1.5 rounded-lg bg-white/90 border border-gray-200 hover:bg-amber-50"
          aria-label="Star question"
        >
          <Star className={`w-4 h-4 ${starred ? 'fill-amber-400 text-amber-500' : 'text-gray-400'}`} />
        </button>
        <button
          type="button"
          onClick={() => copyText(question, 'Question')}
          className="p-1.5 rounded-lg bg-white/90 border border-gray-200 hover:bg-gray-50"
        >
          <Copy className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFlipped(!flipped)}
        className="w-full h-full p-6 pt-12 text-left flex flex-col"
      >
        {!flipped ? (
          <>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
              Q{index + 1}
              {practiced && (
                <span className="ml-2 text-green-600 normal-case font-medium inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Practiced
                </span>
              )}
            </span>
            <p className="text-gray-900 font-semibold leading-relaxed flex-grow">{question}</p>
            <span className="text-xs text-gray-400 mt-4">Tap to reveal answer & tip</span>
          </>
        ) : (
          <>
            <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Answer</span>
            <p className="text-gray-700 text-sm leading-relaxed flex-grow overflow-y-auto max-h-40">{answer}</p>
            {tip && (
              <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10 flex gap-2">
                <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600">{tip}</p>
              </div>
            )}
            <span className="text-xs text-gray-400 mt-3">Tap to see question</span>
          </>
        )}
      </button>

      {flipped && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMarkPracticed(index);
          }}
          className="absolute bottom-3 left-3 text-xs font-medium text-green-700 bg-green-100 px-3 py-1.5 rounded-full hover:bg-green-200"
        >
          Mark as practiced
        </button>
      )}
    </div>
  );
};

export default function InterviewPrepPage() {
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;

  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [questionType, setQuestionType] = useState('Technical');
  const [difficulty, setDifficulty] = useState('Medium');
  const [experienceLevel, setExperienceLevel] = useState('Mid-level');
  const [session, setSession] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [viewMode, setViewMode] = useState('grid');
  const [mockIndex, setMockIndex] = useState(0);
  const [mockTimer, setMockTimer] = useState(MOCK_TIMER_SECONDS);
  const [mockRunning, setMockRunning] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState(null);

  const [practiced, setPracticed] = useState({});
  const [starred, setStarred] = useState({});

  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadHistory = useCallback(async () => {
    if (!email) return;
    setLoadingHistory(true);
    try {
      const res = await apiService.getInterviewHistory(email);
      if (res.success) setHistory(res.history);
    } catch {
      toast.error('Could not load session history');
    } finally {
      setLoadingHistory(false);
    }
  }, [email]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (viewMode !== 'mock' || !mockRunning) return;
    if (mockTimer <= 0) {
      setMockRunning(false);
      toast.message('Time is up! Reveal the answer and reflect on your response.');
      return;
    }
    const t = setInterval(() => setMockTimer((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [viewMode, mockRunning, mockTimer]);

  const orderedQuestions = useMemo(() => {
    if (!session?.questions) return [];
    const qs = session.questions.map((q, i) => ({ ...q, originalIndex: i }));
    if (!shuffledOrder) return qs;
    return shuffledOrder.map((i) => qs[i]);
  }, [session, shuffledOrder]);

  const practicedCount = Object.keys(practiced).length;
  const progressPct = session ? Math.round((practicedCount / session.questions.length) * 100) : 0;

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!role.trim()) {
      toast.error('Please enter a job role');
      return;
    }
    if (!email) {
      toast.error('Please log in to generate interview questions');
      return;
    }

    try {
      setIsGenerating(true);
      const res = await apiService.generateInterviewQuestions({
        email,
        role: role.trim(),
        company: company.trim(),
        questionType,
        difficulty,
        experienceLevel,
        questionCount: 10,
      });
      if (res.success) {
        setSession(res.session);
        setPracticed({});
        setStarred({});
        setShuffledOrder(null);
        setMockIndex(0);
        setViewMode('grid');
        loadHistory();
        toast.success('Interview session ready!');
      } else {
        toast.error(res.message || 'Generation failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error generating questions');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateMore = async () => {
    if (!email || !session?.id) return;
    try {
      setIsLoadingMore(true);
      const res = await apiService.generateMoreInterviewQuestions(email, session.id, 3);
      if (res.success) {
        setSession(res.session);
        toast.success(`Added ${res.added} new questions`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not generate more');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadSession = async (id) => {
    if (!email) return;
    try {
      const res = await apiService.getInterviewSession(email, id);
      if (res.success) {
        setSession(res.session);
        setPracticed({});
        setStarred({});
        setShuffledOrder(null);
        setMockIndex(0);
        setRole(res.session.role);
        setCompany(res.session.company || '');
        setQuestionType(res.session.question_type);
        setDifficulty(res.session.difficulty || 'Medium');
        setExperienceLevel(res.session.experience_level || 'Mid-level');
        setHistoryOpen(false);
        toast.success('Session loaded');
      }
    } catch {
      toast.error('Failed to load session');
    }
  };

  const deleteSession = async (id, e) => {
    e?.stopPropagation();
    try {
      await apiService.deleteInterviewHistory(id);
      setHistory((h) => h.filter((x) => x.id !== id));
      if (session?.id === id) setSession(null);
      toast.success('Session deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleShuffle = () => {
    const order = session.questions.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    setShuffledOrder(order);
    setMockIndex(0);
    toast.success('Questions shuffled');
  };

  const copyAllQuestions = async () => {
    const text = session.questions
      .map((q, i) => `Q${i + 1}: ${q.question}\nA: ${q.answer}${q.tip ? `\nTip: ${q.tip}` : ''}`)
      .join('\n\n---\n\n');
    await navigator.clipboard.writeText(text);
    toast.success('Full session copied to clipboard');
  };

  const handleNewSession = () => {
    setSession(null);
    setPracticed({});
    setStarred({});
    setShuffledOrder(null);
    setMockIndex(0);
    setViewMode('grid');
  };

  const currentMockQ = orderedQuestions[mockIndex];
  const typeMeta = TYPE_META[questionType] || TYPE_META.Technical;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 flex gap-6">
        {/* History sidebar */}
        <aside
          className={`${
            historyOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          } fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-gray-200 shadow-xl lg:shadow-none transition-transform pt-24 lg:pt-0 lg:block shrink-0`}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" />
              Past Sessions
            </h3>
            <button
              type="button"
              className="lg:hidden text-gray-500"
              onClick={() => setHistoryOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-8rem)] space-y-2">
            {loadingHistory ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto my-8" />
            ) : history.length === 0 ? (
              <p className="text-sm text-gray-500 p-3">No saved sessions yet.</p>
            ) : (
              history.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => loadSession(h.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all group ${
                    session?.id === h.id
                      ? 'border-primary bg-rose-50'
                      : 'border-gray-100 hover:border-primary/30 hover:bg-gray-50'
                  }`}
                >
                  <p className="font-medium text-sm text-gray-900 line-clamp-1">{h.role}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {h.question_type} · {h.question_count} Q · {h.difficulty}
                  </p>
                  {h.company && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3" /> {h.company}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(h.created_at).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => deleteSession(h.id, e)}
                      className="p-1 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        {historyOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setHistoryOpen(false)}
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-sm">
              <MessageSquare className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">AI Interview Coach</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Interview Prep</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mock interviews, STAR coaching, session history, and AI-tailored questions
            </p>
            <button
              type="button"
              onClick={() => setHistoryOpen(true)}
              className="mt-4 lg:hidden text-sm text-primary font-medium"
            >
              View past sessions
            </button>
          </div>

          {!session ? (
            <form
              onSubmit={handleGenerate}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-2xl mx-auto"
            >
              <label className="block text-sm font-semibold text-gray-800 mb-2">Job Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none mb-3"
                disabled={isGenerating}
              />
              <div className="flex flex-wrap gap-2 mb-6">
                {ROLE_SUGGESTIONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary"
                  >
                    {r}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Company <span className="font-normal text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Stripe"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none mb-6"
                disabled={isGenerating}
              />

              <label className="block text-sm font-semibold text-gray-800 mb-2">Question Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {QUESTION_TYPES.map((type) => {
                  const meta = TYPE_META[type];
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setQuestionType(type)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        questionType === type
                          ? 'border-primary bg-rose-50 ring-2 ring-primary/20'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{meta.emoji}</span>
                      <p className="font-semibold text-sm mt-2">{type}</p>
                      <p className="text-xs text-gray-500 mt-1">{meta.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Difficulty</label>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTIES.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDifficulty(d)}
                        className={`px-3 py-1.5 rounded-full text-sm ${
                          difficulty === d ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Experience</label>
                  <div className="flex flex-col gap-2">
                    {EXPERIENCE_LEVELS.map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setExperienceLevel(l)}
                        className={`px-3 py-1.5 rounded-lg text-sm text-left ${
                          experienceLevel === l ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl mb-6 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-sm text-amber-900">
                  <strong>Coach tip:</strong> {TYPE_META[questionType].coachTip}
                </p>
              </div>

              <button
                type="submit"
                disabled={isGenerating || !role.trim()}
                className="w-full py-3.5 bg-primary hover:bg-primary-dull disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Building your interview pack...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 10 Questions
                  </>
                )}
              </button>
            </form>
          ) : (
            <div>
              {/* Session header */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{session.role}</h2>
                    <p className="text-gray-500 text-sm mt-1">
                      {session.question_type} · {session.difficulty} · {session.experience_level}
                      {session.company && ` · ${session.company}`}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('grid');
                        setMockRunning(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                        viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" /> Flashcards
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('mock');
                        setMockIndex(0);
                        setMockTimer(MOCK_TIMER_SECONDS);
                        setMockRunning(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                        viewMode === 'mock' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Mic className="w-4 h-4" /> Mock Interview
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Practice progress</span>
                    <span>
                      {practicedCount}/{session.questions.length} ({progressPct}%)
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    type="button"
                    onClick={handleShuffle}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Shuffle className="w-4 h-4" /> Shuffle
                  </button>
                  <button
                    type="button"
                    onClick={copyAllQuestions}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    <Copy className="w-4 h-4" /> Copy all
                  </button>
                  <button
                    type="button"
                    onClick={handleGenerateMore}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    +3 Questions
                  </button>
                  <button
                    type="button"
                    onClick={handleNewSession}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 ml-auto"
                  >
                    <RotateCcw className="w-4 h-4" /> New Session
                  </button>
                </div>
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orderedQuestions.map((q, displayIdx) => (
                    <FlipCard
                      key={`${q.originalIndex}-${displayIdx}`}
                      index={displayIdx}
                      question={q.question}
                      answer={q.answer}
                      tip={q.tip}
                      starred={!!starred[q.originalIndex]}
                      practiced={!!practiced[q.originalIndex]}
                      onToggleStar={(i) => {
                        const orig = orderedQuestions[i].originalIndex;
                        setStarred((s) => ({ ...s, [orig]: !s[orig] }));
                      }}
                      onMarkPracticed={(i) => {
                        const orig = orderedQuestions[i].originalIndex;
                        setPracticed((p) => ({ ...p, [orig]: true }));
                        toast.success('Marked as practiced');
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  {currentMockQ && (
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Question {mockIndex + 1} of {orderedQuestions.length}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 font-mono text-lg ${
                            mockTimer <= 30 ? 'text-red-400 animate-pulse' : ''
                          }`}
                        >
                          <Timer className="w-5 h-5" />
                          {Math.floor(mockTimer / 60)}:{String(mockTimer % 60).padStart(2, '0')}
                        </span>
                      </div>

                      <div className="p-8">
                        <p className="text-xl font-semibold text-gray-900 leading-relaxed mb-8">
                          {currentMockQ.question}
                        </p>

                        <div className="flex flex-wrap gap-3">
                          {!mockRunning ? (
                            <button
                              type="button"
                              onClick={() => setMockRunning(true)}
                              className="px-5 py-2.5 bg-primary text-white rounded-xl font-medium"
                            >
                              Start 2-min Timer
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setMockRunning(false)}
                              className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl font-medium"
                            >
                              Pause Timer
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const orig = currentMockQ.originalIndex;
                              setPracticed((p) => ({ ...p, [orig]: true }));
                            }}
                            className="px-5 py-2.5 bg-green-100 text-green-800 rounded-xl font-medium"
                          >
                            Done practicing
                          </button>
                        </div>

                        <details className="mt-8 group">
                          <summary className="cursor-pointer text-sm font-medium text-primary hover:underline">
                            Reveal sample answer & tip
                          </summary>
                          <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-gray-700 text-sm leading-relaxed">{currentMockQ.answer}</p>
                            {currentMockQ.tip && (
                              <p className="text-xs text-gray-500 mt-3 flex gap-2">
                                <Lightbulb className="w-4 h-4 text-primary shrink-0" />
                                {currentMockQ.tip}
                              </p>
                            )}
                          </div>
                        </details>
                      </div>

                      <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <button
                          type="button"
                          disabled={mockIndex === 0}
                          onClick={() => {
                            setMockIndex((i) => i - 1);
                            setMockTimer(MOCK_TIMER_SECONDS);
                            setMockRunning(false);
                          }}
                          className="flex items-center gap-1 text-sm font-medium disabled:opacity-40"
                        >
                          <ChevronLeft className="w-5 h-5" /> Previous
                        </button>
                        <button
                          type="button"
                          disabled={mockIndex >= orderedQuestions.length - 1}
                          onClick={() => {
                            setMockIndex((i) => i + 1);
                            setMockTimer(MOCK_TIMER_SECONDS);
                            setMockRunning(false);
                          }}
                          className="flex items-center gap-1 text-sm font-medium disabled:opacity-40"
                        >
                          Next <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  <p className="text-center text-sm text-gray-500 mt-6">{typeMeta.coachTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
