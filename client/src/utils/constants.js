export const domains = [
  { id: 'webdev', name: 'Web Development', icon: '🌐' },
  { id: 'datascience', name: 'Data Science', icon: '📊' },
  { id: 'cybersecurity', name: 'Cybersecurity', icon: '🔒' },
  { id: 'cloud', name: 'Cloud Computing', icon: '☁️' },
  { id: 'blockchain', name: 'Blockchain', icon: '⛓️' },
  { id: 'ai', name: 'Artificial Intelligence', icon: '🤖' },
  { id: 'mobile', name: 'Mobile Development', icon: '📱' },
  { id: 'devops', name: 'DevOps', icon: '🔧' }
];

export const levelDescriptions = {
  beginner: 'You have early interest and a starting foundation. Focus on core concepts, consistency, and hands-on practice.',
  intermediate: 'You have usable fundamentals and are ready to deepen your skills through structured projects and real-world problem solving.',
  advanced: 'You show strong applied capability and should now emphasize system design, optimization, and portfolio-quality execution.',
  expert: 'You demonstrate high readiness for complex work. Continue refining leadership, architecture, and domain specialization.'
};

export const domainInsights = {
  webdev: {
    strengths: ['UI implementation', 'responsive thinking', 'frontend problem solving'],
    improvement: ['performance optimization', 'security best practices', 'system design depth'],
    nextSteps: ['Build and deploy a full-stack project', 'Practice React performance and API integration', 'Learn testing and web security fundamentals']
  },
  datascience: {
    strengths: ['data analysis mindset', 'pattern recognition', 'statistical thinking'],
    improvement: ['model evaluation', 'feature engineering', 'production-ready workflows'],
    nextSteps: ['Complete an end-to-end data project', 'Strengthen SQL, pandas, and visualization skills', 'Practice model validation and storytelling with data']
  },
  cybersecurity: {
    strengths: ['security awareness', 'risk thinking', 'defensive mindset'],
    improvement: ['network security depth', 'incident response practice', 'tool familiarity'],
    nextSteps: ['Set up a home lab for security practice', 'Study common vulnerabilities and mitigations', 'Work through CTFs or security labs consistently']
  },
  cloud: {
    strengths: ['infrastructure thinking', 'service selection', 'deployment awareness'],
    improvement: ['cost optimization', 'resilience design', 'automation depth'],
    nextSteps: ['Deploy a project on AWS, Azure, or GCP', 'Learn IAM, networking, and monitoring basics', 'Automate infrastructure with Terraform or similar tools']
  },
  blockchain: {
    strengths: ['distributed systems curiosity', 'protocol awareness', 'problem-solving'],
    improvement: ['smart contract security', 'ecosystem tooling', 'practical architecture'],
    nextSteps: ['Build a simple dApp or smart contract project', 'Study wallet, gas, and token standards carefully', 'Practice auditing basic contract logic']
  },
  ai: {
    strengths: ['model intuition', 'applied experimentation', 'learning agility'],
    improvement: ['evaluation rigor', 'data quality discipline', 'deployment understanding'],
    nextSteps: ['Ship a small AI-powered application', 'Practice prompt design and model evaluation', 'Learn vector search, APIs, and responsible AI basics']
  },
  mobile: {
    strengths: ['app flow thinking', 'user experience awareness', 'platform fundamentals'],
    improvement: ['performance tuning', 'state management', 'release readiness'],
    nextSteps: ['Build and publish a mobile portfolio app', 'Practice API integration and offline handling', 'Learn testing, accessibility, and app performance tuning']
  },
  devops: {
    strengths: ['automation mindset', 'delivery awareness', 'systems thinking'],
    improvement: ['observability depth', 'container orchestration', 'security automation'],
    nextSteps: ['Create a CI/CD pipeline for a sample app', 'Practice Docker, Kubernetes, and monitoring tools', 'Learn infrastructure as code and deployment rollback strategies']
  }
};
