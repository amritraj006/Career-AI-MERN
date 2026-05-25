import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";
import { ArrowLeft, Sparkles, Code2, Layers, Users } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Amrit Raj",
    role: "Team Lead",
    bio: "Handles backend development and project coordination. Ensures smooth integration between frontend and backend.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQGjrun6J6XnEA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696413288165?e=1757548800&v=beta&t=Advuzq3N8FmLLWlPhICpLS1dY7nmd4LnEyQsXr2WX1U",
    github: "https://www.linkedin.com/in/amrit-raj-54652b294/",
    linkedin: "https://linkedin.com/in/amritraj",
    email: "amritraj23@lpu.in",
    color: "bg-primary",
    initials: "AR",
  },
  {
    id: 2,
    name: "Harsh Kumar",
    role: "Frontend Developer",
    bio: "Focuses on UI/UX and React components. Implements responsive designs and user interactions.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQHFrUYNyV2_Yw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1689089288664?e=1757548800&v=beta&t=EW6CpR10wJryLvWTlxUtJpEawlfD-YuFxoLmy5br47w",
    github: "https://github.com/harshkumar",
    linkedin: "https://www.linkedin.com/in/harshkumar-0001-/",
    email: "harsh@careerai.com",
    color: "bg-violet-500",
    initials: "HK",
  },
  {
    id: 3,
    name: "Vaibhav Tiwari",
    role: "Full Stack Developer",
    bio: "Works on both frontend and backend features. Implements core functionality and API integrations.",
    image: "https://media.licdn.com/dms/image/v2/D5603AQGxl9imYRmQKg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718318372649?e=1757548800&v=beta&t=jkDtlqxFOvrbARrgZ792dxaTXAT3sCqsoPClg9ZFQjg",
    github: "https://github.com/vaibhavtiwari",
    linkedin: "https://www.linkedin.com/in/vaibhav-tiwari-664444284/",
    email: "vaibhav@careerai.com",
    color: "bg-emerald-500",
    initials: "VT",
  },
];

const stats = [
  { icon: Users, label: "Active Users", value: "2,000+" },
  { icon: Sparkles, label: "AI Features", value: "6" },
  { icon: Layers, label: "Career Paths", value: "100+" },
  { icon: Code2, label: "Lines of Code", value: "15,000+" },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* Page Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-10">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 font-semibold mb-6 transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">About CareerAI</h1>
          </div>
          <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
            A student-built, AI-powered career guidance platform helping thousands discover their perfect career paths.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-5 text-center hover:shadow-md transition-shadow">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
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
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-600`}>
                      {member.role}
                    </span>
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
