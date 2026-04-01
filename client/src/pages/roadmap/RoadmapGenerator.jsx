import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import {
  SidebarIcon,
  Search,
  Plus,
  Trash2,
  Download,
  Copy,
  Share,
  Calendar,
  Clock,
  User,
  Bot,
  Send,
  StopCircle,
  BookOpen,
  AlertCircle
} from 'lucide-react';
import apiService from "../../services/apiService";

// Fixed markdown renderer for assistant responses
const renderMarkdown = (text) => {
  let html = text
    // Bold text **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-primary">$1</strong>')
    // Italic text *text*
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')
    // Code blocks ``````
    .replace(/``````/gs, '<pre class="bg-gray-100 p-4 rounded-xl my-4 overflow-x-auto border border-gray-200 shadow-sm text-sm font-mono text-gray-800"><code>$1</code></pre>')
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1.5 rounded-md text-sm font-mono text-primary font-medium">$1</code>')
    // Headers ## text
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-900 tracking-tight">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-6 mb-3 text-gray-800">$1</h3>')
    // Lists - item
    .replace(/^- (.*$)/gm, '<li class="ml-5 mb-2 list-disc marker:text-primary">$1</li>')
    // Numbers 1. item
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-5 mb-2 list-decimal font-medium">$1</li>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:text-primary-dull underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-5 leading-relaxed text-gray-700">')
    // Wrap in paragraph
    .replace(/^(.)/gm, '<p class="mb-5 leading-relaxed text-gray-700">$1')
    .replace(/(.*)$/gm, '$1</p>');
  return html;
};

