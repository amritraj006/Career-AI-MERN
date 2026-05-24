import {
  useUser,
  UserButton,
  useClerk,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from '@clerk/clerk-react';
import { useState, useEffect, Suspense, useMemo } from 'react';
import {
  User,
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
  LayoutDashboard,
  Trash2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import apiService from '../services/apiService';
import { pathways } from '../assets/pathwaysData';
import { domains, levelBadgeStyles } from '../utils/constants';
import { getSavedCareers } from '../utils/savedCareers';

const DashboardContent = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

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
        label: `Generated roadmap: ${r.prompt?.slice(0, 60)}${r.prompt?.length > 60 ? '…' : ''}`,
        date: r.created_at,
      });
    });
    return items.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [assessment, roadmapHistory]);

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

  const handleDeleteRoadmap = async (id) => {
    try {
      const res = await apiService.deleteRoadmapHistory(id);
      if (res.success) {
        setRoadmapHistory((prev) => prev.filter((r) => r._id !== id));
        if (expandedRoadmapId === id) setExpandedRoadmapId(null);
        toast.success('Roadmap deleted');
      }
    } catch {
      toast.error('Failed to delete roadmap');
    }
  };

  const sidebarItems = [
    { id: 'overview', icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
    { id: 'assessment', icon: <ClipboardList className="w-5 h-5" />, label: 'My Assessment' },
    { id: 'roadmaps', icon: <Map className="w-5 h-5" />, label: 'Saved Roadmaps' },
    { id: 'saved', icon: <Bookmark className="w-5 h-5" />, label: 'Saved Careers' },
  ];

  const stats = [
    { label: 'Roadmaps Generated', value: roadmapHistory.length, icon: <Map className="w-5 h-5 text-primary" /> },
    { label: 'Assessment Taken', value: assessment ? 1 : 0, icon: <ClipboardList className="w-5 h-5 text-primary" /> },
    { label: 'Saved Careers', value: savedCareerIds.length, icon: <Bookmark className="w-5 h-5 text-primary" /> },
    { label: 'Days Active', value: daysActive, icon: <Clock className="w-5 h-5 text-primary" /> },
  ];

  const ScoreRing = ({ percentage }) => {
    const r = 54;
    const circ = 2 * Math.PI * r;
    const offset = circ - (percentage / 100) * circ;
    return (
      <div className="relative">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="#F84565"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      <aside className="w-72 bg-white shadow-lg flex flex-col border-r border-gray-200 shrink-0">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </div>
            <span className="text-xl font-medium text-gray-900">CareerAI</span>
          </Link>
        </div>

        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center min-w-0">
            <img
              src={user.imageUrl}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow-sm"
            />
            <div className="ml-3 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{email}</p>
            </div>
          </div>
          <UserButton appearance={{ elements: { userButtonAvatarBox: 'w-8 h-8' } }} />
        </div>

        <nav className="flex flex-col p-4 space-y-1 flex-grow overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg transition-all ${
                activeSection === item.id
                  ? 'bg-rose-50 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {activeSection === item.id ? (
                <ChevronDown className="w-5 h-5 text-primary" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut(() => navigate('/'))}
            className="flex items-center w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5 mr-3 text-primary" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {loadingData && activeSection !== 'profile' && activeSection !== 'saved' ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {activeSection === 'overview' && (
              <section className="space-y-8 fade-in">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user.firstName}!</h2>
                  <p className="text-gray-500 mt-1">Here&apos;s your career journey at a glance</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((s) => (
                    <div key={s.label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-rose-50 rounded-lg">{s.icon}</div>
                        <BarChart2 className="w-4 h-4 text-gray-300" />
                      </div>
                      <p className="text-3xl font-bold text-gray-900">{s.value}</p>
                      <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Recent Activity
                  </h3>
                  {recentActivity.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No activity yet. Take a career test or generate a roadmap to get started!
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {recentActivity.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm border-b border-gray-50 pb-3 last:border-0">
                          <Award className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-gray-800">{item.label}</p>
                            {item.date && (
                              <p className="text-gray-400 text-xs mt-0.5">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            )}

            {activeSection === 'profile' && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200 fade-in">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 w-full lg:w-1/3 text-center">
                    <img
                      src={user.imageUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto mb-6"
                    />
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">{email}</p>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900">Personal Dashboard</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center mb-4">
                          <User className="w-5 h-5 text-primary mr-3" />
                          <h3 className="font-semibold">Account Details</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Email</p>
                        <p className="font-medium">{email}</p>
                        <p className="text-xs text-gray-500 mb-1 mt-4">Username</p>
                        <p className="font-medium">{user.username || 'Not set'}</p>
                      </div>
                      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="flex items-center mb-4">
                          <CheckCircle className="w-5 h-5 text-primary mr-3" />
                          <h3 className="font-semibold">Membership</h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-1">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-500 mb-1 mt-4">Status</p>
                        <p className="font-medium flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {activeSection === 'assessment' && (
              <section className="fade-in">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">My Assessment</h2>
                {!assessment ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">You haven&apos;t taken a career assessment yet.</p>
                    <button
                      onClick={() => navigate('/career-test')}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dull transition-colors"
                    >
                      Take Career Test
                    </button>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="flex flex-col items-center">
                        <ScoreRing percentage={assessment.percentage} />
                        <span
                          className={`mt-4 px-4 py-1.5 rounded-full text-sm font-semibold border capitalize ${
                            levelBadgeStyles[assessment.level] || levelBadgeStyles.beginner
                          }`}
                        >
                          {assessment.level}
                        </span>
                      </div>
                      <div className="flex-1 w-full">
                        <h3 className="text-xl font-bold mb-1">
                          {domains.find((d) => d.id === assessment.domain)?.name || assessment.domain}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                          Score: {assessment.totalScore}/{assessment.maxPossibleScore}
                        </p>
                        <div className="mb-6">
                          <h4 className="font-semibold mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {assessment.strengths?.map((s, i) => (
                              <li key={i} className="text-green-600 text-sm">
                                • {s}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mb-6">
                          <h4 className="font-semibold mb-2">Next Steps</h4>
                          <ol className="space-y-1">
                            {assessment.next_steps?.map((ns, i) => (
                              <li key={i} className="text-blue-600 text-sm">
                                {i + 1}. {ns}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <button
                          onClick={() => navigate('/career-test')}
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary-dull transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Retake Assessment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {activeSection === 'roadmaps' && (
              <section className="fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">Saved Roadmaps</h2>
                  <button
                    onClick={() => navigate('/roadmap-generator')}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Generate new →
                  </button>
                </div>
                {roadmapHistory.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">No roadmaps generated yet.</p>
                    <button
                      onClick={() => navigate('/roadmap-generator')}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-medium"
                    >
                      Create Roadmap
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {roadmapHistory.map((item) => (
                      <div
                        key={item._id}
                        className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm"
                      >
                        <div className="flex items-center justify-between p-5">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedRoadmapId(expandedRoadmapId === item._id ? null : item._id)
                            }
                            className="flex-1 text-left"
                          >
                            <p className="font-semibold text-gray-900">{item.prompt}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </button>
                          <button
                            onClick={() => handleDeleteRoadmap(item._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        {expandedRoadmapId === item._id && (
                          <div className="px-5 pb-5 border-t border-gray-100 pt-4 prose prose-sm max-w-none">
                            <ReactMarkdown>{item.roadmap}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeSection === 'saved' && (
              <section className="fade-in">
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Saved Careers</h2>
                {savedPathways.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                    <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-6">
                      Bookmark careers from pathway cards to see them here.
                    </p>
                    <button
                      onClick={() => navigate('/pathways')}
                      className="px-6 py-3 bg-primary text-white rounded-xl font-medium"
                    >
                      Browse Pathways
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedPathways.map((p) => (
                      <div
                        key={p.id}
                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                      >
                        <h3 className="font-bold text-lg mb-2">{p.title}</h3>
                        <p className="text-sm text-primary font-medium mb-4">{p.salary}</p>
                        <button
                          onClick={() => navigate(`/pathways/${p.id}`)}
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                        >
                          View details <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

const DashboardLoader = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Dashboard</h2>
      <p className="text-gray-500">Preparing your learning experience</p>
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
