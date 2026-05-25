import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BrainCircuit, Map, MessageSquare, Brain } from 'lucide-react';

const features = [
  { icon: Brain, label: 'AI Career Assessment', desc: 'Discover careers that match your personality' },
  { icon: Map, label: 'Personalized Roadmaps', desc: 'Step-by-step plans to reach your goal' },
  { icon: MessageSquare, label: 'Interview Coach', desc: 'Practice with AI and ace any interview' },
];

const SignInPage = () => {
  return (
    <div className="min-h-screen flex bg-[#f8fafc]">

      {/* ── Left Panel (Brand / Feature showcase) ───────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] bg-slate-950 text-white p-12 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(248,69,101,0.04)_0%,transparent_70%)]" />
        </div>

        <div className="relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-16 group w-fit">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">CareerAI</span>
          </Link>

          {/* Headline */}
          <div className="mb-12">
            <h1 className="text-4xl font-extrabold leading-tight mb-4 tracking-tight">
              Your Career,{' '}
              <span className="text-primary">Guided by AI</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm">
              Sign in to access your personalized career dashboard, roadmaps, and AI coaching tools.
            </p>
          </div>

          {/* Feature List */}
          <div className="space-y-5">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                  <Icon className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{label}</p>
                  <p className="text-xs text-slate-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative border-t border-white/5 pt-8">
          <p className="text-slate-500 text-xs leading-relaxed italic">
            "CareerAI helped me switch from backend to ML engineering in 6 months. The roadmap was spot on."
          </p>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">P</div>
            <div>
              <p className="text-xs font-bold text-white">Priya Sharma</p>
              <p className="text-[10px] text-slate-500">Software Engineer @ Google</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right Panel (Clerk Sign In) ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Mobile back link */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-semibold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4.5 h-4.5">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-slate-900">CareerAI</span>
        </div>

        {/* Clerk SignIn Component */}
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/my-dashboard"
          appearance={{
            elements: {
              rootBox: 'w-full max-w-md',
              card: 'shadow-none border border-slate-100 rounded-2xl bg-white',
              headerTitle: 'text-xl font-extrabold text-slate-900',
              headerSubtitle: 'text-slate-500 text-sm',
              socialButtonsBlockButton: 'border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-700 transition-colors',
              dividerLine: 'bg-slate-100',
              dividerText: 'text-slate-400 text-xs font-semibold',
              formFieldLabel: 'text-xs font-bold text-slate-700 uppercase tracking-wide',
              formFieldInput: 'border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors',
              formButtonPrimary: 'bg-primary hover:bg-primary-dull rounded-xl font-bold text-sm shadow-sm shadow-primary/20 transition-colors',
              footerActionText: 'text-slate-500 text-sm',
              footerActionLink: 'text-primary font-bold hover:text-primary-dull',
              identityPreviewEditButton: 'text-primary',
              formResendCodeLink: 'text-primary',
              otpCodeFieldInput: 'border border-slate-200 rounded-xl',
              alertText: 'text-sm',
            },
          }}
        />

        <p className="mt-6 text-xs text-slate-400 text-center max-w-xs leading-relaxed">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
