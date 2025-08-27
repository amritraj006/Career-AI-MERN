// 📁 src/pages/roadmap/Roadmap.jsx
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
  Moon,
  Sun,
  Send,
  StopCircle,
  BookOpen,
  AlertCircle
} from 'lucide-react';

// Fixed markdown renderer for assistant responses
const renderMarkdown = (text) => {
  let html = text
    // Bold text **text**
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-blue-600 dark:text-blue-400">$1</strong>')
    // Italic text *text*
    .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em class="italic">$1</em>')
    // Code blocks ``````
    .replace(/``````/gs, '<pre class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg my-3 overflow-x-auto"><code>$1</code></pre>')
    // Inline code `code`
    .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm">$1</code>')
    // Headers ## text
    .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-200">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-700 dark:text-gray-300">$1</h3>')
    // Lists - item
    .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
    // Numbers 1. item
    .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1 list-decimal">$1</li>')
    // Links [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-500 hover:text-blue-600 underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Wrap in paragraph
    .replace(/^(.)/gm, '<p class="mb-4">$1')
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
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Apply theme and sidebar preferences
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [darkMode, sidebarOpen]);

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/roadmap/history?email=${user.primaryEmailAddress.emailAddress}`
      );
      const data = await res.json();
      if (data.success) {
        setHistory(data.history);
        if (data.history.length > 0 && !selectedHistory) {
          setSelectedHistory(data.history[0].id);
        }
      }
    } catch (err) {
      setError("Failed to load history");
    }
  };

  const deleteHistoryItem = async (id, e) => {
    e?.stopPropagation();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmap/history/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        setHistory(prev => prev.filter(item => item.id !== id));
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
      content = `<!DOCTYPE html><html><head><title>${title}</title></head><body>${renderMarkdown(roadmap)}</body></html>`;
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/roadmap`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.primaryEmailAddress?.emailAddress,
          prompt
        }),
        signal: controller.signal
      });
      const data = await res.json();
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
      if (err.name !== 'AbortError') {
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
    const item = history.find(h => h.id === id);
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
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-2 left-1/2 transform -translate-x-1/2 animate-pulse"></div>
          </div>
          <p className={`mt-6 text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Initializing CareerAI...
          </p>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Setting up your personalized workspace
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <aside
        className={`w-96 ${darkMode ? 'bg-gray-800/95 backdrop-blur-xl border-gray-700/50' : 'bg-white/95 backdrop-blur-xl border-gray-200/50'} border-r flex flex-col fixed h-screen z-30 shadow-2xl transition-all duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200/10">
          <div className="flex items-center justify-between mb-4">
            <Link to='/' className='flex items-center gap-3'>
              <div className="relative group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CareerAI
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
            >
              <SidebarIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={clearCurrent}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
              darkMode
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
            } hover:scale-105 active:scale-95`}
          >
            <Plus className="w-5 h-5" />
            New Roadmap
          </button>
        </div>
        {/* Search */}
        <div className="p-4 border-b border-gray-200/10">
          <div className="relative mb-3">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search in prompt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-10 py-3 rounded-xl text-sm ${
                darkMode
                  ? 'bg-gray-700/50 border-gray-600/50 placeholder-gray-400 text-white focus:bg-gray-700'
                  : 'bg-gray-100/50 border-gray-200/50 placeholder-gray-500 focus:bg-white'
              } border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ×
              </button>
            )}
          </div>
        </div>
        {/* History */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
              {searchTerm ? `Search Results (${filteredHistory.length})` : `History (${filteredHistory.length})`}
            </h2>
          </div>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} flex items-center justify-center`}>
                <AlertCircle className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {searchTerm ? 'No results' : 'No conversations yet'}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-300'} mt-1`}>
                {searchTerm ? 'Try different keywords' : 'Start your first roadmap above'}
              </p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="mt-3 text-blue-500 hover:text-blue-600 text-sm underline"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredHistory.map((item, index) => (
                <div
                  key={item.id}
                  className={`group relative p-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    selectedHistory === item.id
                      ? (darkMode ? 'bg-gradient-to-r from-blue-900/40 to-purple-900/30 border-2 border-blue-500/30 shadow-lg' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200/50 shadow-lg')
                      : (darkMode ? 'bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30' : 'bg-gray-50/50 hover:bg-white border border-gray-200/30')
                  } shadow-sm hover:shadow-md`}
                  onClick={() => loadHistoryItem(item.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        selectedHistory === item.id
                          ? 'bg-blue-500 animate-pulse'
                          : darkMode ? 'bg-gray-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        #{index + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => deleteHistoryItem(item.id, e)}
                        className={`p-1 rounded-lg ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'} transition-colors`}
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <h3 className={`font-medium text-sm mb-2 line-clamp-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {item.prompt}
                  </h3>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </span>
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
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
      <div className={`flex-1 flex flex-col h-screen transition-all duration-500 ${sidebarOpen ? 'md:ml-96' : 'ml-0'}`}>
        <div className={`${darkMode ? 'bg-gray-800/80 backdrop-blur-xl border-gray-700/50' : 'bg-white/80 backdrop-blur-xl border-gray-200/50'} border-b p-4 sticky top-0 z-20 shadow-sm`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-105`}
                >
                  <SidebarIcon className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Career Roadmap Assistant
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  AI-powered career guidance and planning
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-right hidden md:block">
                    <p className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="w-10 h-10 rounded-xl border-2 border-gray-200/20 shadow-sm"
                  />
                </div>
              )}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'} transition-all hover:scale-105 shadow-sm`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
        <div
          ref={containerRef}
          className={`flex-1 overflow-y-auto ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'}`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="relative mb-8">
                <div className={`w-32 h-32 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl flex items-center justify-center`}>
                  <Bot className={`w-16 h-16 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                </div>
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl animate-pulse"></div>
              </div>
              <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                Welcome to CareerAI
              </h2>
              <p className={`text-lg mb-8 max-w-2xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {user ? `Hello ${user.firstName}! ` : ''}
                Transform your career aspirations into actionable roadmaps with AI-powered guidance tailored just for you.
              </p>
              <div className={`px-6 py-3 rounded-full ${darkMode ? 'bg-gray-800/50 text-gray-300' : 'bg-white/50 text-gray-600'} backdrop-blur-sm shadow-lg animate-pulse`}>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  Try: "How can I become a senior software engineer in 2 years?"
                </span>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600'
                      : darkMode ? 'bg-gray-700' : 'bg-white'
                  }`}>
                    {message.type === 'user' ? (
                      user?.imageUrl ? (
                        <img src={user.imageUrl} alt="You" className="w-8 h-8 rounded-xl" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )
                    ) : (
                      <Bot className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                    )}
                  </div>
                  {/* Message Content */}
                  <div className={`flex-1 max-w-3xl ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-medium text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {message.type === 'user' ? (user?.firstName || 'You') : 'CareerAI'}
                      </span>
                      <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <div className={`p-6 rounded-2xl shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white'
                        : message.isError
                        ? darkMode ? 'bg-red-900/50 border border-red-700/50' : 'bg-red-50 border border-red-200'
                        : darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'
                    }`}>
                      {message.type === 'assistant' && !message.isError ? (
                        <div
                          className="prose prose-sm max-w-none dark:prose-invert"
                          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.text) }}
                        />
                      ) : (
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.text}
                        </div>
                      )}
                      {/* Message Actions */}
                      {message.type === 'assistant' && !message.isError && (
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200/20">
                          <button
                            onClick={() => copyToClipboard(message.text)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-all hover:scale-105`}
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </button>
                          <button
                            onClick={() => downloadRoadmap(message.text, messages.find(m => m.type === 'user')?.text || 'roadmap', 'txt')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-all hover:scale-105`}
                            title="Download as text"
                          >
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                          <button
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
                              darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                            } transition-all hover:scale-105`}
                            title="Share roadmap"
                          >
                            <Share className="w-3 h-3" />
                            Share
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        <div className={`${darkMode ? 'bg-gray-800/90 backdrop-blur-xl border-gray-700/50' : 'bg-white/90 backdrop-blur-xl border-gray-200/50'} border-t p-6 sticky bottom-0`}>
          {error && (
            <div className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${darkMode ? 'bg-red-900/50 border border-red-700/50 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'}`}>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
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
                className={`w-full px-6 py-4 pr-32 rounded-2xl text-sm resize-none ${darkMode
                  ? 'bg-gray-700/50 border-gray-600/50 placeholder-gray-400 text-white focus:bg-gray-700'
                  : 'bg-gray-50/50 border-gray-200/50 placeholder-gray-500 focus:bg-white'
                  } border-2 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-lg`}
                placeholder="Describe your career goal in detail... (e.g., 'I want to transition from marketing to UX design within 18 months with a focus on fintech')"
                disabled={loading}
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {prompt.length}/500
                </span>
                {prompt && !loading && (
                  <button
                    type="button"
                    onClick={() => setPrompt("")}
                    className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} transition-all hover:scale-110`}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  💡 Press Shift+Enter for new line
                </span>
              </div>
              <div className="flex items-center gap-3">
                {loading && (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className={`px-6 py-3 rounded-xl font-medium ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'
                    } border ${darkMode ? 'border-gray-600' : 'border-gray-300'} transition-all hover:scale-105 shadow-lg flex items-center gap-2`}
                  >
                    <StopCircle className="w-4 h-4" />
                    Stop
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className={`px-8 py-3 rounded-xl font-medium transition-all shadow-lg flex items-center gap-3 ${loading || !prompt.trim()
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-105 active:scale-95'
                    } ${darkMode
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl'
                    }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate Roadmap
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
