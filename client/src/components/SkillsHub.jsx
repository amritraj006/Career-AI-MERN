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
    <section className="py-16 md:py-24 bg-white relative text-gray-900">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Build <span className="text-primary">In-Demand Skills</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Develop the most sought-after skills in today's job market
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          {skills.map((skill, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                skill.demand === "Very High" 
                  ? "bg-primary/5 border-primary/30" 
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-white shadow-sm border border-gray-100">
                  {skill.icon}
                </div>
                <h3 className="font-bold">{skill.name}</h3>
              </div>
              <div className="space-y-3">
                {skill.skills.map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
              {skill.demand === "Very High" && (
                <div className="mt-4 text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full inline-block">
                  🔥 VERY HIGH DEMAND
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Learning Resources */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-6 text-center">Recommended Learning Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 hover:shadow-md hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${
                    resource.type === "course" ? "bg-blue-50 text-blue-600" :
                    resource.type === "book" ? "bg-purple-50 text-purple-600" :
                    "bg-green-50 text-green-600"
                  }`}>
                    {resource.type === "course" ? "📚" : 
                     resource.type === "book" ? "📖" : "🎓"}
                  </div>
                  <div>
                    <h4 className="font-medium">{resource.title}</h4>
                    <p className="text-sm text-gray-500">{resource.provider}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                    {resource.level}
                  </span>
                  <button 
                    className="text-sm text-primary font-medium hover:underline"
                    onClick={() => openModal(resource)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <button 
            onClick={()=> {navigate('/resources');scrollTo(0,0)}}
            className="px-8 py-3.5 bg-primary hover:bg-primary-dull text-white rounded-full font-medium shadow-md transition-all"
          >
            View All Learning Resources
          </button>
        </div>
      </div>

      {/* Resource Details Modal */}
      {isModalOpen && selectedResource && (
        <div
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
          onClick={closeModal}
        >
          <div
            className="bg-white border border-gray-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-lg text-2xl ${
                  selectedResource.type === "course" ? "bg-blue-50 text-blue-600" :
                  selectedResource.type === "book" ? "bg-purple-50 text-purple-600" :
                  "bg-green-50 text-green-600"
                }`}>
                  {selectedResource.type === "course" ? "📚" : 
                   selectedResource.type === "book" ? "📖" : "🎓"}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedResource.title}</h3>
                  <p className="text-gray-500 font-medium">{selectedResource.provider}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Level</p>
                  <p className="font-semibold">{selectedResource.level}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Duration</p>
                  <p className="font-semibold">{selectedResource.duration}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rating</p>
                  <p className="font-semibold">{selectedResource.rating}</p>
                </div>
                <div className="bg-gray-50 border border-gray-100 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Type</p>
                  <p className="font-semibold capitalize">{selectedResource.type}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">Description</h4>
                <p className="text-gray-700 leading-relaxed">{selectedResource.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SkillsHub;