import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, BarChart2, BookOpen, Clock, DollarSign, ArrowLeft, Download, Mail, Lock } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import { useUser, useSignIn } from '@clerk/clerk-react';
import { toast, Toaster } from 'sonner';
import { useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';

const ComparisonToolPage = () => {
  const { user } = useUser(); 
  const pdfRef = useRef(null);
  const navigate = useNavigate();
  const url = "https://career-ai-mern.onrender.com";

  // Sample career data with more detailed information
  const allCareers = [
    { id: 1, title: "Software Engineer", salary: "$110,000", education: "Bachelor's", growth: "25%", skills: ["JavaScript", "React", "Node.js"], workLife: "Moderate", description: "Develops software applications and systems" },
    { id: 2, title: "Data Scientist", salary: "$120,000", education: "Master's", growth: "31%", skills: ["Python", "Machine Learning", "SQL"], workLife: "Good", description: "Extracts insights from complex data sets" },
    { id: 3, title: "UX Designer", salary: "$95,000", education: "Bachelor's", growth: "22%", skills: ["Figma", "User Research", "Prototyping"], workLife: "Excellent", description: "Designs user-centered digital experiences" },
    { id: 4, title: "Cloud Architect", salary: "$130,000", education: "Bachelor's", growth: "27%", skills: ["AWS", "Azure", "DevOps"], workLife: "Moderate", description: "Designs and manages cloud infrastructure" },
    { id: 5, title: "Cybersecurity Analyst", salary: "$105,000", education: "Bachelor's", growth: "35%", skills: ["Network Security", "Ethical Hacking"], workLife: "Good", description: "Protects systems from digital threats" },
    { id: 6, title: "Product Manager", salary: "$125,000", education: "Bachelor's + MBA", growth: "20%", skills: ["Leadership", "Market Research", "Agile"], workLife: "Moderate", description: "Guides product development from conception to launch" },
    { id: 7, title: "AI Engineer", salary: "$140,000", education: "Master's", growth: "40%", skills: ["Python", "TensorFlow", "Deep Learning"], workLife: "Challenging", description: "Builds artificial intelligence systems" },
    { id: 8, title: "DevOps Engineer", salary: "$115,000", education: "Bachelor's", growth: "28%", skills: ["Docker", "Kubernetes", "CI/CD"], workLife: "Moderate", description: "Bridges development and operations" },
    { id: 9, title: "Blockchain Developer", salary: "$135,000", education: "Bachelor's", growth: "45%", skills: ["Solidity", "Smart Contracts", "Ethereum"], workLife: "Challenging", description: "Builds decentralized applications" },
    { id: 10, title: "Digital Marketer", salary: "$85,000", education: "Bachelor's", growth: "18%", skills: ["SEO", "Content Marketing", "Analytics"], workLife: "Good", description: "Promotes brands through digital channels" }
  ];

  // State for selected careers
  const [selectedCareers, setSelectedCareers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCareer, setHoveredCareer] = useState(null);

  // Metrics to compare
  const metrics = [
    { name: "Salary", icon: <DollarSign className="w-4 h-4" />, key: "salary" },
    { name: "Education", icon: <BookOpen className="w-4 h-4" />, key: "education" },
    { name: "Growth", icon: <BarChart2 className="w-4 h-4" />, key: "growth" },
    { name: "Work-Life Balance", icon: <Clock className="w-4 h-4" />, key: "workLife" },
    { name: "Top Skills", icon: <ChevronDown className="w-4 h-4" />, key: "skills" }
  ];

  // Filter careers based on search
  const filteredCareers = allCareers.filter(career =>
    career.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add career to comparison
  const addCareer = (career) => {
    if (selectedCareers.length < 4 && !selectedCareers.some(c => c.id === career.id)) {
      setSelectedCareers([...selectedCareers, career]);
      toast.success(`${career.title} added to comparison`);
    }
    setShowDropdown(false);
    setSearchTerm('');
  };

  // Remove career from comparison
  const removeCareer = (id) => {
    const removedCareer = selectedCareers.find(c => c.id === id);
    setSelectedCareers(selectedCareers.filter(career => career.id !== id));
    toast.info(`${removedCareer.title} removed from comparison`);
  };

  // Export to PDF function
  const handleExportPDF = async () => {
    try {
      if (!pdfRef.current) return;

      toast.loading('Generating PDF report...');

      const element = pdfRef.current;
      element.style.opacity = '0.8';
      
      // Convert the element to an image
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
        style: {
          transform: 'scale(1.1)',
          transformOrigin: 'top left'
        }
      });

      // Create PDF
      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Add metadata
      pdf.setFontSize(18);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Career Comparison Report', 15, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 30);
      
      // Save PDF
      pdf.save('career-comparison.pdf');
      
      // Reset loading state
      element.style.opacity = '1';
      toast.dismiss();
      toast.success('PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      if (pdfRef.current) {
        pdfRef.current.style.opacity = '1';
      }
      toast.dismiss();
      toast.error('Failed to generate PDF report');
    }
  };

  const handleSendEmail = async () => {
    try {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!pdfRef.current || !email) {
        toast.error('Missing comparison content or user email');
        return;
      }

      toast.loading('Generating comparison image...');

      const dataUrl = await htmlToImage.toPng(pdfRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0f172a',
      });

      const imageBlob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append('image', imageBlob, 'career-comparison.png');
      formData.append('email', email);

      toast.dismiss();
      toast.loading('Sending image to your email...');

      await axios.post(`${url}/api/send-comparison-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });


      toast.dismiss();
      toast.success('📩 Comparison sent to your email!');
    } catch (error) {
      console.error('❌ Error sending image:', error);
      toast.dismiss();
      toast.error('Failed to send comparison via email.');
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br pt-16 md:pt-50 from-gray-950 to-gray-900 text-white">
      
      <BlurCircle top='-80px' left='100px'/>
      <BlurCircle top='-80px' right='120px' color='from-purple-500/20' />
   
      {/* Header */}
     

      <main className="container mx-auto px-6 py-12">
        {/* Career Selection */}
        <motion.div 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-300">Compare up to 4 careers:</h2>
            
            {/* Selected careers chips */}
            <AnimatePresence>
              {selectedCareers.map(career => (
                <motion.div 
                  key={career.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="flex items-center bg-gray-800/50 hover:bg-gray-800 rounded-full px-4 py-2 border border-gray-700 shadow-md"
                  
                >
                  <span className="font-medium">{career.title}</span>
                  <motion.button 
                    onClick={() => removeCareer(career.id)}
                    className="ml-2 text-gray-400 hover:text-white"
                    whileHover={{ scale: 1.2 }}
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                  
                  {/* Career description tooltip */}
                  {hoveredCareer === career.id && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 mt-10 w-64 bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl"
                    >
                      <p className="text-sm text-gray-300">{career.description}</p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add career dropdown */}
            {selectedCareers.length < 4 && (
              <div className="relative">
                <motion.button
                  onClick={() => setShowDropdown(!showDropdown)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dull hover:to-blue-500 px-4 py-2 rounded-full transition-all shadow-lg"
                >
                  <span>Add Career</span> 
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="p-3 border-b border-gray-700">
                        <input
                          type="text"
                          placeholder="Search careers..."
                          className="w-full bg-gray-900 text-white px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCareers
                          .filter(career => !selectedCareers.some(c => c.id === career.id))
                          .map(career => (
                            <motion.button
                              key={career.id}
                              onClick={() => addCareer(career)}
                              whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                              className="w-full text-left px-4 py-3 hover:bg-gray-700/50 transition-colors flex justify-between items-center border-b border-gray-700/50 last:border-b-0"
                            >
                              <div>
                                <p className="font-medium">{career.title}</p>
                                <p className="text-xs text-gray-400">{career.salary} • {career.growth} growth</p>
                              </div>
                              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                                {career.education}
                              </span>
                            </motion.button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {selectedCareers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center"
            >
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <BarChart2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Start Comparing Careers</h3>
                <p className="text-gray-400 mb-4">
                  Select up to 4 careers to compare their salaries, growth rates, required education, and more.
                </p>
                <motion.button
                  onClick={() => setShowDropdown(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 rounded-full font-medium"
                >
                  Add First Career
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Comparison Table */}
        {selectedCareers.length > 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div 
              ref={pdfRef} 
              className="bg-gray-900/70 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="p-5 text-left min-w-[220px]">
                        <span className="text-gray-300 font-medium">Comparison Metric</span>
                      </th>
                      {selectedCareers.map((career, index) => (
                        <motion.th 
                          key={career.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-5 text-center min-w-[220px] relative"
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-lg mb-1">{career.title}</span>
                            <span className="text-sm text-primary font-medium">{career.salary}</span>
                          </div>
                          {index > 0 && (
                            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-8 w-px bg-gray-700"></div>
                          )}
                        </motion.th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric, metricIndex) => (
                      <motion.tr 
                        key={metric.key}
                        variants={scaleUp}
                        className="border-b border-gray-700 last:border-b-0 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="p-5 flex items-center gap-3 text-gray-300">
                          <div className="p-2 rounded-lg bg-gray-800">
                            {metric.icon}
                          </div>
                          <span className="font-medium">{metric.name}</span>
                        </td>
                        {selectedCareers.map(career => (
                          <td key={`${metric.key}-${career.id}`} className="p-5 text-center">
                            {metric.key === 'skills' ? (
                              <div className="flex flex-wrap justify-center gap-2">
                                {career.skills.map((skill, skillIndex) => (
                                  <motion.span 
                                    key={skill}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * skillIndex }}
                                    className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full"
                                  >
                                    {skill}
                                  </motion.span>
                                ))}
                              </div>
                            ) : (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1 * metricIndex }}
                              >
                                {metric.key === 'workLife' ? (
                                  <div className="flex justify-center">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                      career.workLife === "Excellent" ? "bg-green-900/30 text-green-400" :
                                      career.workLife === "Good" ? "bg-blue-900/30 text-blue-400" :
                                      career.workLife === "Moderate" ? "bg-yellow-900/30 text-yellow-400" :
                                      "bg-red-900/30 text-red-400"
                                    }`}>
                                      {career.workLife}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="font-medium">{career[metric.key]}</span>
                                )}
                              </motion.div>
                            )}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Key Takeaways */}
        {selectedCareers.length > 1 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Key Insights
            </h2>
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {[
                {
                  title: "Highest Salary",
                  value: selectedCareers.reduce((max, career) => 
                    parseFloat(career.salary.replace(/\D/g, '')) > parseFloat(max.salary.replace(/\D/g, '')) ? career : max
                  ),
                  icon: "💵",
                  color: "from-green-500 to-emerald-500"
                },
                {
                  title: "Fastest Growth",
                  value: selectedCareers.reduce((max, career) => 
                    parseInt(career.growth) > parseInt(max.growth) ? career : max
                  ),
                  icon: "📈",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Best Work-Life",
                  value: selectedCareers.find(career => career.workLife === "Excellent") || 
                         selectedCareers.find(career => career.workLife === "Good") ||
                         selectedCareers[0],
                  icon: "⚖️",
                  color: "from-purple-500 to-indigo-500"
                }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  variants={scaleUp}
                  whileHover={{ y: -5 }}
                  className={`bg-gradient-to-br ${item.color} rounded-2xl p-0.5 shadow-lg`}
                >
                  <div className="bg-gray-900/90 rounded-[calc(1rem-2px)] h-full p-6">
                    <div className="flex items-start gap-4">
                      <span className="text-3xl">{item.icon}</span>
                      <div>
                        <h3 className="font-bold mb-1 text-gray-300">{item.title}</h3>
                        <p className="text-xl font-bold mb-2">{item.value.title}</p>
                        <p className="text-sm text-gray-400">
                          {item.title === "Highest Salary" && `${item.value.salary} annually`}
                          {item.title === "Fastest Growth" && `${item.value.growth} projected growth`}
                          {item.title === "Best Work-Life" && `${item.value.workLife} balance`}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Save/Share Options */}
        {/* Save/Share Options */}
{/* Save/Share Options */}
{selectedCareers.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="flex flex-wrap justify-center gap-6"
  >
    <motion.button 
      onClick={handleExportPDF}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 hover:from-primary-dull hover:to-blue-500 rounded-xl font-medium flex items-center gap-3 shadow-lg"
    >
      <Download className="w-5 h-5" />
      Export as PDF
    </motion.button>
    
    {user ? (
      <motion.button
        onClick={handleSendEmail}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-xl font-medium flex items-center gap-3 shadow-lg"
      >
        <Mail className="w-5 h-5" />
        Send to Email
      </motion.button>
    ) : (
      <motion.button
        onClick={() => window.Clerk?.openSignIn({
          afterSignInUrl: window.location.href,
          redirectUrl: window.location.href
        })}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl font-medium flex items-center gap-3 shadow-lg"
      >
        <Mail className="w-5 h-5" />
        <Lock className="w-5 h-5" />
        Login to Email Report
      </motion.button>
    )}
  </motion.div>
)}
      </main>

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
            animate={{ 
              opacity: [0, 0.1, 0],
              x: Math.random() * 200 - 100,
              y: Math.random() * 200 - 100,
            }}
            transition={{ 
              duration: Math.random() * 20 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-primary rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ComparisonToolPage;