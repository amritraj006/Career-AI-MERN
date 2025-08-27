import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // Handle navigation commands
  const handleNavigation = (command) => {
    const cmd = command.toLowerCase().trim();
    const navigationMap = {
      'home': '/',
      'about': '/about',
      'pathways': '/pathways',
      'resources': '/resources',
      'comparison': '/comparison-tool-page',
      'comparison tool': '/comparison-tool-page',
      'roadmap': '/roadmap',
      'career test': '/career-test',
      'test': '/career-test',
      'dashboard': '/my-dashboard',
      'my dashboard': '/my-dashboard',
      'cart' : '/cart'
    };

    if (navigationMap[cmd]) {
      const path = navigationMap[cmd];
      
      // Special handling for protected routes
      if ((path === '/career-test' || path === '/my-dashboard') && !isSignedIn) {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            text: `To access the ${cmd} page, you need to be logged in. Please log in to continue.`,
            timestamp: new Date()
          }
        ]);
        return true;
      }
      
      // Trigger navigation
      navigate(path);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          text: `Taking you to the ${cmd} page...`,
          timestamp: new Date()
        }
      ]);
      return true;
    }
    
    return false;
  };

  // Handle help commands
  const handleCommand = (command) => {
    const cmd = command.toLowerCase().trim();
    
    // Check if it's a navigation command first
    if (handleNavigation(cmd)) return true;
    
    switch(cmd) {
      case 'help':
        setMessages(prev => [
          ...prev, 
          {
            role: "assistant",
            text: "Here are the available commands:",
            commands: [
              { command: "help", description: "Show all available commands" },
              { command: "clear", description: "Clear conversation history" },
              { command: "menu", description: "Show main menu options" },
              { command: "time", description: "Show current time" },
              { command: "contact", description: "Show contact information" },
              { command: "home", description: "Navigate to home page" },
              { command: "about", description: "Navigate to about page" },
              { command: "pathways", description: "Navigate to learning pathways" },
              { command: "resources", description: "Navigate to resources page" },
              { command: "comparison", description: "Navigate to comparison tool" },
              { command: "roadmap", description: "Navigate to career roadmap" },
              { command: "test", description: "Navigate to career test" },
              { command: "dashboard", description: "Navigate to my dashboard" },
              { command: "cart", description: "Navigate to cart" }
            ],
            timestamp: new Date()
          }
        ]);
        return true;
      
      case 'clear':
        setMessages([]);
        return true;
        
      case 'menu':
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            text: "What would you like to know about Career AI?",
            quickReplies: [
              "What is Career AI?",
              "What features do you offer?", 
              "How does the career test work?",
              "Tell me about learning pathways",
              "Contact information"
            ],
            timestamp: new Date()
          }
        ]);
        return true;
        
      case 'time':
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            text: `Current time is ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            timestamp: new Date()
          }
        ]);
        return true;
        
      case 'contact':
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            text: "Here's our contact information:\n\n📧 Email: careerai@gmail.com\n👨‍💻 Developer: Amrit Raj (amritsingh5356@gmail.com)\n🛟 Support: support@careerai.com\n📞 Phone: +1 (555) 123-4567\n🏢 Address: 123 Innovation Drive, Tech City, CA 94105",
            timestamp: new Date()
          }
        ]);
        return true;
        
      default:
        return false;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // Check if it's a command
    if (input.startsWith('/')) {
      const isCommandHandled = handleCommand(input.slice(1));
      if (isCommandHandled) {
        setInput("");
        return;
      }
    }
    
    const userMessage = { 
      role: "user", 
      text: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://localhost:3001/api/chatbot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setIsTyping(false);

      // Check if the response contains navigation instructions
      if (data.navigation) {
        // Special handling for protected routes
        if ((data.navigation === '/career-test' || data.navigation === '/my-dashboard' || data.navigation === '/cart') && !isSignedIn) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: "To access this page, you need to be logged in. Please log in to continue.",
              timestamp: new Date()
            },
          ]);
        } else {
          // Navigate to the requested page
          navigate(data.navigation);
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              text: `Taking you to the requested page...`,
              timestamp: new Date()
            },
          ]);
        }
      } else {
        // Regular response
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: data.answer || "I specialize in helping with career guidance. Ask me about Career AI features, courses, or career planning.",
            timestamp: new Date()
          },
        ]);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I'm having trouble connecting right now. Please try again shortly.",
          timestamp: new Date()
        },
      ]);
    }
  };

  // Suggested questions for quick interactions
  const suggestedQuestions = [
    "What is Career AI?",
    "How does the career test work?",
    "What learning pathways do you offer?",
    "Contact information"
  ];

  // Handle quick reply selection
  const handleQuickReply = (text) => {
    setInput(text);
    setTimeout(() => sendMessage(), 100);
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* ✅ Floating Chat Button with Subtle Animation */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 z-[9999]
            rounded-full shadow-lg flex items-center justify-center text-white font-bold text-2xl
            bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800
            transition-all duration-300 ring-2 ring-white/20"
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: ["0 4px 14px 0 rgba(0, 0, 0, 0.2)", "0 6px 20px 0 rgba(0, 0, 0, 0.3)", "0 4px 14px 0 rgba(0, 0, 0, 0.2)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center animate-pulse">
            1
          </span>
        </motion.button>
      )}

      {/* ✅ Chat Window with Modern Design */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chatbot"
            className="fixed bottom-6 right-6 w-80 md:w-96 bg-white text-gray-800 
              shadow-xl rounded-xl overflow-hidden flex flex-col z-[9999] border border-gray-200"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header with Gradient */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Career Assistant</h2>
                  <p className="text-xs text-blue-100">{isTyping ? "Typing..." : "Online • Ready to help"}</p>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMinimized ? "M12 19V5M5 12l7-7 7 7" : "M5 12h14M12 5v14"} />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                  aria-label="Close chat"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat messages container - hidden when minimized */}
            {!isMinimized && (
              <div className="flex-1 p-4 overflow-y-auto max-h-80 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Hi there! I'm your Career AI assistant.</p>
                    <p className="text-gray-400 text-xs mt-1">Ask me anything about Career AI features and services</p>
                    
                    <div className="mt-4 space-y-2">
                      {suggestedQuestions.map((question, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickReply(question)}
                          className="text-xs text-left w-full p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-800"
                        >
                          {question}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6 text-left">
                      <p className="text-xs text-gray-500 font-medium mb-2">Try these commands:</p>
                      <div className="space-y-1">
                        <div className="text-xs text-gray-600 flex">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">/help</span>
                          <span className="ml-2 mt-1">Show all available commands</span>
                        </div>
                        <div className="text-xs text-gray-600 flex">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">/menu</span>
                          <span className="ml-2 mt-1">Show question suggestions</span>
                        </div>
                        <div className="text-xs text-gray-600 flex">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">/contact</span>
                          <span className="ml-2 mt-1">Show contact information</span>
                        </div>
                        <div className="text-xs text-gray-600 flex">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">/clear</span>
                          <span className="ml-2 mt-1">Clear conversation history</span>
                        </div>
                        <div className="text-xs text-gray-600 flex">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">/home</span>
                          <span className="ml-2 mt-1">Navigate to home page</span>
                        </div>
                        <div className="text-xs text-gray-600 flex">
                          <span className="font-mono bg-gray-200 px-2 py-1 rounded">/test</span>
                          <span className="ml-2 mt-1">Navigate to career test</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, i) => (
                      <motion.div
                        key={i}
                        className={`my-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === "user"
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                            : "bg-white border border-gray-200 text-gray-700 rounded-bl-none"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                            {msg.role === "user" ? "You" : "Assistant"} • {formatTime(msg.timestamp)}
                          </p>
                          
                          {/* Quick Replies */}
                          {msg.quickReplies && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {msg.quickReplies.map((reply, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleQuickReply(reply)}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 hover:bg-blue-200 transition-colors"
                                >
                                  {reply}
                                </button>
                              ))}
                            </div>
                          )}
                          
                          {/* Command List */}
                          {msg.commands && (
                            <div className="mt-2 border-t pt-2 border-gray-200">
                              {msg.commands.map((cmd, idx) => (
                                <div key={idx} className="text-xs flex mt-1">
                                  <span className="font-mono bg-gray-200 px-2 py-1 rounded">/{cmd.command}</span>
                                  <span className="ml-2 mt-1 text-gray-600">{cmd.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </>
                )}
                
                {isTyping && (
                  <motion.div 
                    className="flex items-center my-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl rounded-bl-none">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* Input area - hidden when minimized */}
            {!isMinimized && (
              <div className="flex items-center p-3 bg-white border-t border-gray-200">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm outline-none border border-transparent focus:border-blue-500 focus:bg-white"
                  placeholder="Ask about Career AI or type /help for commands..."
                  aria-label="Type your message"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="ml-2 p-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full 
                    hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 
                    disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  aria-label="Send message"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;