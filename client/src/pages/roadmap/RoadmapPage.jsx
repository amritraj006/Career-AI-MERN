import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { apiService } from '../../services/apiService';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';
import { 
  Sparkles, Loader2, Navigation2, History, Trash2, Plus, Zap, ArrowRight, BrainCircuit
} from 'lucide-react';

export const RoadmapPage = () => {
  const { user } = useUser();
  const location = useLocation();
  const [prompt, setPrompt] = useState(location.state?.prefilledPrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentRoadmap, setCurrentRoadmap] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const contentRef = useRef(null);

  useEffect(() => {
    if (location.state?.prefilledPrompt) {
      setPrompt(location.state.prefilledPrompt);
    }
  }, [location.state]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchHistory();
    } else {
      setIsLoadingHistory(false);
    }
  }, [user]);

  const fetchHistory = async () => {
    try {
      setIsLoadingHistory(true);
      const res = await apiService.getRoadmapHistory(user.primaryEmailAddress.emailAddress);
      if (res.success) {
        setHistory(res.history);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load past roadmaps');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a career goal or prompt!");
      return;
    }
    
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error("Please log in to generate a roadmap");
      return;
    }

    try {
      setIsGenerating(true);
      setCurrentRoadmap(null);
      const res = await apiService.generateRoadmap(user.primaryEmailAddress.emailAddress, prompt);
      
      if (res.success) {
        setCurrentRoadmap({ prompt, roadmap: res.roadmap });
        toast.success("Learning path structured!");
        setPrompt('');
        fetchHistory(); 
      } else {
        toast.error("Generation failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error communicating with AI engine.');
    } finally {
      setIsGenerating(false);
      if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await apiService.deleteRoadmapHistory(id);
      if (res.success) {
        setHistory(prev => prev.filter(item => item._id !== id));
        toast.success("Roadmap removed");
        if (currentRoadmap && currentRoadmap._id === id) {
          setCurrentRoadmap(null);
        }
      }
    } catch (err) {
      toast.error("Failed to delete roadmap");
    }
  };

  const loadFromHistory = (item) => {
    setCurrentRoadmap(item);
    if (contentRef.current) contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearCurrent = () => {
    setCurrentRoadmap(null);
    setPrompt('');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50 overflow-hidden font-sans">
      
      {/* Sidebar: History */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10 hidden md:flex">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col justify-center items-center">
           <button 
             onClick={clearCurrent}
             className="w-full py-3.5 px-4 bg-primary hover:bg-primary-dull text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
           >
             <Plus className="w-5 h-5" />
             New Roadmap
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 custom-scrollbar">
          <div className="flex items-center gap-2 mb-4 px-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Journey History</h3>
          </div>

          {isLoadingHistory ? (
             <div className="flex justify-center py-10">
               <Loader2 className="w-6 h-6 animate-spin text-primary" />
             </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 px-4">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <BrainCircuit className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500">No roadmaps generated yet. Start exploring your career possibilities!</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item._id} 
                onClick={() => loadFromHistory(item)}
                className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  currentRoadmap?._id === item._id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50 hover:shadow-sm'
                }`}
              >
                <p className="text-sm font-semibold text-slate-800 line-clamp-2 pr-6">
                  {item.prompt}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                  </p>
                </div>
                <button 
                  onClick={(e) => handleDelete(item._id, e)}
                  className="absolute top-4 right-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Roadmap"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col relative h-full bg-slate-50 w-full" ref={contentRef}>
        
        {/* Output Area */}
        <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative pb-32">
          {!currentRoadmap && !isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center max-w-3xl mx-auto fade-in">
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-100 to-purple-50 rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-white transform rotate-3">
                <Sparkles className="w-10 h-10 text-primary transform -rotate-3" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Future</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed mb-10 text-balance">
                Tell our AI your career aspirations, and we'll engineer a high-precision, actionable learning path to get you there.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {[
                  "Full Stack Developer specializing in AI applications",
                  "Cloud Architect with AWS and Kubernetes focus",
                  "Data Scientist working on LLMs and Generative AI",
                  "Cybersecurity Analyst pivoting from IT Support"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPrompt(suggestion);
                    }}
                    className="p-4 bg-white border border-slate-200 rounded-2xl text-left text-sm font-medium text-slate-600 hover:text-primary hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                  >
                     <div className="flex justify-between items-center">
                       <span className="line-clamp-2 pr-2">{suggestion}</span>
                       <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                     </div>
                  </button>
                ))}
              </div>
            </div>
          ) : isGenerating ? (
            <div className="h-full flex flex-col items-center justify-center p-8 fade-in text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl animate-pulse opacity-50"></div>
                <div className="relative bg-white p-5 rounded-full shadow-lg border border-indigo-50">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Architecting your path...</h3>
              <p className="text-slate-500 font-medium">Cross-referencing industry standards and optimizing learning curves.</p>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full px-6 md:px-12 py-12 fade-in">
              {/* Selected Prompt Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-10 shadow-sm flex items-start gap-4">
                 <div className="bg-indigo-100 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Objective</h4>
                    <p className="text-lg font-bold text-slate-800 leading-snug">{currentRoadmap?.prompt}</p>
                 </div>
              </div>
              
              {/* Markdown Render */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm min-h-[500px]">
                <div className="prose prose-slate prose-indigo max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-indigo-600 prose-li:marker:text-indigo-400">
                  <ReactMarkdown>{currentRoadmap?.roadmap}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Floating Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-50 via-slate-50/95 to-transparent pt-12 pb-6 px-4 md:px-8 border-none z-20 pointer-events-none">
          <div className="max-w-4xl mx-auto w-full pointer-events-auto">
            <form 
              onSubmit={handleGenerate} 
              className="relative bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-200 rounded-2xl overflow-hidden transition-all focus-within:shadow-[0_8px_30px_rgba(99,102,241,0.15)] focus-within:border-indigo-300"
            >
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Become a Senior Cybersecurity Analyst from scratch in 6 months..."
                className="w-full bg-transparent resize-none py-5 pl-5 pr-16 outline-none text-slate-700 font-medium placeholder:text-slate-400 min-h-[64px] max-h-32 custom-scrollbar"
                rows={1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleGenerate(e);
                  }
                }}
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={!prompt.trim() || isGenerating}
                className={`absolute right-3 top-3 p-3 rounded-xl flex items-center justify-center transition-all ${
                  prompt.trim() && !isGenerating
                    ? 'bg-primary text-white shadow-md hover:bg-primary-dull hover:shadow-lg hover:-translate-y-0.5'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation2 className="w-5 h-5" />}
              </button>
            </form>
            <div className="text-center mt-3">
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">AI can make mistakes. Consider researching complex topics further.</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