export default function RoadmapGenerator() {
  const { isLoaded, user } = useUser();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [error, setError] = useState(null);
  const [abortController, setAbortController] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved ? JSON.parse(saved) : true;
  });

  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Apply sidebar preferences
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Search only in prompt
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredHistory(history);
      return;
    }
    const searchLower = searchTerm.toLowerCase();
    setFilteredHistory(
      history.filter(item => item.prompt.toLowerCase().includes(searchLower))
    );
  }, [history, searchTerm]);

  const fetchHistory = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) return;
      const data = await apiService.getRoadmapHistory(user.primaryEmailAddress.emailAddress);
      if (data.success) {
        setHistory(data.history);
        if (data.history.length > 0 && !selectedHistory) {
          setSelectedHistory(data.history[0]._id);
        }
      }
    } catch (err) {
      setError("Failed to load history");
    }
  };

  const deleteHistoryItem = async (id, e) => {
    e?.stopPropagation();
    try {
      const data = await apiService.deleteRoadmapHistory(id);
      if (data.success) {
        setHistory(prev => prev.filter(item => item._id !== id));
        if (selectedHistory === id) {
          setMessages([]);
          setSelectedHistory(null);
        }
      }
    } catch {
      setError("Failed to delete history item");
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setError("Copied to clipboard!");
      setTimeout(() => setError(null), 2000);
    } catch {
      setError("Failed to copy to clipboard");
    }
  };

  const downloadRoadmap = (roadmap, title, format = 'txt') => {
    const element = document.createElement("a");
    let content = roadmap;
    let mimeType = 'text/plain';
    if (format === 'md') {
      content = roadmap;
      mimeType = 'text/markdown';
    } else if (format === 'html') {
      content = `<!DOCTYPE html><html><head><title>${title}</title><style>body { font-family: sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 20px; }</style></head><body>${renderMarkdown(roadmap)}</body></html>`;
      mimeType = 'text/html';
    }
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = `${title.slice(0, 30)}-roadmap.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  useEffect(() => {
    if (isLoaded && user) fetchHistory();
  }, [isLoaded, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setMessages(prev => [...prev, {
        type: 'system',
        text: "Generation stopped by user",
        isError: true,
        timestamp: new Date().toISOString()
      }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);
    setError(null);
    const userMessage = {
      type: 'user',
      text: prompt,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setPrompt("");
    try {
      const data = await apiService.generateRoadmap(
        user?.primaryEmailAddress?.emailAddress, 
        prompt, 
        controller.signal
      );
      
      if (data.success) {
        setMessages(prev => [...prev, {
          type: 'assistant',
          text: data.roadmap,
          timestamp: new Date().toISOString()
        }]);
        fetchHistory();
      } else {
        setMessages(prev => [...prev, {
          type: 'system',
          text: data.message || "Failed to generate roadmap",
          isError: true,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (err) {
      if (err.name !== 'CanceledError' && err.message !== 'canceled') {
        setMessages(prev => [...prev, {
          type: 'system',
          text: "Connection error. Please try again.",
          isError: true,
          timestamp: new Date().toISOString()
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (id) => {
    const item = history.find(h => h._id === id);
    if (item) {
      setSelectedHistory(id);
      setMessages([
        {
          type: 'user',
          text: item.prompt,
          timestamp: item.created_at
        },
        {
          type: 'assistant',
          text: item.roadmap,
          timestamp: item.created_at
        }
      ]);
    }
  };

  const clearCurrent = () => {
    if (loading && abortController) abortController.abort();
    setPrompt("");
    setMessages([]);
    setError(null);
    setLoading(false);
    setSelectedHistory(null);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' })
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
        <div className="text-center bg-white p-10 rounded-3xl shadow-sm border border-gray-200 max-w-sm w-full fade-in">
          <div className="w-14 h-14 border-4 border-gray-200 border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Initializing AI</h2>
          <p className="text-gray-500 font-medium">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900 font-sans fade-in">
      {/* Sidebar */}
      <aside
        className={`w-96 bg-white border-r border-gray-200 flex flex-col fixed h-screen z-30 shadow-xl transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between mb-6">
            <Link to='/' className='flex items-center gap-3 group'>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-all transform group-hover:-translate-y-0.5">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-gray-900 tracking-tight group-hover:text-primary transition-colors">
                CareerAI
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2.5 rounded-xl hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <SidebarIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={clearCurrent}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold bg-white border border-gray-200 text-gray-700 shadow-sm hover:shadow-md hover:border-primary hover:text-primary transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            New Roadmap
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-100">
          <div className="relative mb-2">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search in history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              {searchTerm ? `Search Results (${filteredHistory.length})` : `History (${filteredHistory.length})`}
            </h2>
          </div>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <AlertCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-bold mb-1">
                {searchTerm ? 'No results found' : 'No conversations yet'}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                {searchTerm ? 'Try different keywords' : 'Generate your first roadmap!'}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-primary font-bold text-sm hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((item, index) => (
                <div
                  key={item._id}
                  className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedHistory === item._id
                      ? 'bg-white border-2 border-primary shadow-md'
                      : 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/50 hover:-translate-y-0.5'
                  }`}
                  onClick={() => loadHistoryItem(item._id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        selectedHistory === item._id
                          ? 'bg-primary shadow-[0_0_8px_rgba(225,29,72,0.5)]'
                          : 'bg-gray-300'
                      }`} />
                      <span className="text-xs font-bold text-gray-500">
                        #{filteredHistory.length - index}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => deleteHistoryItem(item._id, e)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2 leading-relaxed">
                    {item.prompt}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(item.created_at)}
                      </span>
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'md:ml-96' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 p-5 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 transition-all hover:scale-105 shadow-sm"
                >
                  <SidebarIcon className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Career <span className="text-primary italic">AI Assistant</span>
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  AI-powered career guidance and planning
                </p>
              </div>
            </div>
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>
        </header>

        {/* Chat Area */}
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 slide-up">
              <div className="relative mb-8 group">
                <div className="w-24 h-24 rounded-3xl bg-white border border-gray-200 shadow-xl flex items-center justify-center relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                  <Bot className="w-12 h-12 text-primary" />
                </div>
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-xl animate-pulse"></div>
              </div>
              <h2 className="text-3xl font-extrabold mb-4 text-gray-900 tracking-tight">
                Welcome to CareerAI
              </h2>
              <p className="text-lg mb-8 max-w-2xl text-gray-600 font-medium leading-relaxed">
                {user ? `Hello ${user.firstName}! ` : ''}
                Transform your career aspirations into actionable roadmaps with AI-powered guidance tailored just for you.
              </p>
              <div className="px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-600 shadow-sm flex items-center gap-3 font-medium cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setPrompt("How can I become a senior software engineer in 2 years?")}>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                Try: "How can I become a senior software engineer in 2 years?"
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6 space-y-8 pb-10">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 slide-up ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border ${
                    message.type === 'user'
                      ? 'bg-primary border-primary/20'
                      : 'bg-white border-gray-200'
                  }`}>
                    {message.type === 'user' ? (
                      user?.imageUrl ? (
                        <img src={user.imageUrl} alt="You" className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )
                    ) : (
                      <Bot className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <span className="font-bold text-sm text-gray-900">
                        {message.type === 'user' ? (user?.firstName || 'You') : 'CareerAI Assistant'}
                      </span>
                      <span className="text-xs font-medium text-gray-400">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    <div className={`inline-block max-w-[85%] p-6 rounded-3xl shadow-sm border ${
                      message.type === 'user'
                        ? 'bg-primary text-white border-primary-dull rounded-tr-sm text-left align-top font-medium tracking-wide'
                        : message.isError
                        ? 'bg-red-50 border-red-200 text-red-900 rounded-tl-sm'
                        : 'bg-white border-gray-200 text-gray-800 rounded-tl-sm'
                    }`}>
                      {message.type === 'assistant' && !message.isError ? (
                        <div
                          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-a:text-primary hover:prose-a:text-primary-dull"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap text-[15px] leading-relaxed">
                          {message.text}
                        </div>
                      )}

                      {/* Message Actions */}
                      {message.type === 'assistant' && !message.isError && (
                        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                          <button
                            onClick={() => copyToClipboard(message.text)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                          <button
                            onClick={() => downloadRoadmap(message.text, messages.find(m => m.type === 'user')?.text || 'roadmap', 'md')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            title="Download as text file"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Download
                          </button>
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-600 transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            title="Share with others"
                          >
                            <Share className="w-3.5 h-3.5" />
                            Share
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 p-6 sticky bottom-0 z-20">
          <div className="max-w-4xl mx-auto">
            {error && (
              <div className="mb-4 p-4 rounded-xl flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 shadow-sm fade-in">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-bold">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="relative shadow-lg rounded-2xl bg-white border border-gray-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <textarea
                required
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={3}
                className="w-full px-6 py-5 pr-32 bg-transparent text-sm resize-none text-gray-900 placeholder-gray-400 font-medium focus:outline-none"
                placeholder="Describe your career goals... (e.g., 'I want to transition from marketing to UX design within 18 months')"
                disabled={loading}
              />
              
              <div className="absolute right-4 bottom-4 flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400">
                  {prompt.length}/500
                </span>
                
                {loading ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors shadow-sm"
                    title="Stop generation"
                  >
                    <StopCircle className="w-6 h-6" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all shadow-md transform ${
                      !prompt.trim()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                        : 'bg-primary text-white hover:bg-primary-dull hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                    title="Generate Roadmap"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                )}
              </div>
            </form>
            <div className="text-center mt-3">
              <span className="text-xs font-medium text-gray-400">
                💡 Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono">Shift+Enter</kbd> for a new line and <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-gray-500 font-mono">Enter</kbd> to submit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
