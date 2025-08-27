const preDefinedQuestions = {
    webdev: [
  {
    question: "How would you architect a large-scale React application to ensure maintainability and performance?",
    options: [
      { text: "I'd create a custom framework with SSR, code splitting, and advanced caching", score: 4 },
      { text: "I'd use create-react-app with standard folder structure", score: 1 },
      { text: "I'd design a micro-frontend architecture with state management", score: 3 },
      { text: "I'd implement feature-based organization with lazy loading", score: 2 },
    ]
  },
  {
    question: "When implementing a complex form with 50+ fields, how would you optimize performance and UX?",
    options: [
      { text: "I'd design a custom form engine with incremental saving, conflict resolution, and offline support", score: 4 },
      { text: "I'd use standard form elements with basic validation", score: 1 },
      { text: "I'd use controlled components with debounced validation and virtualization", score: 3 },
      { text: "I'd implement field grouping and basic lazy rendering", score: 2 },

    ]
  },
  {
    question: "How would you handle state management for a real-time collaborative editing application?",
    options: [
      { text: "I'd design a custom CRDT implementation with differential synchronization", score: 4 },
      { text: "I'd use React context or Redux", score: 1 },
      { text: "I'd implement WebSockets with basic conflict resolution", score: 2 },
      { text: "I'd use operational transforms with version vectors", score: 3 },
      
    ]
  },
  {
    question: "What strategies would you use to reduce a complex web app's bundle size by 60%?",
    options: [
      { text: "I'd enable basic code splitting", score: 1 },
      { text: "I'd optimize with lazy loading, asset compression, and bundle analysis", score: 3 },
      { text: "I'd analyze dependencies and implement tree shaking", score: 2 },
      { text: "I'd implement module federation, WASM, and custom build optimizations", score: 4 }
    ]
  },
  {
    question: "How would you design an authentication system for a high-security financial application?",
    options: [
      
      { text: "I'd implement session tokens with HttpOnly cookies", score: 2 },
      { text: "I'd use JWT with localStorage", score: 1 },
      { text: "I'd design a multi-factor system with hardware tokens, anomaly detection, and step-up authentication", score: 4 },
      { text: "I'd use OAuth 2.0 with PKCE and short-lived tokens", score: 3 }
    ]
  },
  {
    question: "What approach would you take to make a complex dashboard render in under 1 second with 10,000 data points?",
    options: [
      { text: "I'd use Web Workers for processing and canvas rendering", score: 3 },
      { text: "I'd use standard charting libraries", score: 1 },
      { text: "I'd implement basic pagination and data sampling", score: 2 },
      { text: "I'd design a custom WebGL renderer with predictive loading and edge computing", score: 4 }
    ]
  },
  {
    question: "How would you implement a fault-tolerant WebSocket connection for a trading platform?",
    options: [
      { text: "I'd use standard WebSocket API", score: 1 },
      { text: "I'd design a queue-based system with message deduplication", score: 3 },
      { text: "I'd create a hybrid SSE/WebSocket solution with state synchronization and conflict-free replication", score: 4 },
      { text: "I'd implement basic reconnection logic", score: 2 },
    ]
  },
  {
    question: "What techniques would you use to achieve 100% Lighthouse score for a content-heavy news site?",
    options: [
      { text: "I'd optimize images and enable compression", score: 1 },
      { text: "I'd implement basic lazy loading and font optimization", score: 2 },
      { text: "I'd use SSR, edge caching, and critical CSS extraction", score: 3 },
      { text: "I'd design a PRPL pattern implementation with predictive prefetching and WASM components", score: 4 }
    ]
  },
  {
    question: "How would you design a CI/CD pipeline for a zero-downtime deployment of a global SaaS product?",
    options: [
      { text: "I'd use basic GitHub Actions or CircleCI", score: 1 },
      {text: "I'd create a multi-region deployment system with traffic shifting and dark launches", score: 4 },
      { text: "I'd implement blue-green deployment for one region", score: 2 },
      { text: "I'd design canary releases with feature flags and automated rollback", score: 3 },
      
    ]
  },
  {
    question: "What architecture would you choose for a document editor with real-time collaboration and offline support?",
    options: [
      { text: "I'd use a traditional client-server model", score: 1 },
      { text: "I'd implement basic operational transforms with local storage", score: 2 },
      { text: "I'd design a hybrid CRDT/OT system with differential synchronization and compression", score: 4 },
      { text: "I'd use CRDTs with versioned snapshots and conflict resolution", score: 3 },

    ]
  },
  {
    question: "How would you optimize a React application for 60fps animations on low-end mobile devices?",
    options: [
      { text: "I'd implement will-change and transform optimizations", score: 2 },
      { text: "I'd use React's useLayoutEffect and custom RAF-based animation loop", score: 3 },
      { text: "I'd design a WebGL-based animation system with LOD adjustments and hardware prioritization", score: 4 },
      { text: "I'd use CSS animations where possible", score: 1 },
    ]
  },
  {
    question: "What approach would you take to secure a public API against sophisticated DDoS attacks?",
    options: [
      { text: "I'd design request fingerprinting with behavioral analysis", score: 3 },
      { text: "I'd implement basic rate limiting", score: 1 },
      { text: "I'd use Cloudflare or similar CDN protection", score: 2 },
      { text: "I'd implement a multi-layered defense with AI-based anomaly detection and proof-of-work challenges", score: 4 },
    ]
  },
  {
    question: "How would you design a data synchronization system for a mobile app with intermittent connectivity?",
    options: [
      { text: "I'd use basic offline-first with periodic sync", score: 1 },
      { text: "I'd implement optimistic UI with conflict detection", score: 2 },
      { text: "I'd design a differential sync with version vectors", score: 3 },
      { text: "I'd create a CRDT-based system with operational transforms and compression", score: 4 }
    ]
  },
  {
    question: "What strategies would you use to reduce a complex SPA's Time to Interactive below 1 second?",
    options: [
      { text: "I'd enable code splitting", score: 1 },
      { text: "I'd implement route-based chunking and prefetching", score: 2 },
      { text: "I'd use SSR with progressive hydration and critical resource prioritization", score: 3 },
      { text: "I'd design a streaming SSR solution with partial hydration and WASM-based rendering", score: 4 }
    ]
  },
  {
    question: "How would you implement a real-time collaborative whiteboard with sub-millisecond latency?",
    options: [
      { text: "I'd use standard WebSockets with canvas API", score: 1 },
      { text: "I'd implement operational transforms for basic sync", score: 2 },
      { text: "I'd use WebRTC with CRDTs for P2P synchronization", score: 3 },
      { text: "I'd design a hybrid WebRTC/WebSocket solution with predictive rendering and compression", score: 4 }
    ]
  },
  {
    question: "What architecture would you choose for a global e-commerce platform with 10M+ daily users?",
    options: [
      { text: "I'd use a monolithic architecture with load balancing", score: 1 },
      { text: "I'd implement microservices for core functionality", score: 2 },
      { text: "I'd design an event-driven architecture with regional deployments", score: 3 },
      { text: "I'd create a multi-cloud serverless architecture with edge computing and global state synchronization", score: 4 }
    ]
  },
  {
    question: "How would you design an AB testing framework that can handle 1000 concurrent experiments?",
    options: [
      { text: "I'd use a basic feature flag system", score: 1 },
      { text: "I'd implement a client-side variation system", score: 2 },
      { text: "I'd design a server-side allocation system with analytics integration", score: 3 },
      { text: "I'd create a multi-armed bandit system with real-time optimization and Bayesian statistics", score: 4 }
    ]
  },
  {
    question: "What approach would you take to implement a WYSIWYG editor with complex document schemas?",
    options: [
      { text: "I'd use contentEditable with basic formatting", score: 1 },
      { text: "I'd implement a custom Slate.js or ProseMirror setup", score: 2 },
      { text: "I'd design a custom editor kernel with operational transforms", score: 3 },
      { text: "I'd create a CRDT-based editor with plugins, collaborative editing, and versioned schemas", score: 4 }
    ]
  },
  {
    question: "How would you optimize a data visualization dashboard handling 1M+ real-time updates per minute?",
    options: [
      { text: "I'd use standard charting libraries with throttling", score: 1 },
      { text: "I'd implement Web Workers for data processing", score: 2 },
      { text: "I'd use WebGL with data sampling and aggregation", score: 3 },
      { text: "I'd design a custom GPU-accelerated renderer with streaming data pipelines", score: 4 }
    ]
  },
  {
    question: "What security measures would you implement for a healthcare application handling PHI data?",
    options: [
      { text: "I'd use HTTPS and basic auth", score: 1 },
      { text: "I'd implement role-based access control", score: 2 },
      { text: "I'd design field-level encryption with audit logging", score: 3 },
      { text: "I'd create a zero-trust architecture with homomorphic encryption and hardware security modules", score: 4 }
    ]
  }
],
    datascience: [
      {
        question: "What's your experience with Python for data analysis?",
        options: [
          { text: "I'm proficient in advanced libraries and optimization", score: 4 },
          { text: "I'm just starting to learn Python", score: 1 },
          { text: "I can write basic scripts and use pandas", score: 2 },
          { text: "I'm comfortable with data manipulation and visualization", score: 3 },
        ]
      },
      {
        question: "How familiar are you with machine learning concepts?",
        options: [
          { text: "I understand basic algorithms like linear regression", score: 2 },
          { text: "I can implement various ML models and evaluate them", score: 3 },
          { text: "I've heard about it but haven't practiced", score: 1 },
          { text: "I can design and deploy production ML systems", score: 4 }
        ]
      },
      {
        question: "What's your experience with data visualization?",
        options: [
          { text: "I design comprehensive analytics solutions", score: 4 },
          { text: "I'm new to data visualization", score: 1 },
          { text: "I create interactive dashboards with Plotly or Tableau", score: 3 },
          { text: "I can create basic charts with matplotlib or seaborn", score: 2 },

        ]
      },
      {
        question: "How comfortable are you with statistics and probability?",
        options: [
          { text: "I have basic understanding of statistics", score: 1 },
          { text: "I understand advanced statistical concepts", score: 3 },
          { text: "I can design and interpret complex statistical models", score: 4 },
          { text: "I can perform hypothesis testing and analysis", score: 2 },
        ]
      },
      {
        question: "What's your experience with big data technologies?",
        options: [
          { text: "I work with small datasets in Excel/CSV", score: 1 },
          { text: "I design scalable data pipelines and architectures", score: 4 },
          { text: "I use SQL databases for data analysis", score: 2 },
          { text: "I'm familiar with Spark or Hadoop ecosystems", score: 3 },
        ]
      },
      {
        question: "How familiar are you with deep learning frameworks?",
        options: [
          { text: "I've experimented with TensorFlow/PyTorch", score: 2 },
          { text: "I've implemented neural networks for projects", score: 3 },
          { text: "I don't use deep learning", score: 1 },
          { text: "I design and optimize complex deep learning models", score: 4 },
        ]
      },
      {
        question: "What's your experience with natural language processing?",
        options: [
          { text: "I've implemented NLP models for specific tasks", score: 3 },
          { text: "I don't work with NLP", score: 1 },
          { text: "I've used basic text processing techniques", score: 2 },
          { text: "I design advanced NLP systems", score: 4 },
        ]
      },
      {
        question: "How would you approach feature engineering?",
        options: [
          { text: "I don't perform feature engineering", score: 1 },
          { text: "I design comprehensive feature pipelines", score: 4 },
          { text: "I perform basic feature selection", score: 2 },
          { text: "I create new features from existing data", score: 3 },
        ]
      },
      {
        question: "What's your experience with cloud-based data solutions?",
        options: [
          { text: "I've used basic cloud storage", score: 2 },
          { text: "I've implemented cloud-based data processing", score: 3 },
          { text: "I don't use cloud data solutions", score: 1 },
          { text: "I design complex cloud data architectures", score: 4 }
        ]
      },
      {
        question: "How familiar are you with time series analysis?",
        options: [
          { text: "I don't work with time series data", score: 1 },
          { text: "I've performed basic trend analysis", score: 2 },
          { text: "I've implemented forecasting models", score: 3 },
          { text: "I design advanced time series solutions", score: 4 }
        ]
      },
      {
        question: "What's your experience with A/B testing?",
        options: [
          { text: "I don't conduct A/B tests", score: 1 },
          { text: "I understand basic A/B testing concepts", score: 2 },
          { text: "I've designed and analyzed A/B tests", score: 3 },
          { text: "I implement complex experimental designs", score: 4 }
        ]
      },
      {
        question: "How would you handle missing data in a dataset?",
        options: [
          { text: "I remove rows with missing data", score: 1 },
          { text: "I use basic imputation techniques", score: 2 },
          { text: "I apply advanced imputation methods", score: 3 },
          { text: "I design custom solutions based on data context", score: 4 }
        ]
      },
      {
        question: "What's your experience with recommendation systems?",
        options: [
          { text: "I haven't built recommendation systems", score: 1 },
          { text: "I've implemented basic collaborative filtering", score: 2 },
          { text: "I've built hybrid recommendation systems", score: 3 },
          { text: "I design advanced personalized recommendation engines", score: 4 }
        ]
      },
      {
        question: "How familiar are you with MLOps practices?",
        options: [
          { text: "I don't use MLOps", score: 1 },
          { text: "I understand basic model deployment", score: 2 },
          { text: "I've implemented CI/CD for ML models", score: 3 },
          { text: "I design comprehensive MLOps pipelines", score: 4 }
        ]
      },
      {
        question: "What's your experience with computer vision?",
        options: [
          { text: "I don't work with computer vision", score: 1 },
          { text: "I've implemented basic image processing", score: 2 },
          { text: "I've built CNN models for vision tasks", score: 3 },
          { text: "I design advanced computer vision systems", score: 4 }
        ]
      },
      {
        question: "How would you evaluate model performance?",
        options: [
          { text: "I use basic accuracy metrics", score: 1 },
          { text: "I consider precision/recall/F1 scores", score: 2 },
          { text: "I use domain-specific evaluation metrics", score: 3 },
          { text: "I design custom evaluation frameworks", score: 4 }
        ]
      },
      {
        question: "What's your experience with graph databases?",
        options: [
          { text: "I don't use graph databases", score: 1 },
          { text: "I understand basic graph concepts", score: 2 },
          { text: "I've implemented graph-based solutions", score: 3 },
          { text: "I design complex graph analytics systems", score: 4 }
        ]
      },
      {
        question: "How familiar are you with reinforcement learning?",
        options: [
          { text: "I don't use reinforcement learning", score: 1 },
          { text: "I understand basic concepts", score: 2 },
          { text: "I've implemented RL solutions", score: 3 },
          { text: "I design advanced RL systems", score: 4 }
        ]
      },
      {
        question: "What's your experience with data storytelling?",
        options: [
          { text: "I don't focus on data storytelling", score: 1 },
          { text: "I create basic reports with insights", score: 2 },
          { text: "I craft compelling data narratives", score: 3 },
          { text: "I design interactive data storytelling experiences", score: 4 }
        ]
      },
      {
        question: "How would you approach anomaly detection?",
        options: [
          { text: "I use basic statistical methods", score: 1 },
          { text: "I implement standard algorithms", score: 2 },
          { text: "I design custom detection systems", score: 3 },
          { text: "I build real-time anomaly detection at scale", score: 4 }
        ]
      }
    ],
    cybersecurity: [
  {
    question: "Which tool would you use for packet analysis in a compromised network?",
    options: [
      { text: "Task Manager", score: 1 },
      { text: "Nmap", score: 2 },
      { text: "Wireshark", score: 3 },
      { text: "Metasploit", score: 4 }
    ]
  },
  {
    question: "What is the primary purpose of a reverse proxy in network security?",
    options: [
      { text: "To provide VPN access", score: 1 },
      { text: "To block IP addresses", score: 2 },
      { text: "To route and filter traffic", score: 3 },
      { text: "To replace firewalls", score: 4 }
    ]
  },
  {
    question: "Which encryption algorithm is asymmetric?",
    options: [
      { text: "AES", score: 1 },
      { text: "SHA-256", score: 2 },
      { text: "RSA", score: 3 },
      { text: "MD5", score: 4 }
    ]
  },
  {
    question: "What does a CVSS score indicate?",
    options: [
      { text: "The popularity of a vulnerability", score: 1 },
      { text: "The legal impact of a breach", score: 2 },
      { text: "Severity of a vulnerability", score: 3 },
      { text: "Duration to fix an issue", score: 4 }
    ]
  },
  {
    question: "What’s the primary difference between IDS and IPS?",
    options: [
      { text: "IDS encrypts data, IPS doesn’t", score: 1 },
      { text: "IDS blocks threats, IPS detects", score: 2 },
      { text: "IDS only monitors, IPS can block", score: 3 },
      { text: "IDS is for networks, IPS is for systems", score: 4 }
    ]
  },
  {
    question: "What is lateral movement in a cyberattack?",
    options: [
      { text: "Phishing multiple targets", score: 1 },
      { text: "Switching between admin tools", score: 2 },
      { text: "Expanding access across a network", score: 3 },
      { text: "Encrypting user data", score: 4 }
    ]
  },
  {
    question: "In a SIEM system, what is a 'correlation rule' used for?",
    options: [
      { text: "Encrypt logs", score: 1 },
      { text: "Store alerts", score: 2 },
      { text: "Connect related events", score: 3 },
      { text: "Delete false positives", score: 4 }
    ]
  },
  {
    question: "Which AWS service provides fine-grained access control?",
    options: [
      { text: "Amazon EC2", score: 1 },
      { text: "Amazon VPC", score: 2 },
      { text: "AWS IAM", score: 3 },
      { text: "Amazon RDS", score: 4 }
    ]
  },
  {
    question: "Which protocol is used for secure email transmission?",
    options: [
      { text: "HTTP", score: 1 },
      { text: "POP3", score: 2 },
      { text: "SMTPS", score: 3 },
      { text: "DNS", score: 4 }
    ]
  },
  {
    question: "What is a common use of a hash function in cybersecurity?",
    options: [
      { text: "Encrypting entire databases", score: 1 },
      { text: "Generating secure random numbers", score: 2 },
      { text: "Password storage verification", score: 3 },
      { text: "Establishing VPN tunnels", score: 4 }
    ]
  },
  {
    question: "What’s the main concern with open S3 buckets?",
    options: [
      { text: "High latency", score: 1 },
      { text: "Unauthorized data access", score: 2 },
      { text: "Limited file size", score: 3 },
      { text: "DNS hijacking", score: 4 }
    ]
  },
  {
    question: "How does an attacker use DNS tunneling?",
    options: [
      { text: "To block access to domains", score: 1 },
      { text: "To encrypt email data", score: 2 },
      { text: "To exfiltrate data via DNS requests", score: 3 },
      { text: "To spoof IP addresses", score: 4 }
    ]
  },
  {
    question: "What is a logic bomb in cybersecurity?",
    options: [
      { text: "A script that cleans up logs", score: 1 },
      { text: "Malware triggered by specific conditions", score: 2 },
      { text: "An antivirus tool", score: 3 },
      { text: "A secure encryption method", score: 4 }
    ]
  },
  {
    question: "What’s a best practice when handling privileged accounts?",
    options: [
      { text: "Share access with backup users", score: 1 },
      { text: "Rotate passwords periodically", score: 2 },
      { text: "Use shared credentials", score: 3 },
      { text: "Disable MFA", score: 4 }
    ]
  },
  {
    question: "Which attack exploits human psychology?",
    options: [
      { text: "DDoS", score: 1 },
      { text: "Brute force", score: 2 },
      { text: "Social engineering", score: 3 },
      { text: "SQL injection", score: 4 }
    ]
  },
  {
    question: "What is container image scanning used for?",
    options: [
      { text: "Measuring container size", score: 1 },
      { text: "Detecting runtime errors", score: 2 },
      { text: "Identifying vulnerabilities", score: 3 },
      { text: "Improving load times", score: 4 }
    ]
  },
  {
    question: "How does OAuth 2.0 help in secure API access?",
    options: [
      { text: "It blocks all unauthorized requests", score: 1 },
      { text: "It scans payloads", score: 2 },
      { text: "It delegates access via tokens", score: 3 },
      { text: "It encrypts API endpoints", score: 4 }
    ]
  },
  {
    question: "What’s a common risk when exposing APIs publicly?",
    options: [
      { text: "High storage costs", score: 1 },
      { text: "Data leakage", score: 2 },
      { text: "SSL errors", score: 3 },
      { text: "File size limits", score: 4 }
    ]
  },
  {
    question: "What technique is used in phishing site detection?",
    options: [
      { text: "Memory profiling", score: 1 },
      { text: "URL pattern matching", score: 2 },
      { text: "Hash comparison", score: 3 },
      { text: "Ping testing", score: 4 }
    ]
  },
  {
    question: "What’s the role of playbooks in incident response?",
    options: [
      { text: "Document attack history", score: 1 },
      { text: "Define compliance regulations", score: 2 },
      { text: "Provide step-by-step response procedures", score: 3 },
      { text: "Report vulnerabilities to vendors", score: 4 }
    ]
  }
    ],

    cloud: [
  {
    question: "Which cloud service is best for hosting a containerized microservice?",
    options: [
      { text: "Amazon S3", score: 1 },
      { text: "Google App Engine", score: 2 },
      { text: "AWS Fargate or GKE Autopilot", score: 3 },
      { text: "Kubernetes on multi-cloud platform", score: 4 }
    ]
  },
  {
    question: "What’s the role of IAM policies in cloud infrastructure?",
    options: [
      { text: "Monitor user traffic", score: 1 },
      { text: "Allow object storage access", score: 2 },
      { text: "Control fine-grained access to resources", score: 3 },
      { text: "Automate infrastructure provisioning", score: 4 }
    ]
  },
  {
    question: "Which of the following best describes a use case for AWS Lambda?",
    options: [
      { text: "Deploying full-stack apps", score: 1 },
      { text: "Running containers", score: 2 },
      { text: "Executing event-driven backend logic", score: 3 },
      { text: "Managing cloud infrastructure", score: 4 }
    ]
  },
  {
    question: "What strategy is most effective for migrating a database to the cloud with minimal downtime?",
    options: [
      { text: "Manual export/import", score: 1 },
      { text: "Cold migration", score: 2 },
      { text: "Live replication and cutover", score: 3 },
      { text: "Multi-region warm failover setup", score: 4 }
    ]
  },
  {
    question: "Which tool helps enforce infrastructure as code in multi-cloud environments?",
    options: [
      { text: "Bash scripting", score: 1 },
      { text: "AWS CloudFormation", score: 2 },
      { text: "Terraform", score: 3 },
      { text: "Crossplane with GitOps integration", score: 4 }
    ]
  },
  {
    question: "Which metric is most useful for evaluating cloud cost efficiency?",
    options: [
      { text: "Disk usage", score: 1 },
      { text: "CPU usage", score: 2 },
      { text: "Cost per workload or request", score: 3 },
      { text: "Cost-to-performance ratio across regions", score: 4 }
    ]
  },
  {
    question: "How would you protect sensitive environment variables in a serverless function?",
    options: [
      { text: "Hardcode them in the source file", score: 1 },
      { text: "Use environment files", score: 2 },
      { text: "Store them in a secrets manager", score: 3 },
      { text: "Encrypt with KMS and access via IAM role", score: 4 }
    ]
  },
  {
    question: "Which pattern is commonly used for scalable event processing in cloud apps?",
    options: [
      { text: "Direct database polling", score: 1 },
      { text: "REST APIs with cron triggers", score: 2 },
      { text: "Event-driven architecture with pub/sub", score: 3 },
      { text: "Serverless microservices with message queues", score: 4 }
    ]
  },
  {
    question: "Which service would best help visualize cloud application metrics?",
    options: [
      { text: "Amazon EC2", score: 1 },
      { text: "AWS CLI", score: 2 },
      { text: "CloudWatch or Azure Monitor", score: 3 },
      { text: "Grafana connected to Prometheus", score: 4 }
    ]
  },
  {
    question: "What is a common reason to use a VPC peering connection?",
    options: [
      { text: "Connect apps to the internet", score: 1 },
      { text: "Backup virtual machines", score: 2 },
      { text: "Enable secure private communication between networks", score: 3 },
      { text: "Route traffic to CDN", score: 4 }
    ]
  },
  {
    question: "How do you automate CI/CD pipelines for cloud-native apps?",
    options: [
      { text: "Manual build and deploy", score: 1 },
      { text: "Cloud shell scripts", score: 2 },
      { text: "Using tools like GitHub Actions or GitLab CI", score: 3 },
      { text: "End-to-end pipeline using ArgoCD or Tekton", score: 4 }
    ]
  },
  {
    question: "How do cloud firewalls differ from traditional firewalls?",
    options: [
      { text: "They are less secure", score: 1 },
      { text: "They block DNS traffic only", score: 2 },
      { text: "They allow dynamic, policy-based rules per service", score: 3 },
      { text: "They integrate with identity and network-level controls", score: 4 }
    ]
  },
  {
    question: "Which approach best ensures high availability in cloud applications?",
    options: [
      { text: "Deploying to a single zone", score: 1 },
      { text: "Using static IPs", score: 2 },
      { text: "Multi-AZ or multi-region deployments", score: 3 },
      { text: "Auto-scaling and global failover", score: 4 }
    ]
  },
  {
    question: "Which Kubernetes component handles node scheduling?",
    options: [
      { text: "Kubelet", score: 1 },
      { text: "Etcd", score: 2 },
      { text: "Kube-scheduler", score: 3 },
      { text: "Kube-controller-manager", score: 4 }
    ]
  },
  {
    question: "How can cloud-native apps manage configuration dynamically?",
    options: [
      { text: "Hardcoded JSON files", score: 1 },
      { text: "Local environment files", score: 2 },
      { text: "Using centralized config services like AWS Parameter Store", score: 3 },
      { text: "Dynamic secrets and service discovery mechanisms", score: 4 }
    ]
  },
  {
    question: "Which option best defines a hybrid cloud architecture?",
    options: [
      { text: "Hosting files on multiple clouds", score: 1 },
      { text: "Accessing cloud from a personal device", score: 2 },
      { text: "Integrating on-prem and public cloud workloads", score: 3 },
      { text: "Running multi-region backups", score: 4 }
    ]
  },
  {
    question: "Which technique helps optimize storage in cloud databases?",
    options: [
      { text: "Increasing instance size", score: 1 },
      { text: "Using SSDs only", score: 2 },
      { text: "Indexing and partitioning", score: 3 },
      { text: "Lifecycle policies and auto-archiving", score: 4 }
    ]
  },
  {
    question: "What’s the benefit of using edge locations in cloud CDN services?",
    options: [
      { text: "More storage", score: 1 },
      { text: "Easier scaling", score: 2 },
      { text: "Reduced latency and faster content delivery", score: 3 },
      { text: "Direct access to admin consoles", score: 4 }
    ]
  },
  {
    question: "Which service is ideal for managing secrets securely in cloud apps?",
    options: [
      { text: "S3 bucket with encryption", score: 1 },
      { text: "Environment variables", score: 2 },
      { text: "Secrets Manager / Key Vault", score: 3 },
      { text: "Vault integrated with IAM and KMS", score: 4 }
    ]
  },
  {
    question: "What’s an example of a cloud-native design pattern?",
    options: [
      { text: "Monolithic deployment", score: 1 },
      { text: "Vertical scaling", score: 2 },
      { text: "Circuit breaker for fault tolerance", score: 3 },
      { text: "Event sourcing with distributed state management", score: 4 }
    ]
  }
],

    blockchain: [
      {
        question: "What's your understanding of blockchain fundamentals?",
        options: [
          { text: "Basic awareness of concepts", score: 1 },
          { text: "Understand how blockchain works", score: 2 },
          { text: "Can explain consensus mechanisms", score: 3 },
          { text: "Expert in blockchain theory", score: 4 }
        ]
      },
      {
        question: "How familiar are you with cryptocurrencies?",
        options: [
          { text: "Basic understanding of Bitcoin", score: 1 },
          { text: "Understand multiple cryptocurrencies", score: 2 },
          { text: "Can analyze crypto economics", score: 3 },
          { text: "Expert in cryptocurrency systems", score: 4 }
        ]
      },
      {
        question: "What's your experience with smart contracts?",
        options: [
          { text: "No practical experience", score: 1 },
          { text: "Written simple smart contracts", score: 2 },
          { text: "Developed complex dApps", score: 3 },
          { text: "Expert in smart contract security", score: 4 }
        ]
      },
      {
        question: "How would you approach blockchain security?",
        options: [
          { text: "Follow basic security practices", score: 1 },
          { text: "Implement standard security measures", score: 2 },
          { text: "Design secure blockchain architectures", score: 3 },
          { text: "Expert in advanced blockchain security", score: 4 }
        ]
      },
      {
        question: "What's your experience with consensus algorithms?",
        options: [
          { text: "Basic understanding of PoW/PoS", score: 1 },
          { text: "Understand multiple consensus models", score: 2 },
          { text: "Implemented custom consensus", score: 3 },
          { text: "Expert in consensus research", score: 4 }
        ]
      },
      {
        question: "How familiar are you with decentralized applications?",
        options: [
          { text: "Basic understanding of dApps", score: 1 },
          { text: "Used existing dApps", score: 2 },
          { text: "Developed dApps", score: 3 },
          { text: "Expert in dApp architecture", score: 4 }
        ]
      },
      {
        question: "What's your experience with blockchain platforms?",
        options: [
          { text: "Basic understanding of Ethereum", score: 1 },
          { text: "Worked with multiple platforms", score: 2 },
          { text: "Developed on different platforms", score: 3 },
          { text: "Expert in platform comparisons", score: 4 }
        ]
      },
      {
        question: "How would you approach token economics?",
        options: [
          { text: "Basic understanding of tokens", score: 1 },
          { text: "Can design simple token models", score: 2 },
          { text: "Designed complex token economies", score: 3 },
          { text: "Expert in tokenomics research", score: 4 }
        ]
      },
      {
        question: "What's your experience with blockchain scalability?",
        options: [
          { text: "Basic understanding of scaling issues", score: 1 },
          { text: "Understand layer 2 solutions", score: 2 },
          { text: "Implemented scaling solutions", score: 3 },
          { text: "Expert in scaling research", score: 4 }
        ]
      },
      {
        question: "How familiar are you with DeFi protocols?",
        options: [
          { text: "Basic understanding of DeFi", score: 1 },
          { text: "Used DeFi applications", score: 2 },
          { text: "Developed DeFi protocols", score: 3 },
          { text: "Expert in DeFi architecture", score: 4 }
        ]
      },
      {
        question: "What's your experience with NFTs?",
        options: [
          { text: "Basic understanding of NFTs", score: 1 },
          { text: "Created or traded NFTs", score: 2 },
          { text: "Developed NFT platforms", score: 3 },
          { text: "Expert in NFT standards", score: 4 }
        ]
      },
      {
        question: "How would you approach blockchain interoperability?",
        options: [
          { text: "Basic understanding of bridges", score: 1 },
          { text: "Understand cross-chain protocols", score: 2 },
          { text: "Implemented interoperability solutions", score: 3 },
          { text: "Expert in interoperability research", score: 4 }
        ]
      },
      {
        question: "What's your experience with zero-knowledge proofs?",
        options: [
          { text: "Basic understanding of ZKP", score: 1 },
          { text: "Understand zk-SNARKs/zk-STARKs", score: 2 },
          { text: "Implemented ZKP solutions", score: 3 },
          { text: "Expert in ZKP research", score: 4 }
        ]
      },
      {
        question: "How familiar are you with DAOs?",
        options: [
          { text: "Basic understanding of DAOs", score: 1 },
          { text: "Participated in DAOs", score: 2 },
          { text: "Developed DAO frameworks", score: 3 },
          { text: "Expert in DAO governance", score: 4 }
        ]
      },
      {
        question: "What's your experience with blockchain analytics?",
        options: [
          { text: "Basic blockchain exploration", score: 1 },
          { text: "Used blockchain explorers", score: 2 },
          { text: "Conducted chain analysis", score: 3 },
          { text: "Expert in blockchain forensics", score: 4 }
        ]
      },
      {
        question: "How would you approach privacy in blockchain?",
        options: [
          { text: "Basic understanding of privacy coins", score: 1 },
          { text: "Understand privacy protocols", score: 2 },
          { text: "Implemented privacy solutions", score: 3 },
          { text: "Expert in privacy research", score: 4 }
        ]
      },
      {
        question: "What's your experience with enterprise blockchain?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Worked with enterprise solutions", score: 2 },
          { text: "Developed enterprise blockchains", score: 3 },
          { text: "Expert in enterprise adoption", score: 4 }
        ]
      },
      {
        question: "How familiar are you with blockchain regulations?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Understand key regulatory issues", score: 2 },
          { text: "Advise on compliance", score: 3 },
          { text: "Expert in blockchain law", score: 4 }
        ]
      },
      {
        question: "What's your experience with oracles?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Used oracle services", score: 2 },
          { text: "Developed oracle solutions", score: 3 },
          { text: "Expert in oracle design", score: 4 }
        ]
      },
      {
        question: "How would you approach blockchain education?",
        options: [
          { text: "Self-learner", score: 1 },
          { text: "Completed formal courses", score: 2 },
          { text: "Teach blockchain concepts", score: 3 },
          { text: "Develop educational programs", score: 4 }
        ]
      }
    ],
    ai: [
  {
    question: "What's your understanding of machine learning fundamentals?",
    options: [
      { text: "Basic awareness of concepts", score: 1 },
      { text: "Understand supervised/unsupervised learning", score: 2 },
      { text: "Can implement various algorithms", score: 3 },
      { text: "Expert in ML theory", score: 4 }
    ]
  },
  {
    question: "How familiar are you with deep learning?",
    options: [
      { text: "Basic understanding of neural networks", score: 1 },
      { text: "Implemented basic neural networks", score: 2 },
      { text: "Designed complex architectures", score: 3 },
      { text: "Expert in deep learning research", score: 4 }
    ]
  },
  {
    question: "What's your experience with NLP?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Implemented text processing", score: 2 },
      { text: "Developed NLP models", score: 3 },
      { text: "Expert in advanced NLP", score: 4 }
    ]
  },
  {
    question: "How would you approach computer vision?",
    options: [
      { text: "Basic image processing", score: 1 },
      { text: "Implemented basic CV models", score: 2 },
      { text: "Developed complex vision systems", score: 3 },
      { text: "Expert in CV research", score: 4 }
    ]
  },
  {
    question: "What's your experience with reinforcement learning?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Implemented simple RL", score: 2 },
      { text: "Developed RL solutions", score: 3 },
      { text: "Expert in RL research", score: 4 }
    ]
  },
  {
    question: "How familiar are you with AI ethics?",
    options: [
      { text: "Basic awareness", score: 1 },
      { text: "Understand key ethical issues", score: 2 },
      { text: "Implement ethical AI practices", score: 3 },
      { text: "Expert in AI ethics research", score: 4 }
    ]
  },
  {
    question: "What's your experience with AI deployment?",
    options: [
      { text: "No deployment experience", score: 1 },
      { text: "Deployed simple models", score: 2 },
      { text: "Implemented production pipelines", score: 3 },
      { text: "Expert in MLOps", score: 4 }
    ]
  },
  {
    question: "How would you approach model interpretability?",
    options: [
      { text: "Use basic feature importance", score: 1 },
      { text: "Implement standard explainability", score: 2 },
      { text: "Design comprehensive interpretability", score: 3 },
      { text: "Expert in explainable AI", score: 4 }
    ]
  },
  {
    question: "What's your experience with transfer learning?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Used pre-trained models", score: 2 },
      { text: "Fine-tuned models for tasks", score: 3 },
      { text: "Expert in transfer learning research", score: 4 }
    ]
  },
  {
    question: "How familiar are you with generative AI?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Used generative models", score: 2 },
      { text: "Developed generative applications", score: 3 },
      { text: "Expert in generative AI research", score: 4 }
    ]
  },
  {
    question: "What's your experience with AI hardware?",
    options: [
      { text: "Basic awareness", score: 1 },
      { text: "Used GPUs for training", score: 2 },
      { text: "Optimized for specific hardware", score: 3 },
      { text: "Expert in AI hardware", score: 4 }
    ]
  },
  {
    question: "How would you approach data preparation for AI?",
    options: [
      { text: "Basic data cleaning", score: 1 },
      { text: "Feature engineering", score: 2 },
      { text: "Design data pipelines", score: 3 },
      { text: "Expert in data-centric AI", score: 4 }
    ]
  },
  {
    question: "What's your experience with AI in edge devices?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Deployed simple edge AI", score: 2 },
      { text: "Optimized models for edge", score: 3 },
      { text: "Expert in edge AI research", score: 4 }
    ]
  },
  {
    question: "How familiar are you with AI benchmarks?",
    options: [
      { text: "Basic awareness", score: 1 },
      { text: "Used standard benchmarks", score: 2 },
      { text: "Designed evaluation metrics", score: 3 },
      { text: "Expert in benchmark development", score: 4 }
    ]
  },
  {
    question: "What's your experience with AI in healthcare?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Worked on healthcare projects", score: 2 },
      { text: "Developed medical AI solutions", score: 3 },
      { text: "Expert in medical AI research", score: 4 }
    ]
  },
  {
    question: "How would you approach AI for robotics?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Implemented basic robotics AI", score: 2 },
      { text: "Developed complex robotic systems", score: 3 },
      { text: "Expert in robotics AI research", score: 4 }
    ]
  },
  {
    question: "What's your experience with AI in finance?",
    options: [
      { text: "Basic understanding", score: 1 },
      { text: "Worked on financial models", score: 2 },
      { text: "Developed trading algorithms", score: 3 },
      { text: "Expert in financial AI", score: 4 }
    ]
  },
  {
    question: "How familiar are you with AI regulations?",
    options: [
      { text: "Basic awareness", score: 1 },
      { text: "Understand compliance requirements", score: 2 },
      { text: "Implement regulatory measures", score: 3 },
      { text: "Expert in AI policy", score: 4 }
    ]
  },
  {
    question: "What's your experience with AI startups?",
    options: [
      { text: "No startup experience", score: 1 },
      { text: "Worked at an AI startup", score: 2 },
      { text: "Founded an AI startup", score: 3 },
      { text: "Expert in AI entrepreneurship", score: 4 }
    ]
  },
  {
    question: "How would you approach AI education?",
    options: [
      { text: "Self-learner", score: 1 },
      { text: "Completed formal courses", score: 2 },
      { text: "Teach AI concepts", score: 3 },
      { text: "Develop AI curricula", score: 4 }
    ]
  }
],
    mobile: [
      {
        question: "What's your experience with native mobile development?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Built simple native apps", score: 2 },
          { text: "Developed complex native apps", score: 3 },
          { text: "Expert in native development", score: 4 }
        ]
      },
      {
        question: "How familiar are you with cross-platform frameworks?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Built apps with Flutter/React Native", score: 2 },
          { text: "Developed complex cross-platform apps", score: 3 },
          { text: "Expert in cross-platform development", score: 4 }
        ]
      },
      {
        question: "What's your experience with mobile UI design?",
        options: [
          { text: "Basic UI implementation", score: 1 },
          { text: "Designed custom UI components", score: 2 },
          { text: "Created complex animations", score: 3 },
          { text: "Expert in mobile UX/UI", score: 4 }
        ]
      },
      {
        question: "How would you approach mobile performance optimization?",
        options: [
          { text: "Basic optimizations", score: 1 },
          { text: "Implemented standard optimizations", score: 2 },
          { text: "Designed performance strategies", score: 3 },
          { text: "Expert in mobile performance", score: 4 }
        ]
      },
      {
        question: "What's your experience with mobile APIs?",
        options: [
          { text: "Consumed simple APIs", score: 1 },
          { text: "Integrated multiple APIs", score: 2 },
          { text: "Designed API consumption patterns", score: 3 },
          { text: "Expert in mobile API architecture", score: 4 }
        ]
      },
      {
        question: "How familiar are you with mobile security?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Implemented standard security", score: 2 },
          { text: "Designed security architectures", score: 3 },
          { text: "Expert in mobile security", score: 4 }
        ]
      },
      {
        question: "What's your experience with offline capabilities?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Implemented offline storage", score: 2 },
          { text: "Designed offline-first apps", score: 3 },
          { text: "Expert in offline solutions", score: 4 }
        ]
      },
      {
        question: "How would you approach mobile testing?",
        options: [
          { text: "Manual testing", score: 1 },
          { text: "Implemented unit tests", score: 2 },
          { text: "Designed test automation", score: 3 },
          { text: "Expert in mobile QA", score: 4 }
        ]
      },
      {
        question: "What's your experience with app publishing?",
        options: [
          { text: "No publishing experience", score: 1 },
          { text: "Published simple apps", score: 2 },
          { text: "Managed complex release cycles", score: 3 },
          { text: "Expert in app distribution", score: 4 }
        ]
      },
      {
        question: "How familiar are you with mobile analytics?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Integrated analytics SDKs", score: 2 },
          { text: "Designed analytics strategies", score: 3 },
          { text: "Expert in mobile data analysis", score: 4 }
        ]
      },
      {
        question: "What's your experience with push notifications?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Implemented basic notifications", score: 2 },
          { text: "Designed notification strategies", score: 3 },
          { text: "Expert in engagement systems", score: 4 }
        ]
      },
      {
        question: "How would you approach mobile payments?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Integrated payment SDKs", score: 2 },
          { text: "Designed payment flows", score: 3 },
          { text: "Expert in mobile finance", score: 4 }
        ]
      },
      {
        question: "What's your experience with AR/VR in mobile?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Implemented basic AR/VR", score: 2 },
          { text: "Developed complex AR/VR apps", score: 3 },
          { text: "Expert in mobile AR/VR", score: 4 }
        ]
      },
      {
        question: "How familiar are you with mobile accessibility?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Implemented basic accessibility", score: 2 },
          { text: "Designed accessible apps", score: 3 },
          { text: "Expert in mobile accessibility", score: 4 }
        ]
      },
      {
        question: "What's your experience with IoT mobile apps?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Connected apps to IoT devices", score: 2 },
          { text: "Developed complex IoT solutions", score: 3 },
          { text: "Expert in mobile IoT", score: 4 }
        ]
      },
      {
        question: "How would you approach mobile game development?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Developed simple games", score: 2 },
          { text: "Built complex game engines", score: 3 },
          { text: "Expert in mobile gaming", score: 4 }
        ]
      },
      {
        question: "What's your experience with mobile CI/CD?",
        options: [
          { text: "No CI/CD experience", score: 1 },
          { text: "Set up basic pipelines", score: 2 },
          { text: "Designed complex workflows", score: 3 },
          { text: "Expert in mobile DevOps", score: 4 }
        ]
      },
      {
        question: "How familiar are you with mobile backend services?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Used BaaS platforms", score: 2 },
          { text: "Designed custom backends", score: 3 },
          { text: "Expert in mobile backend architecture", score: 4 }
        ]
      },
      {
        question: "What's your experience with wearables?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Developed simple wearable apps", score: 2 },
          { text: "Built complex wearable solutions", score: 3 },
          { text: "Expert in wearable technology", score: 4 }
        ]
      },
      {
        question: "How would you approach mobile localization?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Localized simple apps", score: 2 },
          { text: "Designed global-ready apps", score: 3 },
          { text: "Expert in internationalization", score: 4 }
        ]
      }
    ],
    devops: [
      {
        question: "What's your experience with CI/CD pipelines?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Set up basic pipelines", score: 2 },
          { text: "Designed complex workflows", score: 3 },
          { text: "Expert in CI/CD architecture", score: 4 }
        ]
      },
      {
        question: "How familiar are you with infrastructure as code?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Used Terraform/CloudFormation", score: 2 },
          { text: "Designed complex infrastructures", score: 3 },
          { text: "Expert in IaC patterns", score: 4 }
        ]
      },
      {
        question: "What's your experience with containerization?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Created Docker containers", score: 2 },
          { text: "Designed container architectures", score: 3 },
          { text: "Expert in container ecosystems", score: 4 }
        ]
      },
      {
        question: "How would you approach configuration management?",
        options: [
          { text: "Basic scripting", score: 1 },
          { text: "Used Ansible/Puppet/Chef", score: 2 },
          { text: "Designed configuration systems", score: 3 },
          { text: "Expert in configuration patterns", score: 4 }
        ]
      },
      {
        question: "What's your experience with monitoring solutions?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Set up monitoring tools", score: 2 },
          { text: "Designed observability systems", score: 3 },
          { text: "Expert in monitoring at scale", score: 4 }
        ]
      },
      {
        question: "How familiar are you with cloud platforms?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Worked with one cloud provider", score: 2 },
          { text: "Designed multi-cloud solutions", score: 3 },
          { text: "Expert in cloud architectures", score: 4 }
        ]
      },
      {
        question: "What's your experience with version control?",
        options: [
          { text: "Basic Git commands", score: 1 },
          { text: "Comfortable with branching", score: 2 },
          { text: "Designed workflows", score: 3 },
          { text: "Expert in version control systems", score: 4 }
        ]
      },
      {
        question: "How would you approach infrastructure security?",
        options: [
          { text: "Basic security measures", score: 1 },
          { text: "Implemented standard security", score: 2 },
          { text: "Designed security architectures", score: 3 },
          { text: "Expert in infrastructure security", score: 4 }
        ]
      },
      {
        question: "What's your experience with orchestration?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Managed Kubernetes clusters", score: 2 },
          { text: "Designed orchestration systems", score: 3 },
          { text: "Expert in large-scale orchestration", score: 4 }
        ]
      },
      {
        question: "How familiar are you with logging solutions?",
        options: [
          { text: "Basic log viewing", score: 1 },
          { text: "Set up logging tools", score: 2 },
          { text: "Designed log aggregation", score: 3 },
          { text: "Expert in log analysis", score: 4 }
        ]
      },
      {
        question: "What's your experience with performance tuning?",
        options: [
          { text: "Basic optimizations", score: 1 },
          { text: "Implemented standard tuning", score: 2 },
          { text: "Designed performance strategies", score: 3 },
          { text: "Expert in system optimization", score: 4 }
        ]
      },
      {
        question: "How would you approach disaster recovery?",
        options: [
          { text: "Basic backups", score: 1 },
          { text: "Implemented DR plans", score: 2 },
          { text: "Designed DR strategies", score: 3 },
          { text: "Expert in business continuity", score: 4 }
        ]
      },
      {
        question: "What's your experience with microservices?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Worked with microservices", score: 2 },
          { text: "Designed microservice architectures", score: 3 },
          { text: "Expert in distributed systems", score: 4 }
        ]
      },
      {
        question: "How familiar are you with serverless?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Deployed serverless functions", score: 2 },
          { text: "Designed serverless architectures", score: 3 },
          { text: "Expert in serverless patterns", score: 4 }
        ]
      },
      {
        question: "What's your experience with databases in DevOps?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Managed database deployments", score: 2 },
          { text: "Designed database strategies", score: 3 },
          { text: "Expert in database DevOps", score: 4 }
        ]
      },
      {
        question: "How would you approach infrastructure costs?",
        options: [
          { text: "Basic cost awareness", score: 1 },
          { text: "Implemented cost controls", score: 2 },
          { text: "Designed cost-efficient architectures", score: 3 },
          { text: "Expert in cloud economics", score: 4 }
        ]
      },
      {
        question: "What's your experience with networking in DevOps?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Configured networks", score: 2 },
          { text: "Designed network architectures", score: 3 },
          { text: "Expert in cloud networking", score: 4 }
        ]
      },
      {
        question: "How familiar are you with GitOps?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Implemented basic GitOps", score: 2 },
          { text: "Designed GitOps workflows", score: 3 },
          { text: "Expert in GitOps patterns", score: 4 }
        ]
      },
      {
        question: "What's your experience with compliance in DevOps?",
        options: [
          { text: "Basic awareness", score: 1 },
          { text: "Implemented compliance controls", score: 2 },
          { text: "Designed compliance frameworks", score: 3 },
          { text: "Expert in regulatory DevOps", score: 4 }
        ]
      },
      {
        question: "How would you approach DevOps culture?",
        options: [
          { text: "Basic understanding", score: 1 },
          { text: "Promoted collaboration", score: 2 },
          { text: "Led DevOps transformations", score: 3 },
          { text: "Expert in organizational DevOps", score: 4 }
        ]
      }
    ]
  };

  export default preDefinedQuestions