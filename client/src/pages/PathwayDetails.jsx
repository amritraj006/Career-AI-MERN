import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { pathways } from '../assets/pathwaysData';
import LoadingSpinner from '../components/LoadingSpinner';
import { useUser, SignInButton } from '@clerk/clerk-react';
import BlurCircle from '../components/BlurCircle';

const PathwayDetails = () => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();

  const pathway = useMemo(() => pathways.find(p => p.id === pathwayId), [pathwayId]);
  const url = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (!pathway) {
      toast.error('Pathway not found');
      const timer = setTimeout(() => navigate('/pathways', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathway, navigate]);


  if (!pathway) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen pt-20 md:pt-50 bg-gradient-to-br from-gray-950 to-gray-900 py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <BlurCircle top='-80px' right='100px' />
      <BlurCircle bottom='-80px' left='200px' />
      <BlurCircle top='-10px' left='100px' />
      <div className="relative max-w-5xl mx-auto">
        <Toaster position="top-center" richColors />
        <NavigationBackButton onClick={() => {navigate('/pathways'); scrollTo(0, 0)}} />
        <PathwayHeader
          pathway={pathway}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <SkillsSection skills={pathway.skills} />
          <ResponsibilitiesSection responsibilities={pathway.responsibilities} />
          <EducationSection education={pathway.education} />
          <CompaniesSection companies={pathway.companies} />
          {pathway.experienceLevels && (
            <ExperienceLevelsSection experienceLevels={pathway.experienceLevels} />
          )}
          {pathway.certifications && (
            <CertificationsSection certifications={pathway.certifications} />
          )}
        </div>
      </div>
    </div>
  );
};

const NavigationBackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center text-gray-400 hover:text-primary transition-colors mb-8"
    aria-label="Go back"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 mr-2"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
        clipRule="evenodd"
      />
    </svg>
    Back to Pathways
  </button>
);

const PathwayHeader = ({ pathway }) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex flex-col md:flex-row gap-8"
  >
    <div className="w-full md:w-1/3">
      <PathwayImage image={pathway.image} title={pathway.title} />
    </div>
    <div className="w-full md:w-2/3">
      <h1 className="text-3xl font-bold mb-2 text-white">{pathway.title}</h1>
      <PathwayStats growth={pathway.growth} salary={pathway.salary} />
      <p className="text-gray-300 mb-6">{pathway.description}</p>
    </div>
  </motion.section>
);

const PathwayImage = ({ image, title }) => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square border border-gray-700/50 shadow-lg shadow-primary/20 relative group">
    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-10 pointer-events-none" />
    <img
      src={image}
      alt={`${title} career pathway`}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      onError={(e) => {
        e.target.src = '/pathway-fallback.jpg';
        e.target.className = 'w-full h-full object-contain bg-gray-800 p-4';
      }}
    />
  </div>
);

const PathwayStats = ({ growth, salary }) => (
  <div className="flex flex-wrap items-center gap-4 mb-6">
    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50 shadow-inner">
      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
      <span className="text-sm text-gray-200 font-medium">{growth}% job growth</span>
    </div>
    <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50 shadow-inner">
      <span className="text-primary font-bold">{salary}</span>
      <span className="text-gray-400 text-xs uppercase tracking-wider mt-0.5">avg. salary</span>
    </div>
  </div>
);


const SkillsSection = ({ skills }) => (
  <DetailSection title="Key Skills Required" delay={0.2}>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span key={index} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
          {skill}
        </span>
      ))}
    </div>
  </DetailSection>
);

const ResponsibilitiesSection = ({ responsibilities }) => (
  <DetailSection title="Typical Responsibilities" delay={0.3} listStyle>
    <ul className="space-y-2">
      {responsibilities.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span className="text-gray-300">{item}</span>
        </li>
      ))}
    </ul>
  </DetailSection>
);

const EducationSection = ({ education }) => (
  <DetailSection title="Education Requirements" delay={0.4}>
    <p className="text-gray-300">{education}</p>
  </DetailSection>
);

const CompaniesSection = ({ companies }) => (
  <DetailSection title="Top Hiring Companies" delay={0.5}>
    <div className="flex flex-wrap gap-2">
      {companies.map((company, index) => (
        <span key={index} className="px-3 py-1 text-sm rounded-full bg-gray-800 text-gray-300">
          {company}
        </span>
      ))}
    </div>
  </DetailSection>
);

const ExperienceLevelsSection = ({ experienceLevels }) => (
  <DetailSection title="Experience Levels" delay={0.6}>
    <div className="space-y-3">
      {Object.entries(experienceLevels).map(([level, description]) => (
        <div key={level} className="border-l-2 border-primary pl-3">
          <h3 className="text-primary font-medium capitalize">{level}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      ))}
    </div>
  </DetailSection>
);

const CertificationsSection = ({ certifications }) => (
  <DetailSection title="Recommended Certifications" delay={0.7}>
    <ul className="space-y-2">
      {certifications.map((cert, index) => (
        <li key={index} className="flex items-start">
          <span className="text-primary mr-2">•</span>
          <span className="text-gray-300">{cert}</span>
        </li>
      ))}
    </ul>
  </DetailSection>
);

const DetailSection = ({ title, children, delay = 0, listStyle = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    className="bg-gray-900/40 backdrop-blur-md border border-gray-700/50 rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
  >
    <h2 className="text-xl font-bold mb-5 text-white flex items-center gap-2">
      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
      {title}
    </h2>
    {children}
  </motion.div>
);

export default PathwayDetails;
