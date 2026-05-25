import { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import Home from './pages/Home';
import ComparisonToolPage from './pages/ComparisonToolPage';
import CareerTestPage from './pages/CareerTestPage';
import AllPathways from './pages/AllPathways';
import PathwayDetails from './pages/PathwayDetails';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';
import { RoadmapPage } from './pages/roadmap/RoadmapPage';
import InterviewPrepPage from './pages/InterviewPrepPage';
import DashboardLayout from './components/layout/DashboardLayout';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';

const SplashScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 z-50">
    <div className="flex flex-col items-center gap-4">
      <Logo className="w-14 h-14 animate-pulse" />
      <p className="text-white font-semibold text-lg tracking-wide">PathCraft</p>
      <div className="flex gap-1.5 mt-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SplashScreen />;

  return (
    <>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Public Auth Routes */}
        <Route path='/sign-in/*' element={<SignInPage />} />
        <Route path='/sign-up/*' element={<SignUpPage />} />

        {/* Everything lives inside the Dashboard shell */}
        <Route element={<DashboardLayout />}>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path='/my-dashboard' element={<Dashboard />} />
            <Route path='/roadmap-generator' element={<RoadmapPage />} />
            <Route path='/interview-prep' element={<InterviewPrepPage />} />
            <Route path='/career-test' element={<CareerTestPage />} />
            <Route path='/pathways' element={<AllPathways />} />
            <Route path='/pathways/:pathwayId' element={<PathwayDetails />} />
            <Route path='/comparison-tool-page' element={<ComparisonToolPage />} />
          </Route>
        </Route>

        <Route path='/not-found' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
