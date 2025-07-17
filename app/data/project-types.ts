export interface ArchitectureService {
  name: string;
  description: string;
  required: boolean;
  category: 'frontend' | 'backend' | 'database' | 'storage' | 'messaging' | 'auth' | 'cdn' | 'monitoring' | 'other';
}

export interface Architecture {
  id: string;
  name: string;
  description: string;
  examples: string[];
  bestFor: string;
  services: ArchitectureService[];
}

export interface ProjectType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  commonStacks: string[];
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
    architectures: [
      {
        id: "client-server",
        name: "Client-Server",
        description: "Frontend + API backend separated into different services",
        examples: ["React/Vue/Angular + Node.js", "Flask", "Spring Boot"],
        bestFor: "Scalable apps with clear separation of concerns",
        services: [
          { name: "Frontend Application", description: "User interface layer (SPA or SSR)", required: true, category: "frontend" },
          { name: "Backend API", description: "REST/GraphQL API server", required: true, category: "backend" },
          { name: "Database", description: "Primary data storage (SQL or NoSQL)", required: true, category: "database" },
          { name: "Authentication Service", description: "User authentication and authorization", required: false, category: "auth" },
          { name: "CDN", description: "Content delivery for static assets", required: false, category: "cdn" },
          { name: "Load Balancer", description: "Distribute traffic across backend instances", required: false, category: "other" }
        ]
      },
      {
        id: "monolith",
        name: "Monolith",
        description: "Server-rendered or API + frontend in one codebase",
        examples: ["Ruby on Rails", "Laravel", "Django", "Next.js full-stack"],
        bestFor: "Rapid development and simple deployment",
        services: [
          { name: "Monolithic Application", description: "Single application handling frontend and backend", required: true, category: "backend" },
          { name: "Database", description: "Primary data storage", required: true, category: "database" },
          { name: "File Storage", description: "Static assets and uploads", required: false, category: "storage" },
          { name: "Cache Layer", description: "Redis or Memcached for performance", required: false, category: "other" },
          { name: "Background Jobs", description: "Async task processing", required: false, category: "other" }
        ]
      },
      {
        id: "jamstack",
        name: "Jamstack",
        description: "Static frontend + API/data source",
        examples: ["Next.js + Headless CMS", "Gatsby + Serverless Functions"],
        bestFor: "Fast, secure sites with great SEO",
        services: [
          { name: "Static Site Generator", description: "Pre-built HTML/CSS/JS files", required: true, category: "frontend" },
          { name: "CDN/Hosting", description: "Global content delivery network", required: true, category: "cdn" },
          { name: "Headless CMS", description: "Content management system", required: false, category: "backend" },
          { name: "Serverless Functions", description: "API endpoints for dynamic functionality", required: false, category: "backend" },
          { name: "External APIs", description: "Third-party services and data sources", required: false, category: "other" }
        ]
      },
      {
        id: "serverless-web",
        name: "Serverless Web Application",
        description: "Hosted on serverless platforms with dynamic API endpoints",
        examples: ["Vercel", "AWS Lambda", "Cloudflare Workers"],
        bestFor: "Auto-scaling apps with pay-per-use pricing",
        services: [
          { name: "Frontend Application", description: "React/Vue/Angular SPA", required: true, category: "frontend" },
          { name: "Serverless Functions", description: "Backend API as cloud functions", required: true, category: "backend" },
          { name: "Serverless Database", description: "Managed database service", required: true, category: "database" },
          { name: "Object Storage", description: "File uploads and static assets", required: false, category: "storage" },
          { name: "API Gateway", description: "Route and manage API requests", required: false, category: "other" }
        ]
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
    architectures: [
      {
        id: "client-server-mobile",
        name: "Client-Server",
        description: "Mobile app communicates with a centralized backend API",
        examples: ["React Native + Node.js API", "Flutter + Django REST"],
        bestFor: "Traditional apps with custom backend logic",
        services: [
          { name: "Mobile Application", description: "Native or cross-platform mobile app", required: true, category: "frontend" },
          { name: "Backend API", description: "REST/GraphQL API server", required: true, category: "backend" },
          { name: "Database", description: "Primary data storage", required: true, category: "database" },
          { name: "Push Notifications", description: "Mobile push notification service", required: false, category: "other" },
          { name: "File Storage", description: "Image/video/document storage", required: false, category: "storage" },
          { name: "Authentication Service", description: "User login and session management", required: false, category: "auth" }
        ]
      },
      {
        id: "baas",
        name: "Backend-as-a-Service (BaaS)",
        description: "Quick MVPs with minimal backend code using cloud services",
        examples: ["Firebase", "Supabase", "AWS Amplify"],
        bestFor: "Rapid prototyping and MVPs",
        services: [
          { name: "Mobile Application", description: "Native or cross-platform mobile app", required: true, category: "frontend" },
          { name: "BaaS Platform", description: "Managed backend service (Firebase/Supabase)", required: true, category: "backend" },
          { name: "Real-time Database", description: "Managed database with real-time sync", required: true, category: "database" },
          { name: "Authentication", description: "Built-in user authentication", required: false, category: "auth" },
          { name: "Cloud Storage", description: "File storage and CDN", required: false, category: "storage" },
          { name: "Cloud Functions", description: "Serverless backend functions", required: false, category: "backend" }
        ]
      },
      {
        id: "serverless-backend",
        name: "Serverless Backend",
        description: "Stateless APIs or cloud functions",
        examples: ["Google Cloud Functions + Firestore", "AWS Lambda + DynamoDB"],
        bestFor: "Event-driven apps with variable traffic",
        services: [
          { name: "Mobile Application", description: "Native or cross-platform mobile app", required: true, category: "frontend" },
          { name: "Serverless Functions", description: "Cloud functions for backend logic", required: true, category: "backend" },
          { name: "NoSQL Database", description: "Serverless database service", required: true, category: "database" },
          { name: "API Gateway", description: "Manage and route API requests", required: false, category: "other" },
          { name: "Object Storage", description: "File and media storage", required: false, category: "storage" },
          { name: "Event Streaming", description: "Real-time event processing", required: false, category: "messaging" }
        ]
      },
      {
        id: "edge-cdn",
        name: "Edge + CDN for Assets",
        description: "Reduce latency for global users with edge computing",
        examples: ["Cloudflare", "AWS CloudFront"],
        bestFor: "Global apps requiring low latency",
        services: [
          { name: "Mobile Application", description: "Native or cross-platform mobile app", required: true, category: "frontend" },
          { name: "Edge Functions", description: "Compute at edge locations", required: true, category: "backend" },
          { name: "CDN", description: "Global content delivery network", required: true, category: "cdn" },
          { name: "Edge Cache", description: "Distributed caching layer", required: false, category: "other" },
          { name: "Origin Server", description: "Main backend API server", required: false, category: "backend" },
          { name: "Global Database", description: "Multi-region database replication", required: false, category: "database" }
        ]
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
    architectures: [
      {
        id: "monolithic-api",
        name: "Monolithic API",
        description: "Single service handling all routes",
        examples: ["Express.js monolith", "FastAPI single service"],
        bestFor: "MVP stage and simple APIs",
        services: [
          { name: "API Server", description: "Single monolithic application server", required: true, category: "backend" },
          { name: "Database", description: "Primary data storage", required: true, category: "database" },
          { name: "Load Balancer", description: "Distribute incoming requests", required: false, category: "other" },
          { name: "Cache Layer", description: "Redis or Memcached for performance", required: false, category: "other" },
          { name: "Monitoring", description: "Application performance monitoring", required: false, category: "monitoring" }
        ]
      },
      {
        id: "gateway-microservices",
        name: "Gateway + Microservices",
        description: "API Gateway routes requests to dedicated services",
        examples: ["Kong", "NGINX", "AWS API Gateway"],
        bestFor: "Complex APIs with multiple domains",
        services: [
          { name: "API Gateway", description: "Route and manage API requests", required: true, category: "other" },
          { name: "Microservices", description: "Multiple specialized API services", required: true, category: "backend" },
          { name: "Service Registry", description: "Service discovery and registration", required: true, category: "other" },
          { name: "Databases", description: "Per-service data storage", required: true, category: "database" },
          { name: "Message Queue", description: "Inter-service communication", required: false, category: "messaging" },
          { name: "Monitoring & Tracing", description: "Distributed system observability", required: false, category: "monitoring" }
        ]
      },
      {
        id: "serverless-api",
        name: "Serverless API",
        description: "Independent cloud functions for each endpoint",
        examples: ["AWS Lambda", "Vercel functions", "Cloudflare Workers"],
        bestFor: "Variable traffic and pay-per-use pricing",
        services: [
          { name: "Serverless Functions", description: "Individual functions per endpoint", required: true, category: "backend" },
          { name: "API Gateway", description: "Route requests to functions", required: true, category: "other" },
          { name: "NoSQL Database", description: "Serverless database service", required: true, category: "database" },
          { name: "Event Triggers", description: "Schedule and event-based execution", required: false, category: "other" },
          { name: "Object Storage", description: "File and data storage", required: false, category: "storage" },
          { name: "Monitoring", description: "Function performance and logging", required: false, category: "monitoring" }
        ]
      },
      {
        id: "federated-graphql",
        name: "Federated GraphQL",
        description: "Multiple subgraphs exposed under one unified API",
        examples: ["Apollo Federation", "GraphQL Mesh"],
        bestFor: "Complex data relationships across services",
        services: [
          { name: "GraphQL Gateway", description: "Federated schema composition", required: true, category: "other" },
          { name: "Subgraph Services", description: "Individual GraphQL services", required: true, category: "backend" },
          { name: "Schema Registry", description: "Manage and version schemas", required: true, category: "other" },
          { name: "Databases", description: "Data sources for each subgraph", required: true, category: "database" },
          { name: "Caching Layer", description: "Query result caching", required: false, category: "other" },
          { name: "Analytics", description: "Query performance tracking", required: false, category: "monitoring" }
        ]
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
    architectures: [
      {
        id: "microservices-rest",
        name: "Microservices over REST",
        description: "Each service exposes a REST API, often behind a gateway",
        examples: ["Spring Boot services", "Express.js microservices"],
        bestFor: "Standard HTTP-based communication",
        services: [
          { name: "API Gateway", description: "Central entry point for all services", required: true, category: "other" },
          { name: "Microservices", description: "Multiple independent REST services", required: true, category: "backend" },
          { name: "Service Registry", description: "Service discovery and health checks", required: true, category: "other" },
          { name: "Databases", description: "Per-service data storage", required: true, category: "database" },
          { name: "Load Balancers", description: "Distribute traffic across service instances", required: false, category: "other" },
          { name: "Monitoring", description: "Distributed tracing and metrics", required: false, category: "monitoring" }
        ]
      },
      {
        id: "microservices-messaging",
        name: "Microservices over Messaging",
        description: "Asynchronous communication via message queues",
        examples: ["Kafka", "RabbitMQ", "Apache Pulsar"],
        bestFor: "Event-driven architectures",
        services: [
          { name: "Message Broker", description: "Central messaging system (Kafka/RabbitMQ)", required: true, category: "messaging" },
          { name: "Microservices", description: "Event-driven service components", required: true, category: "backend" },
          { name: "Event Store", description: "Persist events for replay/audit", required: true, category: "database" },
          { name: "Schema Registry", description: "Manage event schemas and versions", required: false, category: "other" },
          { name: "Dead Letter Queue", description: "Handle failed message processing", required: false, category: "messaging" },
          { name: "Monitoring", description: "Message flow and service health tracking", required: false, category: "monitoring" }
        ]
      },
      {
        id: "containerized-microservices",
        name: "Containerized Microservices",
        description: "Docker + Kubernetes to orchestrate, scale, and deploy services",
        examples: ["Kubernetes clusters", "Docker Swarm"],
        bestFor: "Production-ready scalable systems",
        services: [
          { name: "Container Orchestrator", description: "Kubernetes or Docker Swarm", required: true, category: "other" },
          { name: "Containerized Services", description: "Docker containers for each microservice", required: true, category: "backend" },
          { name: "Container Registry", description: "Store and manage container images", required: true, category: "storage" },
          { name: "Ingress Controller", description: "External traffic routing", required: true, category: "other" },
          { name: "Config Management", description: "Environment configuration and secrets", required: false, category: "other" },
          { name: "Monitoring Stack", description: "Prometheus, Grafana, logging", required: false, category: "monitoring" }
        ]
      },
      {
        id: "service-mesh",
        name: "Service Mesh",
        description: "Infrastructure layer for secure, observable communication",
        examples: ["Istio", "Linkerd", "Consul Connect"],
        bestFor: "Complex microservice environments",
        services: [
          { name: "Service Mesh Control Plane", description: "Istio/Linkerd control plane", required: true, category: "other" },
          { name: "Sidecar Proxies", description: "Per-service network proxies", required: true, category: "other" },
          { name: "Microservices", description: "Business logic services", required: true, category: "backend" },
          { name: "Certificate Authority", description: "Automatic TLS certificate management", required: true, category: "auth" },
          { name: "Traffic Management", description: "Load balancing and routing rules", required: false, category: "other" },
          { name: "Observability Stack", description: "Distributed tracing and metrics", required: false, category: "monitoring" }
        ]
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
    architectures: [
      {
        id: "electron-webview",
        name: "Electron / WebView-based",
        description: "Web frontend wrapped in desktop shell",
        examples: ["Slack", "VS Code", "Discord"],
        bestFor: "Cross-platform apps with web technologies",
        services: [
          { name: "Electron Framework", description: "Desktop application framework", required: true, category: "frontend" },
          { name: "Web Frontend", description: "HTML/CSS/JS user interface", required: true, category: "frontend" },
          { name: "Main Process", description: "Node.js backend for system access", required: true, category: "backend" },
          { name: "Local Database", description: "SQLite or IndexedDB for local storage", required: false, category: "database" },
          { name: "Auto Updater", description: "Application update mechanism", required: false, category: "other" },
          { name: "Native Modules", description: "Platform-specific integrations", required: false, category: "other" }
        ]
      },
      {
        id: "native-local-api",
        name: "Native App with Local API",
        description: "Local services exposed via gRPC/REST, often with embedded DBs",
        examples: ["Qt + SQLite", ".NET + Local API"],
        bestFor: "Performance-critical applications",
        services: [
          { name: "Native UI Framework", description: "Qt, .NET WPF, or native toolkit", required: true, category: "frontend" },
          { name: "Local API Server", description: "Embedded HTTP/gRPC server", required: true, category: "backend" },
          { name: "Embedded Database", description: "SQLite, RocksDB, or LevelDB", required: true, category: "database" },
          { name: "System Integration", description: "OS-specific features and APIs", required: false, category: "other" },
          { name: "File System Access", description: "Local file management", required: false, category: "storage" },
          { name: "Background Services", description: "System tray or daemon processes", required: false, category: "other" }
        ]
      },
      {
        id: "tauri-lightweight",
        name: "Tauri or NW.js",
        description: "Lightweight alternatives to Electron using Rust/Go",
        examples: ["Tauri + React", "NW.js applications"],
        bestFor: "Resource-efficient desktop apps",
        services: [
          { name: "Tauri Runtime", description: "Rust-based desktop framework", required: true, category: "frontend" },
          { name: "Web Frontend", description: "Modern web UI (React/Vue/Svelte)", required: true, category: "frontend" },
          { name: "Rust Backend", description: "Native backend with system access", required: true, category: "backend" },
          { name: "Local Storage", description: "File-based or embedded database", required: false, category: "database" },
          { name: "System APIs", description: "Native OS integration layer", required: false, category: "other" },
          { name: "WebView Bridge", description: "Communication between web and native", required: false, category: "other" }
        ]
      },
      {
        id: "cloud-powered-desktop",
        name: "Cloud-powered Desktop Clients",
        description: "Thin desktop client connects to cloud for computation/storage",
        examples: ["Dropbox", "Figma", "Adobe Creative Cloud"],
        bestFor: "Cloud-first applications with offline sync",
        services: [
          { name: "Desktop Client", description: "Thin client application", required: true, category: "frontend" },
          { name: "Cloud Backend", description: "Server-side computation and storage", required: true, category: "backend" },
          { name: "Sync Engine", description: "Offline/online data synchronization", required: true, category: "other" },
          { name: "Local Cache", description: "Offline data and asset storage", required: true, category: "storage" },
          { name: "Authentication", description: "User login and session management", required: false, category: "auth" },
          { name: "Real-time Updates", description: "Live collaboration and notifications", required: false, category: "messaging" }
        ]
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
    architectures: [
      {
        id: "batch-etl",
        name: "Batch ETL Pipeline",
        description: "Scheduled processing for regular data updates",
        examples: ["Airflow → dbt → warehouse", "Apache Spark jobs"],
        bestFor: "Regular reporting and data warehousing",
        services: [
          { name: "Workflow Orchestrator", description: "Airflow, Prefect, or similar scheduler", required: true, category: "other" },
          { name: "Data Processing Engine", description: "Spark, dbt, or ETL tools", required: true, category: "backend" },
          { name: "Data Warehouse", description: "Snowflake, BigQuery, or Redshift", required: true, category: "database" },
          { name: "Data Lake", description: "Raw data storage (S3, HDFS)", required: false, category: "storage" },
          { name: "Monitoring", description: "Pipeline health and data quality checks", required: false, category: "monitoring" },
          { name: "Visualization Tool", description: "BI tools for reporting", required: false, category: "frontend" }
        ]
      },
      {
        id: "streaming-realtime",
        name: "Streaming/Real-Time Analytics",
        description: "Process data as it arrives for immediate insights",
        examples: ["Kafka → Flink → ClickHouse", "Kinesis → Lambda"],
        bestFor: "Real-time dashboards and alerts",
        services: [
          { name: "Stream Processing", description: "Kafka, Kinesis, or Pulsar", required: true, category: "messaging" },
          { name: "Stream Analytics", description: "Flink, Storm, or cloud functions", required: true, category: "backend" },
          { name: "Real-time Database", description: "ClickHouse, InfluxDB, or time-series DB", required: true, category: "database" },
          { name: "Message Queue", description: "Event streaming infrastructure", required: false, category: "messaging" },
          { name: "Real-time Dashboard", description: "Live data visualization", required: false, category: "frontend" },
          { name: "Alerting System", description: "Real-time notifications and alerts", required: false, category: "monitoring" }
        ]
      },
      {
        id: "olap-focused",
        name: "OLAP-focused",
        description: "Warehouses optimized for analytical queries",
        examples: ["Snowflake + Looker", "BigQuery + Metabase"],
        bestFor: "Business intelligence and complex analytics",
        services: [
          { name: "OLAP Database", description: "Column-store or analytical database", required: true, category: "database" },
          { name: "BI Platform", description: "Looker, Tableau, or Power BI", required: true, category: "frontend" },
          { name: "Data Modeling", description: "dbt or similar transformation layer", required: true, category: "backend" },
          { name: "Data Catalog", description: "Metadata and lineage tracking", required: false, category: "other" },
          { name: "Query Engine", description: "Presto, Trino, or SQL engine", required: false, category: "backend" },
          { name: "Security Layer", description: "Row-level security and access control", required: false, category: "auth" }
        ]
      },
      {
        id: "embedded-analytics",
        name: "Embedded Analytics",
        description: "Dashboards integrated into apps via iframe or API",
        examples: ["Retool", "Tableau Embedded", "Grafana panels"],
        bestFor: "Analytics within existing applications",
        services: [
          { name: "Embedded Dashboard", description: "Iframe or API-based analytics", required: true, category: "frontend" },
          { name: "Host Application", description: "Main application with embedded analytics", required: true, category: "frontend" },
          { name: "Analytics API", description: "Backend API for chart data", required: true, category: "backend" },
          { name: "Data Source", description: "Database or data warehouse", required: true, category: "database" },
          { name: "Authentication", description: "Single sign-on integration", required: false, category: "auth" },
          { name: "White-labeling", description: "Custom theming and branding", required: false, category: "other" }
        ]
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
