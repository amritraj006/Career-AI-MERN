import { useState, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { Toaster } from 'sonner';
import Home from './pages/Home';
import ComparisonToolPage from './pages/ComparisonToolPage';
import CareerTestPage from './pages/CareerTestPage';
import AllPathways from './pages/AllPathways';
import PathwayDetails from './pages/PathwayDetails';
import AllResources from './pages/AllResources';
import ResourceDetails from './pages/ResourceDetails';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import NotFound from './pages/NotFound';

import { RoadmapPage } from './pages/roadmap/RoadmapPage';
import RoadmapGenerator from './pages/roadmap/RoadmapGenerator';
import LearningPage from './pages/LearningPage';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith("/my-dashboard");
  const isAboutPage = location.pathname.startsWith("/about");
  const isPaymentPage = location.pathname === "/payment";

  const isRoadMapPage = location.pathname === "/roadmap-generator";
  const chatPage = location.pathname.startsWith("/chatbot");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p className="text-gray-800 font-medium tracking-wide">Loading Career AI...</p>
      </div>
    );
  }

  return (
    <>
      {!chatPage && !isDashboard && !isAboutPage && !isPaymentPage && !isRoadMapPage && <Navbar />}
      
      <Toaster richColors position="top-center" />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/comparison-tool-page' element={<ComparisonToolPage />} />
        <Route path='/career-test' element={<CareerTestPage />} />
        <Route path='/pathways' element={<AllPathways />} />
        <Route path='/resources' element={<AllResources />} />
        <Route path='/resources/:resourceId' element={<ResourceDetails />} />
        <Route path='/resources/:learning-page/:resourceId' element={<LearningPage />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/my-dashboard' element={<Dashboard />} />
        <Route path='/about' element={<About />} />
        
       
        <Route path='/roadmap' element={<RoadmapPage />} />
        <Route path='/roadmap-generator' element={<RoadmapGenerator />} />
        <Route path='/pathways/:pathwayId' element={<PathwayDetails />} />
        <Route path='/not-found' element={<NotFound />} />
        <Route path='*' element={<NotFound />} />
      </Routes>

      { !isDashboard && !isPaymentPage && !isRoadMapPage && <Footer />}
    </>
  );
};

export default App;
