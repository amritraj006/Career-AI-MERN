import React from 'react';
import { Outlet } from 'react-router-dom';
import { BrainCircuit, Target, CheckCircle2 } from 'lucide-react';
import Logo from '../Logo';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Left Side - Content/Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-blue-600/20" />
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/30 blur-[120px]" />
          <div className="absolute bottom-[0%] -right-[10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px]" />
        </div>

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Logo className="w-10 h-10" />
          <span className="text-white font-bold text-xl tracking-wide">PathCraft</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Navigate Your <span className="text-primary">Career Path</span> With AI-Powered Insights
          </h2>
          <p className="text-slate-300 text-lg">
            Join thousands of professionals making data-driven career decisions.
          </p>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
                <BrainCircuit className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Personalized AI Roadmaps</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Smart Career Assessments</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <span className="font-medium">Interactive Interview Prep</span>
            </div>
          </div>
        </div>

        {/* Bottom Tag */}
        <div className="relative z-10 flex items-center gap-2">
          <p className="text-sm text-slate-400 font-medium">Empowering your career journey today</p>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 relative">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
          <Logo className="w-12 h-12" />
          <h1 className="text-slate-800 font-bold text-2xl tracking-wide">PathCraft</h1>
        </div>

        {/* Auth Component */}
        <div className="w-full max-w-md">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
