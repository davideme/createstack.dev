export interface ProjectType {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  commonStacks: string[];
  estimatedTimeline: string;
}

export const projectTypes: ProjectType[] = [
  {
    id: "web-app",
    name: "Web Application",
    emoji: "🌐",
    description: "Full-featured web applications with user interfaces, databases, and backend services",
    bestFor: "Customer-facing applications, internal tools, SaaS products",
    commonStacks: ["React", "Vue", "Angular", "Next.js", "Svelte"],
    estimatedTimeline: "2-6 months"
  },
  {
    id: "mobile-app",
    name: "Mobile Application",
    emoji: "📱",
    description: "Native or cross-platform mobile applications for iOS and Android",
    bestFor: "Consumer apps, enterprise mobile solutions, offline-first applications",
    commonStacks: ["React Native", "Flutter", "Swift", "Kotlin", "Ionic"],
    estimatedTimeline: "3-8 months"
  },
  {
    id: "api-product",
    name: "API Product",
    emoji: "🔌",
    description: "RESTful or GraphQL APIs designed for third-party integration and data exchange",
    bestFor: "Platform integrations, microservices architecture, developer tools",
    commonStacks: ["Node.js", "Python", "Go", "Java", "GraphQL"],
    estimatedTimeline: "1-4 months"
  },
  {
    id: "microservice",
    name: "Microservice",
    emoji: "⚙️",
    description: "Small, focused services that handle specific business functions",
    bestFor: "Distributed systems, scalable architectures, team autonomy",
    commonStacks: ["Docker", "Kubernetes", "gRPC", "Spring Boot", "FastAPI"],
    estimatedTimeline: "2-6 weeks"
  },
  {
    id: "desktop-app",
    name: "Desktop Application",
    emoji: "🖥️",
    description: "Cross-platform or native desktop applications with rich user interfaces",
    bestFor: "Professional tools, creative software, system utilities",
    commonStacks: ["Electron", "Tauri", "Qt", ".NET", "JavaFX"],
    estimatedTimeline: "2-6 months"
  },
  {
    id: "analytics-reporting",
    name: "Analytics & Reporting",
    emoji: "📊",
    description: "Data visualization, business intelligence, and reporting solutions",
    bestFor: "Business insights, dashboard applications, data-driven decisions",
    commonStacks: ["Tableau", "Power BI", "D3.js", "Apache Superset", "Grafana"],
    estimatedTimeline: "1-3 months"
  }
];

export function getProjectType(id: string): ProjectType | undefined {
  return projectTypes.find(type => type.id === id);
}
