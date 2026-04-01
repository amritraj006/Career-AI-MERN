import { Github, Twitter, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Github size={20} aria-label="GitHub" />, url: "#" },
    { icon: <Twitter size={20} aria-label="Twitter" />, url: "#" },
    { icon: <Linkedin size={20} aria-label="LinkedIn" />, url: "#" }
  ];

  const quickLinks = [
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookies", path: "/cookies" }
  ];

  const exploreLinks = [
    { name: "Courses", path: "/resources" },
    { name: "Pathways", path: "/pathways" },
    { name: "Roadmap Generator", path: "/career" },
    { name: "Dashboard", path: "/my-dashboard" }
  ];

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Information */}
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-3 mb-4 group">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="white" 
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">CareerAI</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-md">
            Empowering career growth through AI-driven skill assessments and personalized learning pathways to help you achieve your professional goals.
          </p>
          <div className="flex gap-4 mt-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label={social.icon.props['aria-label']}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="space-y-4">
          <h3 className="text-gray-900 font-semibold text-lg tracking-tight">Quick Links</h3>
          <nav className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-500 hover:text-primary text-sm font-medium transition-colors duration-200 w-fit"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Explore Section */}
        <div className="space-y-4">
          <h3 className="text-gray-900 font-semibold text-lg tracking-tight">Explore</h3>
          <nav className="flex flex-col gap-3">
            {exploreLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-500 hover:text-primary text-sm font-medium transition-colors duration-200 w-fit"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="max-w-7xl mx-auto border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
        <p>© {currentYear} CareerAI. All rights reserved.</p>
        <p className="text-center md:text-right font-medium">
          Crafted with <span className="text-primary">♥</span> for Smart India Hackathon
        </p>
      </div>
    </footer>
  );
};

export default Footer;