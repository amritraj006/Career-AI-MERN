import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { ArrowLeft, Sparkles, Code2, Layers, Users } from "lucide-react";
import Logo from '../components/Logo';
import apiService from '../services/apiService';


const teamMembers = [
  {
    id: 1,
    name: "Amrit Raj",

    bio: "Handles backend development and project coordination. Ensures smooth integration between frontend and backend.",
  // Add image from public folder

    image: "/amritraj.png",
    github: "https://www.linkedin.com/in/amrit-raj-54652b294/",
    linkedin: "https://linkedin.com/in/amritraj",
    email: "amritraj23@lpu.in",
    color: "bg-primary",
    initials: "AR",
  },
  
];

const stats = [
  { id: 'users', icon: Users, label: "Active Users", value: "0" },
  { id: 'assessments', icon: Sparkles, label: "Assessments Taken", value: "0" },
  { id: 'roadmaps', icon: Layers, label: "Roadmaps Generated", value: "0" },
  { id: 'interviews', icon: Code2, label: "Interviews Practiced", value: "0" },
];

const About = () => {
  const navigate = useNavigate();
  const [dynamicStats, setDynamicStats] = useState(stats);

  useEffect(() => {
    apiService.getStats()
      .then(data => {
        if (data.success && data.stats) {
          setDynamicStats([
            { id: 'users', icon: Users, label: "Active Users", value: `${data.stats.users}+` },
            { id: 'assessments', icon: Sparkles, label: "Assessments Taken", value: `${data.stats.assessments}` },
            { id: 'roadmaps', icon: Layers, label: "Roadmaps Generated", value: `${data.stats.roadmaps}` },
            { id: 'interviews', icon: Code2, label: "Interviews Practiced", value: `${data.stats.interviews}` },
          ]);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-semibold mb-6 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Logo className="w-10 h-10" />
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">About PathCraft</h1>
          </div>
          <p className="text-center text-slate-500 text-sm max-w-xl mx-auto leading-relaxed">
            A student-built, AI-powered career guidance platform helping thousands discover their perfect career paths.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {dynamicStats.map(({ id, icon: Icon, label, value }) => (
            <div key={id} className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-2xl font-extrabold text-slate-900 mb-1">{value}</div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8 md:p-10">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Our Mission</p>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">Built to Democratize Career Guidance</h2>
          <p className="text-slate-500 leading-relaxed text-sm">
            Career AI was created as part of our academic project at LPU. We saw a gap — quality career 
            counseling is expensive and inaccessible for most students. So we built an AI-powered platform 
            that gives every student access to personalized career roadmaps, interview preparation, and 
            data-driven career recommendations, completely free.
          </p>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">The Team</p>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Meet the Builders</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="w-full max-w-sm bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-slate-100 mb-4 group-hover:border-primary/20 transition-colors">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div
                      className={`w-full h-full ${member.color} items-center justify-center text-2xl font-extrabold text-white hidden`}
                    >
                      {member.initials}
                    </div>
                  </div>

                  {/* Info */}
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">{member.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 ${member.color} bg-opacity-10 text-slate-700`}
                    style={{ backgroundColor: undefined }}
                  >
                    
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">{member.bio}</p>

                  {/* Socials */}
                  <div className="flex items-center gap-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-blue-50 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <FaLinkedin size={16} />
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <FaGithub size={16} />
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-primary/5 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
                    >
                      <FaEnvelope size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-white border border-slate-100 rounded-2xl p-8">
          <p className="text-xs font-bold text-primary uppercase tracking-widest mb-3">Tech Stack</p>
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">Built With Modern Technology</h2>
          <div className="flex flex-wrap gap-2">
            {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'Clerk Auth', 'Gemini AI', 'Framer Motion', 'Lucide Icons'].map((tech) => (
              <span key={tech} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-600">
                {tech}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
