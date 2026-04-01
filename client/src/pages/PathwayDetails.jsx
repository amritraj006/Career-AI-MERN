import { useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { pathways } from '../assets/pathwaysData';
import LoadingSpinner from '../components/LoadingSpinner';

const PathwayDetails = () => {
  const { pathwayId } = useParams();
  const navigate = useNavigate();

  const pathway = useMemo(() => pathways.find(p => p.id === pathwayId), [pathwayId]);

  useEffect(() => {
    if (!pathway) {
      toast.error('Pathway not found');
      const timer = setTimeout(() => navigate('/pathways', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathway, navigate]);

  if (!pathway) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 text-gray-900 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <Toaster position="top-center" richColors />
        <NavigationBackButton onClick={() => {navigate('/pathways'); window.scrollTo(0, 0)}} />
        
        <PathwayHeader pathway={pathway} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
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
    className="inline-flex items-center text-gray-500 hover:text-primary font-medium transition-colors"
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
  <section className="flex flex-col md:flex-row gap-8 items-start bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
    <div className="w-full md:w-1/3 flex-shrink-0">
      <PathwayImage image={pathway.image} title={pathway.title} />
    </div>
    <div className="w-full md:w-2/3 flex flex-col justify-center">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">{pathway.title}</h1>
      <PathwayStats growth={pathway.growth} salary={pathway.salary} />
      <p className="text-gray-600 leading-relaxed text-lg">{pathway.description}</p>
    </div>
  </section>
);

const PathwayImage = ({ image, title }) => (
  <div className="bg-gray-100 rounded-xl overflow-hidden aspect-video md:aspect-square border border-gray-200 shadow-sm relative group w-full">
    <img
      src={image}
      alt={`${title} career pathway`}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      loading="lazy"
      onError={(e) => {
        e.target.src = '/pathway-fallback.jpg';
        e.target.className = 'w-full h-full object-cover bg-gray-50';
      }}
    />
  </div>
);

const PathwayStats = ({ growth, salary }) => (
  <div className="flex flex-wrap items-center gap-4 mb-6">
    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100 shadow-sm text-green-800">
      <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
      <span className="text-sm font-semibold">{growth}% job growth</span>
    </div>
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm text-blue-900">
      <span className="font-bold text-lg">{salary}</span>
      <span className="text-xs uppercase font-medium tracking-wider opacity-80">avg. salary</span>
    </div>
  </div>
);

const SkillsSection = ({ skills }) => (
  <DetailSection title="Key Skills Required">
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span key={index} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-primary/10 text-primary border border-primary/20">
          {skill}
        </span>
      ))}
    </div>
  </DetailSection>
);

const ResponsibilitiesSection = ({ responsibilities }) => (
  <DetailSection title="Typical Responsibilities">
    <ul className="space-y-3">
      {responsibilities.map((item, index) => (
        <li key={index} className="flex items-start text-gray-700">
          <span className="text-primary mr-3 mt-1 font-bold">•</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  </DetailSection>
);

const EducationSection = ({ education }) => (
  <DetailSection title="Education Requirements">
    <p className="text-gray-700 leading-relaxed">{education}</p>
  </DetailSection>
);

const CompaniesSection = ({ companies }) => (
  <DetailSection title="Top Hiring Companies">
    <div className="flex flex-wrap gap-2">
      {companies.map((company, index) => (
        <span key={index} className="px-3 py-1.5 text-sm font-medium rounded-lg bg-gray-100 border border-gray-200 text-gray-800 shadow-sm">
          {company}
        </span>
      ))}
    </div>
  </DetailSection>
);

const ExperienceLevelsSection = ({ experienceLevels }) => (
  <DetailSection title="Experience Levels">
    <div className="space-y-4">
      {Object.entries(experienceLevels).map(([level, description]) => (
        <div key={level} className="border-l-4 border-primary/40 pl-4 py-1">
          <h3 className="text-gray-900 font-bold capitalize mb-1">{level}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
      ))}
    </div>
  </DetailSection>
);

const CertificationsSection = ({ certifications }) => (
  <DetailSection title="Recommended Certifications">
    <ul className="space-y-3">
      {certifications.map((cert, index) => (
        <li key={index} className="flex items-start text-gray-700">
          <span className="text-primary mr-3 mt-1 font-bold">•</span>
          <span className="leading-relaxed">{cert}</span>
        </li>
      ))}
    </ul>
  </DetailSection>
);

const DetailSection = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
    <h2 className="text-xl font-bold mb-5 text-gray-900 flex items-center gap-3 pb-3 border-b border-gray-100">
      <div className="w-1.5 h-6 bg-primary rounded-full"></div>
      {title}
    </h2>
    <div className="flex-grow">
      {children}
    </div>
  </div>
);

export default PathwayDetails;
