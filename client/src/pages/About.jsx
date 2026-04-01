import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaGithub, FaEnvelope, FaHome } from "react-icons/fa";

const About = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      id: 1,
      name: "Amrit Raj",
      role: "Team Lead",
      bio: "Handles backend development and project coordination. Ensures smooth integration between frontend and backend.",
      image: "https://media.licdn.com/dms/image/v2/D5603AQGjrun6J6XnEA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1696413288165?e=1757548800&v=beta&t=Advuzq3N8FmLLWlPhICpLS1dY7nmd4LnEyQsXr2WX1U",
      github: "https://www.linkedin.com/in/amrit-raj-54652b294/",
      linkedin: "https://linkedin.com/in/amritraj",
      email: "amritraj23@lpu.in"
    },
    {
      id: 2,
      name: "Harsh Kumar",
      role: "Frontend Developer",
      bio: "Focuses on UI/UX and React components. Implements responsive designs and user interactions.",
      image: "https://media.licdn.com/dms/image/v2/D5603AQHFrUYNyV2_Yw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1689089288664?e=1757548800&v=beta&t=EW6CpR10wJryLvWTlxUtJpEawlfD-YuFxoLmy5br47w",
      github: "https://github.com/harshkumar",
      linkedin: "https://www.linkedin.com/in/harshkumar-0001-/",
      email: "harsh@careerai.com"
    },
    {
      id: 3,
      name: "Vaibhav Tiwari",
      role: "Full Stack Developer",
      bio: "Works on both frontend and backend features. Implements core functionality and API integrations.",
      image: "https://media.licdn.com/dms/image/v2/D5603AQGxl9imYRmQKg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1718318372649?e=1757548800&v=beta&t=jkDtlqxFOvrbARrgZ792dxaTXAT3sCqsoPClg9ZFQjg",
      github: "https://github.com/vaibhavtiwari",
      linkedin: "https://www.linkedin.com/in/vaibhav-tiwari-664444284/",
      email: "vaibhav@careerai.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Home Button */}
        <button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 bg-white p-4 rounded-full shadow-lg z-50 hover:bg-indigo-50 transition-colors hover:shadow-xl transform hover:-translate-y-1"
        >
          <FaHome className="text-indigo-600 text-xl" />
        </button>

        {/* Header */}
        <div className="text-center mb-16 fade-in pt-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
            About <span className="text-indigo-600">Career AI</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600 font-medium">
            A student project to help job seekers with AI-powered career guidance
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-20 slide-up">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50"
              >
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 mb-6 group cursor-pointer">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <span className="text-lg font-bold mb-4 text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider text-xs">{member.role}</span>
                  <p className="text-gray-600 text-center mb-8 leading-relaxed">{member.bio}</p>

                  <div className="flex space-x-5">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 transition-colors transform hover:scale-110">
                      <FaLinkedin size={24} />
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors transform hover:scale-110">
                      <FaGithub size={24} />
                    </a>
                    <a href={`mailto:${member.email}`} className="text-gray-500 hover:text-primary transition-colors transform hover:scale-110">
                      <FaEnvelope size={24} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Description */}
        <div className="bg-white rounded-2xl shadow-lg p-10 mb-16 border border-blue-50 slide-up">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">About Our Project</h2>
          <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            Career AI is our full-stack project developed as part of our academic curriculum. 
            It combines frontend technologies with backend services to provide career recommendations 
            and job search assistance using AI algorithms.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Want to see our work?</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-full text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 inline-flex items-center gap-2"
          >
            <FaHome className="text-xl" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
