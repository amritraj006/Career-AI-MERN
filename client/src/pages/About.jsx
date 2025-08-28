import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const cardHoverVariants = {
    hover: { y: -10, boxShadow: "0 15px 30px rgba(0,0,0,0.15)", transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Home Button */}
        <motion.button
          onClick={() => navigate("/")}
          className="fixed top-6 left-6 bg-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-50 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FaHome className="text-indigo-600 text-xl" />
        </motion.button>

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-4">
            About <span className="text-indigo-600">Career AI</span>
          </h1>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            A student project to help job seekers with AI-powered career guidance
          </p>
        </motion.div>

        {/* Team Section */}
        <motion.div className="mb-20" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.h2 className="text-3xl font-bold text-center text-gray-800 mb-12" variants={itemVariants}>
            Meet Our Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <motion.div
                key={member.id}
                className="bg-white rounded-xl overflow-hidden shadow-md p-6"
                variants={itemVariants}
                whileHover={cardHoverVariants.hover}
              >
                <div className="flex flex-col items-center">
                  <motion.div
                    className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-100 mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <span className="text-lg font-medium mb-4 text-indigo-500">{member.role}</span>
                  <p className="text-gray-600 text-center mb-6">{member.bio}</p>

                  <div className="flex space-x-4">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      <FaLinkedin size={20} />
                    </a>
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                      <FaGithub size={20} />
                    </a>
                    <a href={`mailto:${member.email}`} className="text-gray-600 hover:text-gray-800">
                      <FaEnvelope size={20} />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Project Description */}
        <motion.div className="bg-white rounded-xl shadow-lg p-8 mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">About Our Project</h2>
          <p className="text-xl text-gray-600 text-center max-w-4xl mx-auto">
            Career AI is our full-stack project developed as part of our academic curriculum. 
            It combines frontend technologies with backend services to provide career recommendations 
            and job search assistance using AI algorithms.
          </p>
        </motion.div>

        {/* Call to Action */}
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Want to see our work?</h2>
          <motion.button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full text-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
