import React, { useMemo, useRef, useState } from 'react';
import {
  BarChart2,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  GraduationCap,
  LineChart,
  Lock,
  Mail,
  Map as MapIcon,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import apiService from '../services/apiService';

const baseCareers = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    salaryUSD: 132000,
    education: "Bachelor's, bootcamp, or strong portfolio",
    growthRate: 17,
    workLife: 'Good',
    workLifeScore: 4,
    timeToEntryMonths: 14,
    remoteScore: 5,
    stabilityScore: 4,
    description: 'Builds, tests, and maintains web, mobile, or platform software.',
    bestFor: 'People who enjoy building products, solving logic problems, and learning continuously.',
    skills: ['JavaScript', 'React', 'Node.js', 'System design', 'Git'],
    tools: ['VS Code', 'GitHub', 'CI/CD', 'Cloud platforms'],
    tradeoffs: ['Interview prep can be intense', 'Fast-moving tools require steady learning'],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    salaryUSD: 124000,
    education: "Master's preferred, portfolio can help",
    growthRate: 36,
    workLife: 'Good',
    workLifeScore: 4,
    timeToEntryMonths: 20,
    remoteScore: 4,
    stabilityScore: 4,
    description: 'Turns raw data into models, experiments, forecasts, and decisions.',
    bestFor: 'Analytical thinkers who like statistics, storytelling, and business context.',
    skills: ['Python', 'SQL', 'Statistics', 'Machine learning', 'Visualization'],
    tools: ['Jupyter', 'Pandas', 'scikit-learn', 'Tableau'],
    tradeoffs: ['Requires math depth', 'Business impact can matter as much as modeling'],
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    salaryUSD: 98000,
    education: "Bachelor's or design portfolio",
    growthRate: 16,
    workLife: 'Excellent',
    workLifeScore: 5,
    timeToEntryMonths: 10,
    remoteScore: 4,
    stabilityScore: 3,
    description: 'Researches users and designs clear, usable digital experiences.',
    bestFor: 'Creative problem solvers who like psychology, visual systems, and collaboration.',
    skills: ['Figma', 'User research', 'Wireframing', 'Prototyping', 'Usability testing'],
    tools: ['Figma', 'Maze', 'Miro', 'Design systems'],
    tradeoffs: ['Portfolio quality matters heavily', 'Subjective feedback is part of the work'],
  },
  {
    id: 'cloud-architect',
    title: 'Cloud Architect',
    salaryUSD: 152000,
    education: "Bachelor's plus cloud certifications",
    growthRate: 25,
    workLife: 'Moderate',
    workLifeScore: 3,
    timeToEntryMonths: 30,
    remoteScore: 4,
    stabilityScore: 5,
    description: 'Designs secure, scalable infrastructure across cloud environments.',
    bestFor: 'Engineers who like architecture, reliability, security, and cross-team decisions.',
    skills: ['AWS', 'Azure', 'Networking', 'Terraform', 'Security'],
    tools: ['AWS', 'Kubernetes', 'Terraform', 'Monitoring stacks'],
    tradeoffs: ['Usually needs prior engineering experience', 'High responsibility during outages'],
  },
  {
    id: 'cybersecurity-analyst',
    title: 'Cybersecurity Analyst',
    salaryUSD: 112000,
    education: "Bachelor's or certifications",
    growthRate: 32,
    workLife: 'Good',
    workLifeScore: 4,
    timeToEntryMonths: 16,
    remoteScore: 3,
    stabilityScore: 5,
    description: 'Protects systems by monitoring threats, hardening controls, and responding to incidents.',
    bestFor: 'Detail-oriented people who like investigation, risk, and defensive strategy.',
    skills: ['Network security', 'SIEM', 'Linux', 'Threat analysis', 'Scripting'],
    tools: ['Splunk', 'Wireshark', 'Burp Suite', 'Nmap'],
    tradeoffs: ['Some roles include on-call work', 'Threat landscape changes constantly'],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    salaryUSD: 138000,
    education: "Bachelor's, MBA helpful but not required",
    growthRate: 21,
    workLife: 'Moderate',
    workLifeScore: 3,
    timeToEntryMonths: 18,
    remoteScore: 4,
    stabilityScore: 4,
    description: 'Defines product strategy, prioritizes roadmaps, and aligns teams around user outcomes.',
    bestFor: 'Generalists who like customer problems, strategy, communication, and tradeoff calls.',
    skills: ['Roadmapping', 'Analytics', 'User research', 'Stakeholder management', 'Agile'],
    tools: ['Jira', 'Amplitude', 'Notion', 'Figma'],
    tradeoffs: ['High context switching', 'Influence without authority can be demanding'],
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    salaryUSD: 158000,
    education: "Bachelor's or Master's with strong projects",
    growthRate: 38,
    workLife: 'Challenging',
    workLifeScore: 2,
    timeToEntryMonths: 24,
    remoteScore: 4,
    stabilityScore: 4,
    description: 'Builds AI features, model pipelines, retrieval systems, and evaluation workflows.',
    bestFor: 'Builders who enjoy software engineering, experiments, math, and product ambiguity.',
    skills: ['Python', 'LLMs', 'RAG', 'Evaluation', 'MLOps'],
    tools: ['PyTorch', 'LangChain', 'Vector databases', 'FastAPI'],
    tradeoffs: ['Field changes quickly', 'Strong fundamentals matter more than tool chasing'],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    salaryUSD: 126000,
    education: "Bachelor's or operations portfolio",
    growthRate: 28,
    workLife: 'Moderate',
    workLifeScore: 3,
    timeToEntryMonths: 18,
    remoteScore: 4,
    stabilityScore: 5,
    description: 'Automates deployment, reliability, monitoring, and developer infrastructure.',
    bestFor: 'Systems-minded builders who like automation, debugging, and reliability.',
    skills: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Scripting'],
    tools: ['GitHub Actions', 'Docker', 'Prometheus', 'Terraform'],
    tradeoffs: ['Incident response can interrupt schedules', 'Requires breadth across systems'],
  },
  {
    id: 'business-analyst',
    title: 'Business Analyst',
    salaryUSD: 92000,
    education: "Bachelor's or domain experience",
    growthRate: 14,
    workLife: 'Good',
    workLifeScore: 4,
    timeToEntryMonths: 8,
    remoteScore: 3,
    stabilityScore: 4,
    description: 'Connects business needs with data, process improvements, and technical delivery.',
    bestFor: 'Communicators who like structured thinking, requirements, and measurable improvements.',
    skills: ['SQL', 'Excel', 'Process mapping', 'Requirements', 'Dashboards'],
    tools: ['Excel', 'Power BI', 'Jira', 'SQL clients'],
    tradeoffs: ['Can involve many meetings', 'Impact depends on stakeholder access'],
  },
  {
    id: 'digital-marketer',
    title: 'Digital Marketer',
    salaryUSD: 86000,
    education: "Bachelor's or proven campaign results",
    growthRate: 18,
    workLife: 'Good',
    workLifeScore: 4,
    timeToEntryMonths: 7,
    remoteScore: 4,
    stabilityScore: 3,
    description: 'Grows audiences and revenue through content, SEO, paid ads, and analytics.',
    bestFor: 'Creative operators who enjoy experiments, messaging, and measurable campaigns.',
    skills: ['SEO', 'Content strategy', 'Analytics', 'Paid ads', 'Copywriting'],
    tools: ['GA4', 'Search Console', 'HubSpot', 'Meta Ads'],
    tradeoffs: ['Results can fluctuate with platforms', 'Needs both creative and analytical muscles'],
  },
];

