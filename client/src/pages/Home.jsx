import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import {
  ArrowRight,
  BrainCircuit,
  Map,
  MessageSquare,
  Brain,
  Layers,
  BarChart2,
  Zap,
  ChevronRight,
  Star,
  Shield,
  TrendingUp,
} from 'lucide-react';
import Logo from '../components/Logo';
import apiService from '../services/apiService';

// ─── Animated Counter ───────────────────────────────────────────────────────
const useCountUp = (target, duration = 1800, active = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, active]);
  return count;
};

const Stat = ({ value, suffix, label, active }) => {
  const count = useCountUp(value, 1800, active);
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold text-slate-900">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs text-slate-500 font-semibold uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
};

// ─── Feature Card ────────────────────────────────────────────────────────────
const FeatureCard = ({ icon: Icon, color, title, description, to, label }) => {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate(to)}
      className="group text-left w-full bg-white border border-slate-100 rounded-2xl p-6 hover:border-slate-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{description}</p>
      <span className={`inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2.5 transition-all`}>
        {label} <ChevronRight className="w-3.5 h-3.5" />
      </span>
    </button>
  );
};

// ─── Testimonial ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer @ Google',
    avatar: 'PS',
    text: 'PathCraft helped me transition from backend to ML in 6 months. The roadmap was incredibly precise.',
    stars: 5,
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager @ Flipkart',
    avatar: 'RM',
    text: 'The interview prep coach is unreal. I practiced 50+ questions and cracked my dream PM role.',
    stars: 5,
  },
  {
    name: 'Ananya Gupta',
    role: 'Data Scientist @ Microsoft',
    avatar: 'AG',
    text: 'I never knew which career suited me. PathCraft\'s assessment changed everything for me.',
    stars: 5,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [dynamicStats, setDynamicStats] = useState({
    users: 0,
    roadmaps: 0,
    assessments: 0
  });

  useEffect(() => {
    apiService.getStats()
      .then(data => {
        if (data.success && data.stats) {
          setDynamicStats(data.stats);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCTA = () => {
    if (isSignedIn) navigate('/career-test');
    else openSignIn();
  };

  const features = [
    {
      icon: Brain,
      color: 'bg-violet-500',
      title: 'AI Career Assessment',
      description: 'Answer smart questions and get a personalized career match based on your unique strengths.',
      to: '/career-test',
      label: 'Take the Test',
    },
    {
      icon: Map,
      color: 'bg-primary',
      title: 'Roadmap Generator',
      description: 'Get a step-by-step learning roadmap tailored for your target career goal.',
      to: '/roadmap-generator',
      label: 'Generate Roadmap',
    },
    {
      icon: MessageSquare,
      color: 'bg-emerald-500',
      title: 'AI Interview Coach',
      description: 'Practice real interview questions with AI feedback to land your dream job faster.',
      to: '/interview-prep',
      label: 'Start Practicing',
    },
    {
      icon: Layers,
      color: 'bg-amber-500',
      title: 'Career Pathways',
      description: 'Explore hundreds of career paths with detailed salary ranges, skills and growth data.',
      to: '/pathways',
      label: 'Explore Pathways',
    },
    {
      icon: BarChart2,
      color: 'bg-sky-500',
      title: 'Comparison Tool',
      description: 'Compare careers side-by-side on salary, demand, difficulty and work-life balance.',
      to: '/comparison-tool-page',
      label: 'Compare Careers',
    },
    {
      icon: TrendingUp,
      color: 'bg-indigo-500',
      title: 'My Dashboard',
      description: 'Track saved careers, completed roadmaps and your assessment progress in one place.',
      to: '/my-dashboard',
      label: 'Go to Dashboard',
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* ─── Hero Section ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0f172a_1px,transparent_1px)] bg-[size:22px_22px]" />
        </div>
        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl translate-y-1/2" />

        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
            <BrainCircuit className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">AI-Powered Career Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 max-w-4xl">
            Discover Your Perfect{' '}
            <span className="relative">
              <span className="text-primary">Career Path</span>
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                <path d="M0 6 Q75 0 150 6 Q225 12 300 6" stroke="#F84565" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>
              </svg>
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mb-10 leading-relaxed">
            Our intelligent platform analyzes your strengths, interests, and goals to create
            a personalized career strategy — built just for you.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              id="hero-cta-primary"
              onClick={handleCTA}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-dull text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              {isSignedIn ? 'Take Career Test' : 'Get Started Free'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              id="hero-cta-secondary"
              onClick={() => navigate('/pathways')}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-full border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Explore Pathways
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-amber-500" /> Results in 3 minutes</span>
            <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-primary" /> 4.9 / 5 average rating</span>
          </div>
        </div>
      </section>

      {/* ─── Stats Strip ────────────────────────────────────────────────────── */}
      <section ref={statsRef} className="bg-white border-b border-slate-100 py-10">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Stat value={dynamicStats.users} suffix="+" label="Active Users" active={statsVisible} />
          <Stat value={dynamicStats.roadmaps} suffix="" label="Roadmaps Generated" active={statsVisible} />
          <Stat value={dynamicStats.assessments} suffix="" label="Assessments Taken" active={statsVisible} />
        </div>
      </section>

      {/* ─── Features Grid ──────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Everything You Need</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Your Complete Career Toolkit
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Six powerful AI tools in one platform. Each built to move you closer to your dream career.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </section>

      {/* ─── How It Works ────────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-slate-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Launch Your Career in 3 Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Take the Assessment', desc: 'Answer questions about your skills, interests and goals. Takes just 3 minutes.', color: 'bg-violet-500' },
              { step: '02', title: 'Get Your Roadmap', desc: 'Receive a personalized career path with step-by-step learning milestones.', color: 'bg-primary' },
              { step: '03', title: 'Ace Your Interviews', desc: 'Practice with our AI coach and walk into any interview with full confidence.', color: 'bg-emerald-500' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} className="flex flex-col items-center text-center group">
                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-5 text-white font-extrabold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {step}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Success Stories</p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Loved by Career Changers</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map(({ name, role, avatar, text, stars }) => (
            <div key={name} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="flex mb-3">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-5">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-extrabold text-primary flex-shrink-0">
                  {avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{name}</p>
                  <p className="text-[11px] text-slate-400">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────────────────────── */}
      <section className="bg-white border-t border-slate-100 py-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
            Ready to Find Your Direction?
          </h2>
          <p className="text-slate-500 mb-8 text-sm leading-relaxed">
            Join thousands of professionals who used PathCraft to land their dream careers.
            It's completely free to get started.
          </p>
          <button
            id="footer-cta-btn"
            onClick={handleCTA}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-dull text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
          >
            {isSignedIn ? 'Go to My Dashboard' : 'Start for Free'}
            <ArrowRight className="w-5 h-5" />
          </button>
          {!isSignedIn && (
            <p className="text-xs text-slate-400 mt-4">No account needed · Results in 3 min · 100% private</p>
          )}
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-100 py-8 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7" />
            <span className="text-sm font-bold text-slate-900">PathCraft</span>
          </div>
          <p className="text-xs text-slate-400">© {new Date().getFullYear()} PathCraft. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <button onClick={() => navigate('/about')} className="hover:text-primary transition-colors cursor-pointer">About</button>
            <button onClick={() => navigate('/pathways')} className="hover:text-primary transition-colors cursor-pointer">Pathways</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
