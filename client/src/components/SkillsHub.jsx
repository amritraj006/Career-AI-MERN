import { motion } from 'framer-motion';
import { Code, BarChart2, Users, Cpu, BookOpen, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SkillsHub = () => {
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const skills = [
    {
      name: "Programming",
      icon: <Code className="w-5 h-5" />,
      skills: ["Python", "JavaScript", "Java"],
      demand: "Very High"
    },
    {
      name: "Data Analysis",
      icon: <BarChart2 className="w-5 h-5" />,
      skills: ["SQL", "Excel", "Tableau"],
      demand: "High"
    },
    {
      name: "Leadership",
      icon: <Users className="w-5 h-5" />,
      skills: ["Management", "Communication", "Teamwork"],
      demand: "High"
    },
    {
      name: "AI/ML",
      icon: <Cpu className="w-5 h-5" />,
      skills: ["TensorFlow", "PyTorch", "NLP"],
      demand: "Very High"
    },
    {
      name: "Continuous Learning",
      icon: <BookOpen className="w-5 h-5" />,
      skills: ["Research", "Adaptability", "Curiosity"],
      demand: "Essential"
    }
  ];

  const resources = [
    {
      title: "Python Crash Course",
      type: "book",
      provider: "No Starch Press",
      level: "Beginner",
      description: "A fast-paced, comprehensive introduction to Python programming that will have you writing programs, solving problems, and making things that work in no time.",
      duration: "10 hours",
      rating: "4.7/5",
      link: "#"
    },
    {
      title: "Data Science Specialization",
      type: "course",
      provider: "Coursera",
      level: "Intermediate",
      description: "This specialization covers the concepts and tools you'll need throughout the entire data science pipeline, from asking the right kinds of questions to making inferences and publishing results.",
      duration: "3 months",
      rating: "4.8/5",
      link: "#"
    },
    {
      title: "Leadership Workshop",
      type: "workshop",
      provider: "LinkedIn Learning",
      level: "All Levels",
      description: "Learn the essential skills to become an effective leader, including how to motivate teams, communicate vision, and manage conflict in the workplace.",
      duration: "6 hours",
      rating: "4.5/5",
      link: "#"
    }
  ];

  const openModal = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  return (
    <section className="py-16 md:py-24 bg-gray-950 relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Build <span className="text-primary">In-Demand Skills</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Develop the most sought-after skills in today's job market
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`p-6 rounded-xl border ${
                skill.demand === "Very High" 
                  ? "bg-primary/10 border-primary/30" 
                  : "bg-gray-900/50 border-gray-700"
              } hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-gray-800">
                  {skill.icon}
                </div>
                <h3 className="font-bold">{skill.name}</h3>
              </div>
              <div className="space-y-3">
                {skill.skills.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              {skill.demand === "Very High" && (
                <div className="mt-4 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">
                  🔥 VERY HIGH DEMAND
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Learning Resources */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">Recommended Learning Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    resource.type === "course" ? "bg-blue-500/10 text-blue-400" :
                    resource.type === "book" ? "bg-purple-500/10 text-purple-400" :
                    "bg-green-500/10 text-green-400"
                  }`}>
                    {resource.type === "course" ? "📚" : 
                     resource.type === "book" ? "📖" : "🎓"}
                  </div>
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-400">{resource.provider}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded-full">
                    {resource.level}
                  </span>
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => openModal(resource)}
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          className="text-center mt-16"
        >
          <button onClick={()=> {navigate('/resources');scrollTo(0,0)}}
          className="px-8 py-3.5 bg-primary hover:bg-primary-dull rounded-full font-medium shadow-lg shadow-primary/20 transition-all">
            View All Learning Resources
          </button>
        </motion.div>
      </div>

      {/* Resource Details Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-700 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-800 transition-colors"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            {selectedResource && (
              <div className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className={`p-3 rounded-lg text-2xl ${
                    selectedResource.type === "course" ? "bg-blue-500/10 text-blue-400" :
                    selectedResource.type === "book" ? "bg-purple-500/10 text-purple-400" :
                    "bg-green-500/10 text-green-400"
                  }`}>
                    {selectedResource.type === "course" ? "📚" : 
                     selectedResource.type === "book" ? "📖" : "🎓"}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedResource.title}</h3>
                    <p className="text-gray-400">{selectedResource.provider}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Level</p>
                    <p className="font-medium">{selectedResource.level}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="font-medium">{selectedResource.duration}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Rating</p>
                    <p className="font-medium">{selectedResource.rating}</p>
                  </div>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="font-medium capitalize">{selectedResource.type}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-semibold mb-2">Description</h4>
                  <p className="text-gray-300">{selectedResource.description}</p>
                </div>

                
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default SkillsHub;