const priorityOptions = [
  { key: 'salary', label: 'Income', icon: DollarSign },
  { key: 'growth', label: 'Growth', icon: TrendingUp },
  { key: 'balance', label: 'Balance', icon: Clock },
  { key: 'entry', label: 'Fast entry', icon: GraduationCap },
  { key: 'remote', label: 'Remote', icon: Briefcase },
  { key: 'stability', label: 'Stability', icon: ShieldCheck },
];

const defaultPriorities = {
  salary: 4,
  growth: 4,
  balance: 3,
  entry: 2,
  remote: 3,
  stability: 3,
};

const emptyCustomCareer = {
  title: '',
  salaryUSD: '',
  growthRate: '',
  education: '',
  workLife: 'Good',
  timeToEntryMonths: '',
  remoteScore: 3,
  stabilityScore: 3,
  skills: '',
};

const formatCurrency = (value) => `$${Math.round(Number(value || 0) / 1000)}k`;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeRange = (value, min, max) => {
  const normalized = ((Number(value) - min) / (max - min)) * 5;
  return clamp(normalized, 1, 5);
};

const inverseRange = (value, min, max) => {
  const normalized = 5 - ((Number(value) - min) / (max - min)) * 4;
  return clamp(normalized, 1, 5);
};

const getCareerScore = (career, priorities) => {
  const factors = {
    salary: normalizeRange(career.salaryUSD, 70000, 165000),
    growth: normalizeRange(career.growthRate, 8, 42),
    balance: career.workLifeScore || 3,
    entry: inverseRange(career.timeToEntryMonths, 6, 36),
    remote: career.remoteScore || 3,
    stability: career.stabilityScore || 3,
  };

  const totalWeight = Object.values(priorities).reduce((sum, value) => sum + Number(value), 0);
  const weightedScore = Object.entries(priorities).reduce(
    (sum, [key, weight]) => sum + factors[key] * Number(weight),
    0
  );

  return Math.round((weightedScore / (totalWeight * 5)) * 100);
};

