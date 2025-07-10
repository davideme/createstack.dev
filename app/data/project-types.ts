export interface Architecture {
  id: string;
  name: string;
  description: string;
  examples: string[];
  complexity: 'Low' | 'Medium' | 'High';
  bestFor: string;
}

export interface ProjectType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  commonStacks: string[];
  estimatedTimeline: string;
  architectures: Architecture[];
}

export const projectTypes: ProjectType[] = [
  {
    id: "web-app",
    name: "Web Application",
    emoji: "🌐",
    description: "Full-featured web applications with user interfaces, databases, and backend services",
    bestFor: "Customer-facing applications, internal tools, SaaS products",
    commonStacks: ["React", "Vue", "Angular", "Next.js", "Svelte"],
    estimatedTimeline: "2-6 months",
    architectures: [
      {
        id: "client-server",
        name: "Client-Server",
        description: "Frontend + API backend separated into different services",
        examples: ["React/Vue/Angular + Node.js", "Flask", "Spring Boot"],
        complexity: "Medium",
        bestFor: "Scalable apps with clear separation of concerns"
      },
      {
        id: "monolith",
        name: "Monolith",
        description: "Server-rendered or API + frontend in one codebase",
        examples: ["Ruby on Rails", "Laravel", "Django", "Next.js full-stack"],
        complexity: "Low",
        bestFor: "Rapid development and simple deployment"
      },
      {
        id: "jamstack",
        name: "Jamstack",
        description: "Static frontend + API/data source",
        examples: ["Next.js + Headless CMS", "Gatsby + Serverless Functions"],
        complexity: "Medium",
        bestFor: "Fast, secure sites with great SEO"
      },
      {
        id: "serverless-web",
        name: "Serverless Web Application",
        description: "Hosted on serverless platforms with dynamic API endpoints",
        examples: ["Vercel", "AWS Lambda", "Cloudflare Workers"],
        complexity: "Medium",
        bestFor: "Auto-scaling apps with pay-per-use pricing"
      }
    ]
  },
  {
    id: "mobile-app",
    name: "Mobile Application",
    emoji: "📱",
    description: "Native or cross-platform mobile applications for iOS and Android",
    bestFor: "Consumer apps, enterprise mobile solutions, offline-first applications",
    commonStacks: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
    estimatedTimeline: "3-8 months",
    architectures: [
      {
        id: "client-server-mobile",
        name: "Client-Server",
        description: "Mobile app communicates with a centralized backend API",
        examples: ["React Native + Node.js API", "Flutter + Django REST"],
        complexity: "Medium",
        bestFor: "Traditional apps with custom backend logic"
      },
      {
        id: "baas",
        name: "Backend-as-a-Service (BaaS)",
        description: "Quick MVPs with minimal backend code using cloud services",
        examples: ["Firebase", "Supabase", "AWS Amplify"],
        complexity: "Low",
        bestFor: "Rapid prototyping and MVPs"
      },
      {
        id: "serverless-backend",
        name: "Serverless Backend",
        description: "Stateless APIs or cloud functions",
        examples: ["Google Cloud Functions + Firestore", "AWS Lambda + DynamoDB"],
        complexity: "Medium",
        bestFor: "Event-driven apps with variable traffic"
      },
      {
        id: "edge-cdn",
        name: "Edge + CDN for Assets",
        description: "Reduce latency for global users with edge computing",
        examples: ["Cloudflare", "AWS CloudFront"],
        complexity: "High",
        bestFor: "Global apps requiring low latency"
      }
    ]
  },
  {
    id: "api-product",
    name: "API Product",
    emoji: "🔌",
    description: "RESTful or GraphQL APIs designed for third-party integration and data exchange",
    bestFor: "Platform integrations, microservices architecture, developer tools",
    commonStacks: ["Node.js", "Python", "Go", "Java", "GraphQL"],
    estimatedTimeline: "1-4 months",
    architectures: [
      {
        id: "monolithic-api",
        name: "Monolithic API",
        description: "Single service handling all routes",
        examples: ["Express.js monolith", "FastAPI single service"],
        complexity: "Low",
        bestFor: "MVP stage and simple APIs"
      },
      {
        id: "gateway-microservices",
        name: "Gateway + Microservices",
        description: "API Gateway routes requests to dedicated services",
        examples: ["Kong", "NGINX", "AWS API Gateway"],
        complexity: "High",
        bestFor: "Complex APIs with multiple domains"
      },
      {
        id: "serverless-api",
        name: "Serverless API",
        description: "Independent cloud functions for each endpoint",
        examples: ["AWS Lambda", "Vercel functions", "Cloudflare Workers"],
        complexity: "Medium",
        bestFor: "Variable traffic and pay-per-use pricing"
      },
      {
        id: "federated-graphql",
        name: "Federated GraphQL",
        description: "Multiple subgraphs exposed under one unified API",
        examples: ["Apollo Federation", "GraphQL Mesh"],
        complexity: "High",
        bestFor: "Complex data relationships across services"
      }
    ]
  },
  {
    id: "microservice",
    name: "Microservice",
    emoji: "⚙️",
    description: "Small, focused services that handle specific business functions",
    bestFor: "Distributed systems, scalable architectures, team autonomy",
    commonStacks: ["Docker", "Kubernetes", "gRPC", "Spring Boot", "FastAPI"],
    estimatedTimeline: "2-6 weeks",
    architectures: [
      {
        id: "microservices-rest",
        name: "Microservices over REST",
        description: "Each service exposes a REST API, often behind a gateway",
        examples: ["Spring Boot services", "Express.js microservices"],
        complexity: "Medium",
        bestFor: "Standard HTTP-based communication"
      },
      {
        id: "microservices-messaging",
        name: "Microservices over Messaging",
        description: "Asynchronous communication via message queues",
        examples: ["Kafka", "RabbitMQ", "Apache Pulsar"],
        complexity: "High",
        bestFor: "Event-driven architectures"
      },
      {
        id: "containerized-microservices",
        name: "Containerized Microservices",
        description: "Docker + Kubernetes to orchestrate, scale, and deploy services",
        examples: ["Kubernetes clusters", "Docker Swarm"],
        complexity: "High",
        bestFor: "Production-ready scalable systems"
      },
      {
        id: "service-mesh",
        name: "Service Mesh",
        description: "Infrastructure layer for secure, observable communication",
        examples: ["Istio", "Linkerd", "Consul Connect"],
        complexity: "High",
        bestFor: "Complex microservice environments"
      }
    ]
  },
  {
    id: "desktop-app",
    name: "Desktop Application",
    emoji: "🖥️",
    description: "Cross-platform or native desktop applications with rich user interfaces",
    bestFor: "Professional tools, creative software, system utilities",
    commonStacks: ["Electron", "Tauri", "Qt", ".NET", "JavaFX"],
    estimatedTimeline: "2-6 months",
    architectures: [
      {
        id: "electron-webview",
        name: "Electron / WebView-based",
        description: "Web frontend wrapped in desktop shell",
        examples: ["Slack", "VS Code", "Discord"],
        complexity: "Low",
        bestFor: "Cross-platform apps with web technologies"
      },
      {
        id: "native-local-api",
        name: "Native App with Local API",
        description: "Local services exposed via gRPC/REST, often with embedded DBs",
        examples: ["Qt + SQLite", ".NET + Local API"],
        complexity: "Medium",
        bestFor: "Performance-critical applications"
      },
      {
        id: "tauri-lightweight",
        name: "Tauri or NW.js",
        description: "Lightweight alternatives to Electron using Rust/Go",
        examples: ["Tauri + React", "NW.js applications"],
        complexity: "Medium",
        bestFor: "Resource-efficient desktop apps"
      },
      {
        id: "cloud-powered-desktop",
        name: "Cloud-powered Desktop Clients",
        description: "Thin desktop client connects to cloud for computation/storage",
        examples: ["Dropbox", "Figma", "Adobe Creative Cloud"],
        complexity: "High",
        bestFor: "Cloud-first applications with offline sync"
      }
    ]
  },
  {
    id: "analytics-reporting",
    name: "Analytics & Reporting",
    emoji: "📊",
    description: "Data visualization, business intelligence, and reporting solutions",
    bestFor: "Business insights, dashboard applications, data-driven decisions",
    commonStacks: ["Tableau", "Power BI", "D3.js", "Apache Superset", "Grafana"],
    estimatedTimeline: "1-3 months",
    architectures: [
      {
        id: "batch-etl",
        name: "Batch ETL Pipeline",
        description: "Scheduled processing for regular data updates",
        examples: ["Airflow → dbt → warehouse", "Apache Spark jobs"],
        complexity: "Medium",
        bestFor: "Regular reporting and data warehousing"
      },
      {
        id: "streaming-realtime",
        name: "Streaming/Real-Time Analytics",
        description: "Process data as it arrives for immediate insights",
        examples: ["Kafka → Flink → ClickHouse", "Kinesis → Lambda"],
        complexity: "High",
        bestFor: "Real-time dashboards and alerts"
      },
      {
        id: "olap-focused",
        name: "OLAP-focused",
        description: "Warehouses optimized for analytical queries",
        examples: ["Snowflake + Looker", "BigQuery + Metabase"],
        complexity: "Medium",
        bestFor: "Business intelligence and complex analytics"
      },
      {
        id: "embedded-analytics",
        name: "Embedded Analytics",
        description: "Dashboards integrated into apps via iframe or API",
        examples: ["Retool", "Tableau Embedded", "Grafana panels"],
        complexity: "Low",
        bestFor: "Analytics within existing applications"
      }
    ]
  }
];

export function getProjectType(id: string): ProjectType | undefined {
  return projectTypes.find(type => type.id === id);
}

export function getArchitecturesForProjectType(projectTypeId: string): Architecture[] {
  const projectType = getProjectType(projectTypeId);
  return projectType?.architectures || [];
}

export function getArchitecture(projectTypeId: string, architectureId: string): Architecture | undefined {
  const architectures = getArchitecturesForProjectType(projectTypeId);
  return architectures.find(arch => arch.id === architectureId);
}
