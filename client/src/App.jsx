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

const SplashScreen = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
        </svg>
      </div>
      <p className="text-white font-semibold text-lg tracking-wide">CareerAI</p>
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
        {/* Everything lives inside the Dashboard shell */}
        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/my-dashboard' element={<Dashboard />} />
          <Route path='/roadmap-generator' element={<RoadmapPage />} />
          <Route path='/interview-prep' element={<InterviewPrepPage />} />
          <Route path='/career-test' element={<CareerTestPage />} />
          <Route path='/pathways' element={<AllPathways />} />
          <Route path='/pathways/:pathwayId' element={<PathwayDetails />} />
          <Route path='/comparison-tool-page' element={<ComparisonToolPage />} />
        </Route>

        <Route path='/not-found' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