const getWorkLifeScore = (label) => {
  const scores = {
    Excellent: 5,
    Good: 4,
    Moderate: 3,
    Challenging: 2,
  };
  return scores[label] || 3;
};

const getBadgeClass = (label) => {
  if (label === 'Excellent') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (label === 'Good') return 'bg-blue-50 text-blue-700 border-blue-200';
  if (label === 'Moderate') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};

const getScoreColor = (score) => {
  if (score >= 82) return 'bg-emerald-500';
  if (score >= 68) return 'bg-blue-500';
  if (score >= 54) return 'bg-amber-500';
  return 'bg-rose-500';
};

const ComparisonToolPage = () => {
  const { user } = useUser();
  const pdfRef = useRef(null);

  const [careerLibrary, setCareerLibrary] = useState(baseCareers);
  const [selectedCareers, setSelectedCareers] = useState([baseCareers[0], baseCareers[1]]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorities, setPriorities] = useState(defaultPriorities);
  const [profile, setProfile] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customCareer, setCustomCareer] = useState(emptyCustomCareer);
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const scoredCareers = useMemo(
    () =>
      selectedCareers
        .map((career) => ({
          ...career,
          salaryLabel: formatCurrency(career.salaryUSD),
          fitScore: getCareerScore(career, priorities),
        }))
        .sort((a, b) => b.fitScore - a.fitScore),
    [selectedCareers, priorities]
  );

  const topCareer = scoredCareers[0];

  const filteredCareers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return careerLibrary
      .filter((career) => !selectedCareers.some((selected) => selected.id === career.id))
      .filter((career) => {
        if (!term) return true;
        return [career.title, career.description, career.skills.join(' ')]
          .join(' ')
          .toLowerCase()
          .includes(term);
      });
  }, [careerLibrary, searchTerm, selectedCareers]);

  const comparisonMetrics = [
    {
      label: 'Estimated salary',
      key: 'salaryUSD',
      icon: DollarSign,
      render: (career) => formatCurrency(career.salaryUSD),
    },
    {
      label: 'Projected growth',
      key: 'growthRate',
      icon: LineChart,
      render: (career) => `${career.growthRate}%`,
    },
    {
      label: 'Time to entry',
      key: 'timeToEntryMonths',
      icon: Clock,
      render: (career) => `${career.timeToEntryMonths} months`,
    },
    {
      label: 'Work-life',
      key: 'workLife',
      icon: ShieldCheck,
      render: (career) => (
        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBadgeClass(career.workLife)}`}>
          {career.workLife}
        </span>
      ),
    },
    {
      label: 'Education',
      key: 'education',
      icon: BookOpen,
      render: (career) => career.education,
    },
    {
      label: 'Top skills',
      key: 'skills',
      icon: Target,
      render: (career) => (
        <div className="flex flex-wrap justify-center gap-2">
          {career.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
              {skill}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const addCareer = (career) => {
    if (selectedCareers.some((selected) => selected.id === career.id)) return;
    if (selectedCareers.length >= 4) {
      toast.error('You can compare up to 4 careers at once');
      return;
    }

    setSelectedCareers((current) => [...current, career]);
    setShowDropdown(false);
    setSearchTerm('');
    setAiInsights(null);
    toast.success(`${career.title} added`);
  };

  const removeCareer = (id) => {
    if (selectedCareers.length <= 2) {
      toast.error('Keep at least 2 careers in the comparison');
      return;
    }

    const career = selectedCareers.find((item) => item.id === id);
    setSelectedCareers((current) => current.filter((item) => item.id !== id));
    setAiInsights(null);
    toast.info(`${career?.title || 'Career'} removed`);
  };

  const handlePriorityChange = (key, value) => {
    setPriorities((current) => ({ ...current, [key]: Number(value) }));
    setAiInsights(null);
  };

  const resetComparison = () => {
    setSelectedCareers([baseCareers[0], baseCareers[1]]);
    setPriorities(defaultPriorities);
    setProfile('');
    setAiInsights(null);
    setAiError('');
    setSearchTerm('');
    toast.success('Comparison reset');
  };

  const handleCustomCareerChange = (key, value) => {
    setCustomCareer((current) => ({ ...current, [key]: value }));
  };

  const addCustomCareer = () => {
    const title = customCareer.title.trim();
    const salaryUSD = Number(customCareer.salaryUSD);
    const growthRate = Number(customCareer.growthRate);
    const timeToEntryMonths = Number(customCareer.timeToEntryMonths);
    const skills = customCareer.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 6);

    if (!title || !Number.isFinite(salaryUSD) || !Number.isFinite(growthRate) || !Number.isFinite(timeToEntryMonths)) {
      toast.error('Add a title, salary, growth, and entry timeline');
      return;
    }

    const newCareer = {
      id: `custom-${Date.now()}`,
      title,
      salaryUSD,
      education: customCareer.education.trim() || 'Flexible path',
      growthRate,
      workLife: customCareer.workLife,
      workLifeScore: getWorkLifeScore(customCareer.workLife),
      timeToEntryMonths,
      remoteScore: Number(customCareer.remoteScore),
      stabilityScore: Number(customCareer.stabilityScore),
      description: 'Custom career added to this comparison.',
      bestFor: 'Use this entry to compare a role that is not in the default library.',
      skills: skills.length ? skills : ['Role research', 'Portfolio', 'Networking'],
      tools: [],
      tradeoffs: ['Validate these numbers with current job postings and trusted labor reports'],
    };

    setCareerLibrary((current) => [newCareer, ...current]);
    setSelectedCareers((current) => [...current.slice(0, 3), newCareer]);
    setCustomCareer(emptyCustomCareer);
    setShowCustomForm(false);
    setShowDropdown(false);
    setAiInsights(null);
    toast.success(`${title} added`);
  };

  const handleGenerateAiInsights = async () => {
    if (selectedCareers.length < 2) {
      toast.error('Select at least 2 careers first');
      return;
    }

    setAiLoading(true);
    setAiError('');

    try {
      const response = await apiService.generateComparisonInsights({
        careers: scoredCareers,
        preferences: priorities,
        profile,
      });

      setAiInsights(response.insights);
      toast.success('AI verdict generated');
    } catch (error) {
      const message = error?.response?.data?.message || 'AI coach is unavailable right now.';
      setAiError(message);
      toast.error('Could not generate AI verdict');
    } finally {
      setAiLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (!pdfRef.current) return;
      toast.loading('Generating PDF report...');

      const dataUrl = await htmlToImage.toPng(pdfRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, Math.min(pdfHeight, pdf.internal.pageSize.getHeight()));
      pdf.save('career-comparison-report.pdf');

      toast.dismiss();
      toast.success('PDF report generated');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF report');
    }
  };

  const handleSendEmail = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!pdfRef.current || !email) {
        toast.error('Missing comparison content or user email');
        return;
      }

      toast.loading('Preparing comparison image...');

      const dataUrl = await htmlToImage.toPng(pdfRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const imageBlob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append('image', imageBlob, 'career-comparison.png');
      formData.append('email', email);

      toast.dismiss();
      toast.loading('Sending report to your email...');

      await apiService.sendComparisonImage(formData);

      toast.dismiss();
      toast.success('Comparison sent to your email');
    } catch (error) {
      console.error('Error sending comparison image:', error);
      toast.dismiss();
      toast.error('Failed to send comparison via email');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 text-slate-950">
      <main className="container mx-auto px-4 sm:px-6">
        <section className="mb-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-semibold text-primary">
                  <BarChart2 className="h-4 w-4" />
                  Career comparison
                </div>
                <h1 className="text-3xl font-bold text-slate-950 md:text-4xl">Compare paths by fit, not guesswork</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                  Rank careers against your priorities, add missing roles, and ask the AI coach for a focused verdict.
                </p>
              </div>

              <button
                onClick={resetComparison}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="flex flex-wrap gap-3">
              {selectedCareers.map((career) => (
                <div key={career.id} className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                  <span className="text-sm font-semibold text-slate-800">{career.title}</span>
                  <button
                    onClick={() => removeCareer(career.id)}
                    className="rounded-full p-1 text-slate-400 transition hover:bg-white hover:text-rose-600"
                    aria-label={`Remove ${career.title}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="relative">
                <button
                  onClick={() => setShowDropdown((current) => !current)}
                  disabled={selectedCareers.length >= 4}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dull disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus className="h-4 w-4" />
                  Add career
                  <ChevronDown className={`h-4 w-4 transition ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute left-0 top-full z-40 mt-2 w-[420px] max-w-[92vw] rounded-lg border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search role or skill"
                          value={searchTerm}
                          onChange={(event) => setSearchTerm(event.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
                          autoFocus
                        />
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto p-2">
                      {filteredCareers.map((career) => (
                        <button
                          key={career.id}
                          onClick={() => addCareer(career)}
                          className="w-full rounded-lg px-3 py-3 text-left transition hover:bg-slate-50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-slate-900">{career.title}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-500">
                                {formatCurrency(career.salaryUSD)} salary estimate · {career.growthRate}% growth
                              </p>
                            </div>
                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              Add
                            </span>
                          </div>
                        </button>
                      ))}

                      {filteredCareers.length === 0 && (
                        <p className="px-3 py-6 text-center text-sm text-slate-500">No matching careers found.</p>
                      )}
                    </div>

                    <div className="border-t border-slate-100 p-3">
                      <button
                        onClick={() => setShowCustomForm((current) => !current)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Plus className="h-4 w-4" />
                        Add custom role
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-500">Current best match</p>
                <h2 className="mt-1 text-2xl font-bold text-slate-950">{topCareer?.title}</h2>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-xl font-bold text-emerald-700">
                {topCareer?.fitScore || 0}
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-600">{topCareer?.bestFor}</p>
            <div className="mt-5 space-y-3">
              {scoredCareers.map((career) => (
                <div key={career.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{career.title}</span>
                    <span className="font-bold text-slate-950">{career.fitScore}% fit</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${getScoreColor(career.fitScore)}`} style={{ width: `${career.fitScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {showCustomForm && (
          <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-950">Custom career</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <input
                value={customCareer.title}
                onChange={(event) => handleCustomCareerChange('title', event.target.value)}
                placeholder="Career title"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="number"
                value={customCareer.salaryUSD}
                onChange={(event) => handleCustomCareerChange('salaryUSD', event.target.value)}
                placeholder="Annual salary"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="number"
                value={customCareer.growthRate}
                onChange={(event) => handleCustomCareerChange('growthRate', event.target.value)}
                placeholder="Growth percent"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="number"
                value={customCareer.timeToEntryMonths}
                onChange={(event) => handleCustomCareerChange('timeToEntryMonths', event.target.value)}
                placeholder="Months to entry"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                value={customCareer.education}
                onChange={(event) => handleCustomCareerChange('education', event.target.value)}
                placeholder="Education path"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
              />
              <input
                value={customCareer.skills}
                onChange={(event) => handleCustomCareerChange('skills', event.target.value)}
                placeholder="Skills, comma separated"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 md:col-span-2"
              />
              <select
                value={customCareer.workLife}
                onChange={(event) => handleCustomCareerChange('workLife', event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option>Excellent</option>
                <option>Good</option>
                <option>Moderate</option>
                <option>Challenging</option>
              </select>
              <input
                type="number"
                min="1"
                max="5"
                value={customCareer.remoteScore}
                onChange={(event) => handleCustomCareerChange('remoteScore', event.target.value)}
                placeholder="Remote score 1-5"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <input
                type="number"
                min="1"
                max="5"
                value={customCareer.stabilityScore}
                onChange={(event) => handleCustomCareerChange('stabilityScore', event.target.value)}
                placeholder="Stability score 1-5"
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                onClick={addCustomCareer}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                <CheckCircle2 className="h-4 w-4" />
                Add to comparison
              </button>
            </div>
          </section>
        )}

        <section className="mb-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold text-slate-950">Priorities</h2>
            </div>

            <div className="space-y-5">
              {priorityOptions.map((option) => (
                <label key={option.key} className="block">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      {React.createElement(option.icon, { className: 'h-4 w-4 text-slate-400' })}
                      {option.label}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                      {priorities[option.key]}/5
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={priorities[option.key]}
                    onChange={(event) => handlePriorityChange(option.key, event.target.value)}
                    className="h-2 w-full cursor-pointer accent-primary"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold text-slate-950">AI coach verdict</h2>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  Add your background, interests, constraints, or target country to personalize the recommendation.
                </p>
              </div>
              <button
                onClick={handleGenerateAiInsights}
                disabled={aiLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dull disabled:cursor-wait disabled:opacity-70"
              >
                <Sparkles className="h-4 w-4" />
                {aiLoading ? 'Thinking...' : 'Generate verdict'}
              </button>
            </div>

            <textarea
              value={profile}
              onChange={(event) => {
                setProfile(event.target.value);
                setAiInsights(null);
              }}
              rows="4"
              placeholder="Example: I know React and SQL, prefer remote work, want strong salary growth, and can study 8 hours per week."
              className="mb-4 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium leading-6 text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
            />

            {aiError && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800">
                {aiError}
              </div>
            )}

            {aiInsights ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <p className="font-bold text-slate-950">{aiInsights.recommendedCareer}</p>
                </div>
                <p className="text-sm leading-6 text-slate-700">{aiInsights.verdict}</p>
                {aiInsights.bestFitReason && (
                  <p className="mt-3 text-sm leading-6 text-slate-600">{aiInsights.bestFitReason}</p>
                )}
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-bold text-slate-900">Skill gaps</p>
                    <ul className="space-y-2">
                      {(aiInsights.skillGaps || []).slice(0, 4).map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-bold text-slate-900">Next moves</p>
                    <ul className="space-y-2">
                      {(aiInsights.nextSteps || []).slice(0, 4).map((item) => (
                        <li key={item} className="flex gap-2 text-sm text-slate-600">
                          <MapIcon className="mt-0.5 h-4 w-4 flex-none text-blue-500" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <div className="flex gap-3">
                  <UserRound className="mt-0.5 h-5 w-5 flex-none text-slate-400" />
                  <p className="text-sm leading-6 text-slate-600">
                    Local scoring is already active. The AI verdict adds a plain-language recommendation, risks, skill gaps, and next moves.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        <section ref={pdfRef} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Comparison report</h2>
              <p className="mt-1 text-sm text-slate-500">Generated from selected careers and current priority weights.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {priorityOptions.map(({ key, label }) => (
                <span key={key} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {label}: {priorities[key]}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {scoredCareers.map((career, index) => (
              <article key={career.id} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-slate-400">Rank {index + 1}</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-950">{career.title}</h3>
                  </div>
                  <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-bold text-white">{career.fitScore}%</span>
                </div>
                <p className="text-sm leading-6 text-slate-600">{career.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-500">Salary</p>
                    <p className="mt-1 font-bold text-slate-950">{formatCurrency(career.salaryUSD)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-500">Growth</p>
                    <p className="mt-1 font-bold text-slate-950">{career.growthRate}%</p>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-60 border-b border-slate-200 p-4 text-sm font-bold text-slate-600">Metric</th>
                  {scoredCareers.map((career) => (
                    <th key={career.id} className="border-b border-l border-slate-200 p-4 text-center text-sm font-bold text-slate-950">
                      {career.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonMetrics.map((metric) => (
                  <tr key={metric.key} className="border-b border-slate-100 last:border-b-0">
                    <td className="p-4 align-top">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        {React.createElement(metric.icon, { className: 'h-4 w-4 text-slate-400' })}
                        {metric.label}
                      </div>
                    </td>
                    {scoredCareers.map((career) => (
                      <td key={`${metric.key}-${career.id}`} className="border-l border-slate-100 p-4 text-center text-sm font-medium text-slate-700">
                        {metric.render(career)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                <h3 className="font-bold">Best fit</h3>
              </div>
              <p className="text-sm leading-6 text-emerald-900">{topCareer?.title} leads with a {topCareer?.fitScore}% weighted fit score.</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                <h3 className="font-bold">Fastest growth</h3>
              </div>
              <p className="text-sm leading-6 text-blue-900">
                {scoredCareers.reduce((best, career) => (career.growthRate > best.growthRate ? career : best), scoredCareers[0]).title} has the highest projected growth in this set.
              </p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="mb-2 flex items-center gap-2 text-amber-700">
                <Clock className="h-5 w-5" />
                <h3 className="font-bold">Fastest entry</h3>
              </div>
              <p className="text-sm leading-6 text-amber-900">
                {scoredCareers.reduce((best, career) => (career.timeToEntryMonths < best.timeToEntryMonths ? career : best), scoredCareers[0]).title} has the shortest estimated entry timeline.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50"
          >
            <Download className="h-5 w-5 text-slate-500" />
            Export PDF
          </button>

          {user ? (
            <button
              onClick={handleSendEmail}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dull"
            >
              <Mail className="h-5 w-5" />
              Send to email
            </button>
          ) : (
            <button
              onClick={() =>
                window.Clerk?.openSignIn({
                  afterSignInUrl: window.location.href,
                  redirectUrl: window.location.href,
                })
              }
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
            >
              <Lock className="h-5 w-5" />
              Login to email report
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ComparisonToolPage;
