import {
  useUser,
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react';
import { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronRight,
  ChevronDown,
  LogOut,
  Loader2,
  CheckCircle,
  BarChart2,
  Clock,
  Award,
  Map,
  Bookmark,
  ClipboardList,
  Trash2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  User,
  Shield,
  Zap,
  ArrowRight,
  BookmarkCheck,
  TrendingUp,
  BrainCircuit,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import apiService from '../services/apiService';
import { pathways } from '../assets/pathwaysData';
import { domains, levelBadgeStyles, levelDescriptions } from '../utils/constants';
import { getSavedCareers } from '../utils/savedCareers';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { StatsSkeleton, ListSkeleton, CardSkeleton } from '../components/ui/Skeleton';

const DashboardContent = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Connect active section to URL Search Params: ?tab=overview
  const activeSection = searchParams.get('tab') || 'overview';
  const setActiveSection = (section) => setSearchParams({ tab: section });

  const [assessment, setAssessment] = useState(null);
  const [roadmapHistory, setRoadmapHistory] = useState([]);
  const [savedCareerIds, setSavedCareerIds] = useState([]);
  const [expandedRoadmapId, setExpandedRoadmapId] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  const email = user?.primaryEmailAddress?.emailAddress;

  const savedPathways = useMemo(
    () => pathways.filter((p) => savedCareerIds.includes(p.id)),
    [savedCareerIds]
  );

  const daysActive = useMemo(() => {
    if (!user?.createdAt) return 0;
    const created = new Date(user.createdAt);
    const now = new Date();
    return Math.max(1, Math.ceil((now - created) / (1000 * 60 * 60 * 24)));
  }, [user?.createdAt]);

  const recentActivity = useMemo(() => {
    const items = [];
    if (assessment) {
      items.push({
        type: 'assessment',
        label: `Completed ${domains.find((d) => d.id === assessment.domain)?.name || assessment.domain} assessment`,
        date: assessment.updatedAt || assessment.createdAt,
      });
    }
    roadmapHistory.slice(0, 5).forEach((r) => {
      items.push({
        type: 'roadmap',
        label: `Generated roadmap: ${r.prompt?.slice(0, 45)}${r.prompt?.length > 45 ? '…' : ''}`,
        date: r.created_at,
      });
    });
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [assessment, roadmapHistory]);

  const aiRecommendations = useMemo(() => {
    if (!assessment) return [];
    const domainId = assessment.domain;
    
    // Map assessment domain to standard pathway IDs
    const mapping = {
      webdev: ['software-engineer', 'ux-designer', 'data-engineer'],
      datascience: ['data-scientist', 'data-engineer', 'ai-ml-engineer'],
      cybersecurity: ['cybersecurity-analyst', 'cloud-architect'],
      cloud: ['cloud-architect', 'iot-specialist', 'devops'],
      blockchain: ['blockchain-developer', 'software-engineer'],
      ai: ['ai-ml-engineer', 'ai-researcher', 'data-scientist'],
      mobile: ['software-engineer', 'ux-designer'],
      devops: ['cloud-architect', 'iot-specialist'],
    };
    
    const ids = mapping[domainId] || ['software-engineer', 'ux-designer'];
    return pathways.filter((p) => ids.includes(p.id)).slice(0, 3);
  }, [assessment]);

  const loadDashboardData = async () => {
    if (!email) return;
    setLoadingData(true);
    try {
      const [assessmentRes, roadmapRes] = await Promise.all([
        apiService.getAssessment(email).catch(() => ({ success: false })),
        apiService.getRoadmapHistory(email).catch(() => ({ success: false, history: [] })),
      ]);
      if (assessmentRes.success && assessmentRes.assessment) {
        setAssessment(assessmentRes.assessment);
      }
      if (roadmapRes.success) {
        setRoadmapHistory(roadmapRes.history || []);
      }
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [email]);

  useEffect(() => {
    const refreshSaved = () => setSavedCareerIds(getSavedCareers());
    refreshSaved();
    window.addEventListener('savedCareersUpdated', refreshSaved);
    return () => window.removeEventListener('savedCareersUpdated', refreshSaved);
  }, []);

  const handleDeleteRoadmap = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await apiService.deleteRoadmapHistory(id);
      if (res.success) {
        setRoadmapHistory((prev) => prev.filter((r) => r._id !== id));
        if (expandedRoadmapId === id) setExpandedRoadmapId(null);
        toast.success('Roadmap deleted successfully');
      }
    } catch {
      toast.error('Failed to delete roadmap');
    }
  };

  const stats = [
    { label: 'Roadmaps Generated', value: roadmapHistory.length, icon: <Map className="w-5 h-5 text-primary" />, desc: 'Custom learning pathways structured' },
    { label: 'Assessments Taken', value: assessment ? 1 : 0, icon: <ClipboardList className="w-5 h-5 text-indigo-500" />, desc: 'AI evaluated benchmark trials' },
    { label: 'Saved Careers', value: savedCareerIds.length, icon: <Bookmark className="w-5 h-5 text-amber-500" />, desc: 'Bookmarked professional pathways' },
    { label: 'Days Active', value: daysActive, icon: <Clock className="w-5 h-5 text-emerald-500" />, desc: 'Consistent platform engagement' },
  ];

  const ScoreRing = ({ percentage }) => {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percentage / 100) * circ;
    return (
      <div className="relative">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f1f5f9" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#gradientScore)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradientScore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F84565" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{percentage}%</span>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Score</span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#f8fafc]">
      {/* Loading Shell */}
      {loadingData && activeSection !== 'profile' && activeSection !== 'saved' ? (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
            <StatsSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CardSkeleton />
            </div>
            <div>
              <CardSkeleton />
            </div>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Header Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome & AI Banner */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 shadow-xl border border-slate-800 flex flex-col justify-between min-h-[220px]">
                  <div className="relative z-10 space-y-4 max-w-xl">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/20 animate-pulse-glow">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI career platform active
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight">
                      Empower Your Journey, {user?.firstName || 'Learner'}
                    </h2>
                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                      Analyze domain readiness, map specialized learning routes, and drill interview questions engineered specifically for your profile.
                    </p>
                  </div>
                  
                  <div className="relative z-10 flex flex-wrap gap-3 mt-6">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate('/career-test')}
                      className="px-5 py-2.5 shadow-md shadow-primary/20 font-bold"
                    >
                      Assess Competency
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/roadmap-generator')}
                      className="px-5 py-2.5 border-slate-700 !bg-transparent hover:!bg-slate-800 text-white font-bold"
                    >
                      Generate Roadmap
                    </Button>
                  </div>
                  {/* Decorative background glow */}
                  <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                  <div className="absolute right-10 top-5 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl" />
                </div>

                {/* Quick Actions widget */}
                <Card className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" /> Quick Commands
                    </CardTitle>
                    <CardDescription>Direct navigation shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2.5 flex-1">
                    {[
                      { label: 'Start Career Test', desc: 'gemini-powered mock assessment', path: '/career-test' },
                      { label: 'AI Roadmap Generator', desc: 'custom multi-step curriculum', path: '/roadmap-generator' },
                      { label: 'Mock Interview Prep', desc: 'adaptive STAR question cards', path: '/interview-prep' },
                    ].map((act, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(act.path)}
                        className="flex items-center justify-between w-full p-3 border border-slate-100 hover:border-primary/20 hover:bg-rose-50/20 rounded-xl transition-all text-left group cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors">
                            {act.label}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">{act.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s) => (
                  <Card key={s.label} hover>
                    <CardContent className="pt-6 flex flex-col justify-between h-full">
                      <div className="flex justify-between items-start mb-3">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">{s.icon}</div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Active
                        </span>
                      </div>
                      <div>
                        <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{s.value}</p>
                        <p className="text-xs font-bold text-slate-800 mt-1">{s.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Recommendations & Analytics */}
                <div className="lg:col-span-2 space-y-6">
                  {/* AI Recommendation Panel */}
                  <Card className="relative overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> Dynamic Recommendations
                          </CardTitle>
                          <CardDescription>Tailored career paths based on quiz evaluation</CardDescription>
                        </div>
                        {assessment && (
                          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                            Based on {domains.find((d) => d.id === assessment.domain)?.name || assessment.domain}
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!assessment ? (
                        <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-4">
                          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                            <BrainCircuit className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">Complete Assessment to Unlock Insights</p>
                            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-normal">
                              Take a brief skill audit assessment to compile customized recommendations, mapping match indices and learning directions.
                            </p>
                          </div>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate('/career-test')}
                            className="font-bold"
                          >
                            Launch Assessment Quiz
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {aiRecommendations.map((path, idx) => {
                            const match = Math.max(75, Math.min(98, Math.round(assessment.percentage - (idx * 6))));
                            return (
                              <div
                                key={path.id}
                                className="border border-slate-100 rounded-xl p-4 flex flex-col justify-between bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-xs"
                              >
                                <div className="space-y-2">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                      {match}% Match
                                    </span>
                                    <TrendingUp className="w-4 h-4 text-slate-300" />
                                  </div>
                                  <h4 className="font-bold text-sm text-slate-900 leading-snug">{path.title}</h4>
                                  <p className="text-[10px] text-slate-500 line-clamp-3 leading-normal">
                                    {path.description}
                                  </p>
                                </div>
                                <div className="pt-4 border-t border-slate-100/60 mt-3 flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-primary">{path.salary.split(' - ')[0]}</span>
                                  <button
                                    onClick={() => navigate(`/pathways/${path.id}`)}
                                    className="text-[10px] font-bold text-slate-800 hover:text-primary inline-flex items-center gap-0.5"
                                  >
                                    Explore <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Analytics Widget (SVG Activity Chart) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <BarChart2 className="w-5 h-5 text-indigo-500" /> Performance Analytics
                      </CardTitle>
                      <CardDescription>Assessment and roadmap structuring progress timeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Interactive Look SVG Chart */}
                      <div className="w-full bg-slate-50/40 rounded-xl border border-slate-100 p-4 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 px-1">
                          <span>Platform Integration Score: Excellent</span>
                          <span>Last 6 Sessions</span>
                        </div>
                        <div className="relative h-40">
                          <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#F84565" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#F84565" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                            {/* Gridlines */}
                            {[20, 60, 100, 140].map((yVal, i) => (
                              <line
                                key={i}
                                x1="0"
                                y1={yVal}
                                x2="500"
                                y2={yVal}
                                stroke="#f1f5f9"
                                strokeWidth="1"
                                strokeDasharray="4 4"
                              />
                            ))}
                            {/* Area under curve */}
                            <path
                              d="M0 140 L 80 110 L 160 120 L 240 70 L 320 85 L 400 45 L 480 30 L 500 30 L 500 140 Z"
                              fill="url(#chartGlow)"
                            />
                            {/* Curved Path */}
                            <path
                              d="M0 140 C 40 125, 60 115, 80 110 C 120 100, 140 125, 160 120 C 200 110, 220 75, 240 70 C 280 60, 300 90, 320 85 C 360 78, 380 50, 400 45 C 440 38, 460 32, 480 30"
                              fill="none"
                              stroke="#F84565"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                            />
                            {/* Nodes */}
                            {[
                              { x: 80, y: 110 },
                              { x: 160, y: 120 },
                              { x: 240, y: 70 },
                              { x: 320, y: 85 },
                              { x: 400, y: 45 },
                              { x: 480, y: 30 },
                            ].map((node, i) => (
                              <circle
                                key={i}
                                cx={node.x}
                                cy={node.y}
                                r="4"
                                fill="white"
                                stroke="#818cf8"
                                strokeWidth="2.5"
                              />
                            ))}
                          </svg>
                          <div className="absolute inset-x-0 bottom-0 flex justify-between text-[9px] font-extrabold text-slate-400 px-1 pt-1.5 border-t border-slate-100">
                            <span>Quiz 1</span>
                            <span>Quiz 2</span>
                            <span>Roadmap 1</span>
                            <span>Roadmap 2</span>
                            <span>Interview Practice</span>
                            <span>Verification</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Side: Timeline & ScoreRing */}
                <div className="space-y-6">
                  {/* Competency Meter */}
                  <Card className="text-center">
                    <CardHeader className="pb-0">
                      <CardTitle className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">
                        Competency Index
                      </CardTitle>
                      <CardDescription>Readiness benchmark</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center pt-6 space-y-4">
                      {assessment ? (
                        <>
                          <ScoreRing percentage={assessment.percentage} />
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-slate-900 capitalize">
                              {assessment.level} Proficiency
                            </h4>
                            <p className="text-[10px] text-slate-400 px-4 font-medium leading-normal">
                              Evaluated in {domains.find((d) => d.id === assessment.domain)?.name || assessment.domain}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="py-8 space-y-4">
                          <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-200 flex items-center justify-center mx-auto">
                            <Award className="w-8 h-8 text-slate-300" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-800">No Assessment Record</p>
                            <p className="text-[10px] text-slate-400 max-w-xs mx-auto leading-normal">
                              Establish your core baseline competency level to generate progress indexes.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Recent Activity timeline */}
                  <Card className="flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-sm font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" /> Activity Log
                      </CardTitle>
                      <CardDescription>Recent events</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      {recentActivity.length === 0 ? (
                        <p className="text-slate-400 text-xs py-8 text-center font-medium">
                          No recent actions recorded.
                        </p>
                      ) : (
                        <div className="relative pl-4 border-l border-slate-100 space-y-5">
                          {recentActivity.map((item, i) => (
                            <div key={i} className="relative text-xs">
                              {/* Dot */}
                              <div className="absolute -left-[20.5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-primary shadow-xs" />
                              <p className="text-slate-700 font-bold leading-snug">{item.label}</p>
                              {item.date && (
                                <p className="text-slate-400 text-[10px] font-medium mt-0.5">
                                  {new Date(item.date).toLocaleDateString(undefined, {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Card className="max-w-4xl mx-auto overflow-hidden">
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
                  {/* Left half */}
                  <div className="lg:w-1/3 p-8 text-center bg-slate-50/50 flex flex-col justify-center items-center">
                    <img
                      src={user?.imageUrl}
                      alt="Profile"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mx-auto mb-6"
                    />
                    <h3 className="text-xl font-bold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">{email}</p>
                    <span className="inline-flex items-center gap-1 mt-4 px-3 py-1 rounded-full text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Verified Member
                    </span>
                  </div>

                  {/* Right half */}
                  <div className="flex-1 p-8">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-6">
                      Account Profile
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Username
                        </span>
                        <p className="text-sm font-semibold text-slate-800">{user?.username || 'Not configured'}</p>
                      </div>

                      <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Account Created
                        </span>
                        <p className="text-sm font-semibold text-slate-800">
                          {user?.createdAt && new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Security Standard
                        </span>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-emerald-500" /> Multi-factor Protected
                        </p>
                      </div>

                      <div className="bg-slate-50/60 p-4 border border-slate-100 rounded-xl space-y-1">
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                          Authentication Node
                        </span>
                        <p className="text-sm font-semibold text-slate-800">Clerk Federated Engine</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeSection === 'assessment' && (
            <motion.div
              key="assessment"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {!assessment ? (
                <Card className="text-center p-12 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                    <ClipboardList className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">No Assessment Record Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      You haven't completed a career assessment quiz yet. Take a simulated Gemin-powered quiz to map your proficiency.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => navigate('/career-test')}
                    className="font-bold shadow-md shadow-primary/10"
                  >
                    Take Competency Test
                  </Button>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="border-b border-slate-50">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl font-bold">Assessment Insight Summary</CardTitle>
                        <CardDescription>
                          Evaluated in {domains.find((d) => d.id === assessment.domain)?.name || assessment.domain}
                        </CardDescription>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-extrabold border capitalize self-start sm:self-center ${levelBadgeStyles[assessment.level] || levelBadgeStyles.beginner}`}>
                        {assessment.level} Proficiency
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="flex flex-col items-center">
                        <ScoreRing percentage={assessment.percentage} />
                        <span className="text-xs text-slate-400 font-bold mt-2">
                          Score: {assessment.totalScore} / {assessment.maxPossibleScore}
                        </span>
                      </div>
                      
                      <div className="flex-1 w-full space-y-6">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                            Expert Feedback
                          </h4>
                          <p className="text-slate-700 text-sm leading-relaxed font-medium">
                            {assessment.recommendation || levelDescriptions[assessment.level]}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                          <div>
                            <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <CheckCircle className="w-4 h-4" /> Strong Competencies
                            </h4>
                            <ul className="space-y-1.5">
                              {assessment.strengths?.map((s, i) => (
                                <li key={i} className="text-slate-600 text-xs font-semibold flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />
                                  <span>{s}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-xs font-extrabold text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4" /> Recommended Actions
                            </h4>
                            <ol className="space-y-1.5">
                              {assessment.next_steps?.map((ns, i) => (
                                <li key={i} className="text-slate-600 text-xs font-semibold flex items-start gap-2">
                                  <span className="text-indigo-500 font-bold shrink-0">{i + 1}.</span>
                                  <span>{ns}</span>
                                </li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex flex-wrap gap-3 justify-end">
                      <Button
                        variant="outline"
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                        onClick={() => navigate('/career-test')}
                        className="font-semibold"
                      >
                        Retake Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {activeSection === 'roadmaps' && (
            <motion.div
              key="roadmaps"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Roadmaps</h2>
                  <p className="text-xs text-slate-500 font-medium">Curriculums generated by AI</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => navigate('/roadmap-generator')}
                  className="font-bold shadow-md shadow-primary/10"
                >
                  Create New
                </Button>
              </div>

              {roadmapHistory.length === 0 ? (
                <Card className="text-center p-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                    <Map className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No Roadmaps Generated</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-normal">
                      Use our high-precision generator to structure custom syllabi outlining your path forward.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => navigate('/roadmap-generator')}>
                    Generate Custom Roadmap
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {roadmapHistory.map((item) => (
                    <Card key={item._id} className="overflow-hidden">
                      <div
                        onClick={() =>
                          setExpandedRoadmapId(expandedRoadmapId === item._id ? null : item._id)
                        }
                        className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition-colors select-none"
                      >
                        <div className="flex items-center space-x-3.5 min-w-0 pr-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Map className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 truncate leading-snug">
                              {item.prompt}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={(e) => handleDeleteRoadmap(item._id, e)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-colors cursor-pointer"
                            title="Delete roadmap"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="text-slate-400">
                            {expandedRoadmapId === item._id ? (
                              <ChevronDown className="w-5 h-5 transform rotate-180 transition-transform" />
                            ) : (
                              <ChevronDown className="w-5 h-5 transition-transform" />
                            )}
                          </div>
                        </div>
                      </div>
                      <AnimatePresence>
                        {expandedRoadmapId === item._id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className="border-t border-slate-100 bg-slate-50/20"
                          >
                            <div className="p-6 prose prose-slate prose-indigo max-w-none text-slate-600 prose-headings:text-slate-900 prose-a:text-primary leading-relaxed text-sm">
                              <ReactMarkdown>{item.roadmap}</ReactMarkdown>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Saved Careers</h2>
                <p className="text-xs text-slate-500 font-medium">Bookmarked professional tracks</p>
              </div>

              {savedPathways.length === 0 ? (
                <Card className="text-center p-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                    <BookmarkCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">No Saved Careers</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-normal">
                      Browse available pathways and click the bookmark action to gather listings here.
                    </p>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => navigate('/pathways')}>
                    Explore Careers Pathways
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedPathways.map((p) => (
                    <Card key={p.id} hover className="flex flex-col justify-between">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {p.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">+{p.growth}% growth</span>
                        </div>
                        <CardTitle className="text-base mt-2">{p.title}</CardTitle>
                        <CardDescription className="text-xs font-bold text-primary">{p.salary}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-slate-500 line-clamp-3 leading-normal">{p.description}</p>
                      </CardContent>
                      <CardFooter className="pt-4 flex justify-between items-center bg-slate-50/40 border-t border-slate-50/80 rounded-b-2xl">
                        <button
                          onClick={() => navigate(`/pathways/${p.id}`)}
                          className="text-xs font-bold text-slate-700 hover:text-primary inline-flex items-center gap-1"
                        >
                          View Details <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

const DashboardLoader = () => (
  <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-[#f8fafc]">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mx-auto"></div>
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Syncing Dashboard</h2>
        <p className="text-xs text-slate-400">Structuring your workspace parameters...</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => (
  <>
    <SignedIn>
      <Suspense fallback={<DashboardLoader />}>
        <DashboardContent />
      </Suspense>
    </SignedIn>
    <SignedOut>
      <RedirectToSignIn />
    </SignedOut>
  </>
);

export default Dashboard;
