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
  const [subscriptionStatus, setSubscriptionStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pathway = useMemo(() => pathways.find(p => p.id === pathwayId), [pathwayId]);

  useEffect(() => {
    if (!pathway) {
      toast.error('Pathway not found');
      const timer = setTimeout(() => navigate('/pathways', { replace: true }), 1500);
      return () => clearTimeout(timer);
    }
  }, [pathway, navigate]);

  useEffect(() => {
    const checkSubscription = async () => {
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress && pathwayId) {
        try {
          const res = await fetch(`${url}/api/user-pathways?email=${user.primaryEmailAddress.emailAddress}`);
          const data = await res.json();
          const isSubscribed = data.pathwayIds?.includes(pathwayId);
          setSubscriptionStatus(isSubscribed);
          localStorage.setItem(`subscribed-${user.id}-${pathwayId}`, isSubscribed.toString());
        } catch (err) {
          console.error("Failed to check subscription:", err);
        }
      }
    };
    checkSubscription();
  }, [isSignedIn, user, pathwayId]);

  const handleSubscription = async () => {
    if (!isSignedIn) {
      return toast.error('Please sign in to subscribe to pathway updates', {
        action: {
          label: 'Sign In',
          onClick: () => navigate('/sign-in'),
        },
      });
    }

    setIsLoading(true);
    const newStatus = !subscriptionStatus;

    try {
      const response = await fetch(`${url}/api/pathway-subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.primaryEmailAddress.emailAddress,
          pathwayId,
          subscribed: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Subscription update failed');

      setSubscriptionStatus(newStatus);
      localStorage.setItem(`subscribed-${user.id}-${pathwayId}`, newStatus.toString());

      toast.success(
        newStatus
          ? 'Subscribed to pathway updates!'
          : 'Unsubscribed from pathway updates',
        { icon: <CheckCircle className="text-green-500" /> }
      );
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to update subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!pathway) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen pt-20 md:pt-50 bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <BlurCircle top='-80px' right='100px' />
      <BlurCircle bottom='-80px' left='200px' />
      <BlurCircle top='-10px' left='100px' />
      <div className="relative max-w-5xl mx-auto">
        <Toaster position="top-center" richColors />
        <NavigationBackButton onClick={() => {navigate('/pathways'); scrollTo(0, 0)}} />
        <PathwayHeader
          pathway={pathway}
          isSignedIn={isSignedIn}
          subscriptionStatus={subscriptionStatus}
          isLoading={isLoading}
          onSubscribe={handleSubscription}
          pathwayId={pathwayId}
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

const PathwayHeader = ({ pathway, isSignedIn, subscriptionStatus, isLoading, onSubscribe, pathwayId }) => (
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
      <SubscriptionButton
        isSignedIn={isSignedIn}
        status={subscriptionStatus}
        loading={isLoading}
        onClick={onSubscribe}
        pathwayId={pathwayId}
      />
    </div>
  </motion.section>
);

const PathwayImage = ({ image, title }) => (
  <div className="bg-gray-900 rounded-xl overflow-hidden aspect-square">
    <img
      src={image}
      alt={`${title} career pathway`}
      className="w-full h-full object-cover"
      loading="lazy"
      onError={(e) => {
        e.target.src = '/pathway-fallback.jpg';
        e.target.className = 'w-full h-full object-contain bg-gray-800 p-4';
      }}
    />
  </div>
);

const PathwayStats = ({ growth, salary }) => (
  <div className="flex items-center gap-4 mb-4">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
      <span className="text-sm text-gray-300">{growth}% job growth</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-primary font-medium">{salary}</span>
      <span className="text-gray-500 text-sm">average salary</span>
    </div>
  </div>
);

const SubscriptionButton = ({ isSignedIn, status, loading, onClick, pathwayId }) => {
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal" afterSignInUrl={`/pathways/${pathwayId}`}>
        <button
          className="px-6 py-3 rounded-lg font-medium transition-colors bg-primary hover:bg-primary-dull text-white"
          aria-label="Sign in to subscribe"
        >
          Sign In to Subscribe
        </button>
      </SignInButton>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`px-6 py-3 rounded-lg font-medium transition-colors ${
        status
          ? 'bg-green-900 text-green-400 hover:bg-green-800'
          : 'bg-primary hover:bg-primary-dull text-white'
      } disabled:opacity-70`}
      aria-label={status ? 'Unsubscribe' : 'Subscribe for updates'}
    >
      {loading ? 'Processing...' : status ? 'Subscribed' : 'Subscribe for Updates'}
    </button>
  );
};

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
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay }}
    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
  >
    <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>
    {children}
  </motion.div>
);

export default PathwayDetails;
