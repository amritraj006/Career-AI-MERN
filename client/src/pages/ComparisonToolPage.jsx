import React, { useState, useRef } from 'react';
import { X, ChevronDown, BarChart2, BookOpen, Clock, DollarSign, Download, Mail, Lock } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import apiService from '../services/apiService';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ComparisonToolPage = () => {
  const { user } = useUser(); 
  const pdfRef = useRef(null);
  const navigate = useNavigate();

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
      element.style.opacity = '0.9';
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          transform: 'scale(1.1)',
          transformOrigin: 'top left'
        }
      });

      const pdf = new jsPDF('landscape');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      pdf.setFontSize(18);
      pdf.setTextColor(15, 23, 42); // slate-900
      pdf.text('Career Comparison Report', 15, 20);
      
      pdf.setFontSize(12);
      pdf.text(`Generated on ${new Date().toLocaleDateString()}`, 15, 30);
      
      pdf.save('career-comparison.pdf');
      
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
        backgroundColor: '#ffffff',
      });

      const imageBlob = await (await fetch(dataUrl)).blob();
      const formData = new FormData();
      formData.append('image', imageBlob, 'career-comparison.png');
      formData.append('email', email);

      toast.dismiss();
      toast.loading('Sending image to your email...');

      await apiService.sendComparisonImage(formData);

      toast.dismiss();
      toast.success('📩 Comparison sent to your email!');
    } catch (error) {
      console.error('❌ Error sending image:', error);
      toast.dismiss();
      toast.error('Failed to send comparison via email.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 text-gray-900">
      <main className="container mx-auto px-6">
        {/* Career Selection */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Compare up to 4 careers:</h2>
            
            {/* Selected careers chips */}
            {selectedCareers.map(career => (
              <div 
                key={career.id}
                className="relative flex items-center bg-white hover:bg-gray-50 rounded-full px-4 py-2 border border-gray-200 shadow-sm transition-all"
                onMouseEnter={() => setHoveredCareer(career.id)}
                onMouseLeave={() => setHoveredCareer(null)}
              >
                <span className="font-medium text-gray-800">{career.title}</span>
                <button 
                  onClick={() => removeCareer(career.id)}
                  className="ml-2 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                
                {/* Career description tooltip */}
                {hoveredCareer === career.id && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg p-3 shadow-xl z-10 transition-opacity duration-200">
                    <p className="text-sm text-gray-600">{career.description}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Add career dropdown */}
            {selectedCareers.length < 4 && (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-primary hover:bg-primary-dull text-white px-5 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  <span className="font-medium">Add Career</span> 
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search careers..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredCareers
                        .filter(career => !selectedCareers.some(c => c.id === career.id))
                        .map(career => (
                          <button
                            key={career.id}
                            onClick={() => addCareer(career)}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex justify-between items-center border-b border-gray-100 last:border-b-0"
                          >
                            <div>
                              <p className="font-medium text-gray-800">{career.title}</p>
                              <p className="text-xs text-gray-500">{career.salary} • {career.growth} growth</p>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                              {career.education}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedCareers.length === 0 && (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                  <BarChart2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Start Comparing Careers</h3>
                <p className="text-gray-500 mb-6">
                  Select up to 4 careers to compare their salaries, growth rates, required education, and more.
                </p>
                <button
                  onClick={() => setShowDropdown(true)}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-dull text-white rounded-full font-medium transition-colors shadow-sm"
                >
                  Add First Career
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {selectedCareers.length > 0 && (
          <div className="mb-16">
            <div 
              ref={pdfRef} 
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-5 min-w-[220px]">
                        <span className="text-gray-600 font-medium">Comparison Metric</span>
                      </th>
                      {selectedCareers.map((career, index) => (
                        <th 
                          key={career.id}
                          className="p-5 text-center min-w-[220px] relative border-l border-gray-200 first:border-l-0"
                        >
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-900 mb-1">{career.title}</span>
                            <span className="text-sm text-primary font-semibold">{career.salary}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.map((metric) => (
                      <tr 
                        key={metric.key}
                        className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-5 flex items-center gap-3 text-gray-700">
                          <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-500">
                            {metric.icon}
                          </div>
                          <span className="font-medium">{metric.name}</span>
                        </td>
                        {selectedCareers.map(career => (
                          <td key={`${metric.key}-${career.id}`} className="p-5 text-center border-l border-gray-100">
                            {metric.key === 'skills' ? (
                              <div className="flex flex-wrap justify-center gap-2">
                                {career.skills.map((skill) => (
                                  <span 
                                    key={skill}
                                    className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div>
                                {metric.key === 'workLife' ? (
                                  <div className="flex justify-center">
                                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      career.workLife === "Excellent" ? "bg-green-100 text-green-700" :
                                      career.workLife === "Good" ? "bg-blue-100 text-blue-700" :
                                      career.workLife === "Moderate" ? "bg-yellow-100 text-yellow-700" :
                                      "bg-red-100 text-red-700"
                                    }`}>
                                      {career.workLife}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="font-medium text-gray-800">{career[metric.key]}</span>
                                )}
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        {selectedCareers.length > 1 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
              Key Insights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Highest Salary",
                  value: selectedCareers.reduce((max, career) => 
                    parseFloat(career.salary.replace(/\D/g, '')) > parseFloat(max.salary.replace(/\D/g, '')) ? career : max
                  ),
                  icon: "💵",
                  color: "bg-emerald-50 text-emerald-900 border-emerald-200"
                },
                {
                  title: "Fastest Growth",
                  value: selectedCareers.reduce((max, career) => 
                    parseInt(career.growth) > parseInt(max.growth) ? career : max
                  ),
                  icon: "📈",
                  color: "bg-blue-50 text-blue-900 border-blue-200"
                },
                {
                  title: "Best Work-Life",
                  value: selectedCareers.find(career => career.workLife === "Excellent") || 
                         selectedCareers.find(career => career.workLife === "Good") ||
                         selectedCareers[0],
                  icon: "⚖️",
                  color: "bg-purple-50 text-purple-900 border-purple-200"
                }
              ].map((item, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl p-6 border ${item.color} shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <h3 className="font-semibold mb-1 opacity-80">{item.title}</h3>
                      <p className="text-xl font-bold mb-2">{item.value.title}</p>
                      <p className="text-sm opacity-90">
                        {item.title === "Highest Salary" && `${item.value.salary} annually`}
                        {item.title === "Fastest Growth" && `${item.value.growth} projected growth`}
                        {item.title === "Best Work-Life" && `${item.value.workLife} balance`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save/Share Options */}
        {selectedCareers.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6">
            <button 
              onClick={handleExportPDF}
              className="px-8 py-3 bg-white border border-gray-200 text-gray-800 hover:bg-gray-50 hover:shadow-md rounded-xl font-medium flex items-center gap-3 transition-all"
            >
              <Download className="w-5 h-5 text-gray-500" />
              Export as PDF
            </button>
            
            {user ? (
              <button
                onClick={handleSendEmail}
                className="px-8 py-3 bg-primary text-white hover:bg-primary-dull shadow-sm hover:shadow-md rounded-xl font-medium flex items-center gap-3 transition-all"
              >
                <Mail className="w-5 h-5" />
                Send to Email
              </button>
            ) : (
              <button
                onClick={() => window.Clerk?.openSignIn({
                  afterSignInUrl: window.location.href,
                  redirectUrl: window.location.href
                })}
                className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 shadow-sm hover:shadow-md rounded-xl font-medium flex items-center gap-3 transition-all"
              >
                <Lock className="w-5 h-5" />
                Login to Email Report
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default ComparisonToolPage;