import type { StackCategory } from "~/types/stack-analysis";

/**
 * Technology stack categories used for gap analysis
 * Based on industry best practices and common development needs
 */
export const stackCategories: StackCategory[] = [
  {
    id: "programming_languages",
    name: "Programming Languages",
    description: "Core languages for your application development",
    icon: "💻",
    priority: "critical"
  },
  {
    id: "frameworks",
    name: "Application Frameworks",
    description: "Web frameworks, UI libraries, and development platforms",
    icon: "🏗️",
    priority: "critical"
  },
  {
    id: "databases",
    name: "Databases",
    description: "Data storage solutions and database management systems",
    icon: "🗄️",
    priority: "critical"
  },
  {
    id: "cloud_platforms",
    name: "Cloud Platforms",
    description: "Cloud infrastructure and hosting platforms",
    icon: "☁️",
    priority: "important"
  },
  {
    id: "ci_cd",
    name: "CI/CD Pipeline",
    description: "Continuous integration and deployment automation",
    icon: "🔄",
    priority: "important",
    required_for_compliance: ["soc2", "iso27001"]
  },
  {
    id: "monitoring",
    name: "Monitoring & Observability",
    description: "Application performance monitoring, logging, and alerting",
    icon: "📊",
    priority: "important",
    required_for_compliance: ["soc2", "pci"]
  },
  {
    id: "security",
    name: "Security Tools",
    description: "Authentication, authorization, vulnerability scanning, and security monitoring",
    icon: "🔒",
    priority: "critical",
    required_for_compliance: ["soc2", "hipaa", "pci", "gdpr"]
  },
  {
    id: "communication",
    name: "Team Communication",
    description: "Chat, video conferencing, and collaboration platforms",
    icon: "💬",
    priority: "important"
  },
  {
    id: "issue_tracking",
    name: "Issue Tracking",
    description: "Bug tracking, project management, and workflow tools",
    icon: "🎯",
    priority: "important"
  },
  {
    id: "documentation",
    name: "Documentation",
    description: "Technical documentation, API docs, and knowledge management",
    icon: "📚",
    priority: "important",
    required_for_compliance: ["soc2", "iso27001"]
  },
  {
    id: "dependency_management",
    name: "Dependency Management",
    description: "Package management, vulnerability scanning, and license compliance",
    icon: "📦",
    priority: "important",
    required_for_compliance: ["soc2"]
  },
  {
    id: "feature_flags",
    name: "Feature Flags",
    description: "Feature toggles, A/B testing, and gradual rollouts",
    icon: "🚩",
    priority: "nice-to-have"
  },
  {
    id: "testing",
    name: "Testing Tools",
    description: "Unit testing, integration testing, and test automation",
    icon: "🧪",
    priority: "important",
    required_for_compliance: ["soc2", "iso27001"]
  },
  {
    id: "containerization",
    name: "Containerization",
    description: "Docker, container registries, and container management",
    icon: "📦",
    priority: "nice-to-have"
  },
  {
    id: "orchestration",
    name: "Container Orchestration",
    description: "Kubernetes, Docker Swarm, and container orchestration platforms",
    icon: "🎼",
    priority: "nice-to-have"
  }
];

/**
 * Get categories by priority level
 */
export const getCategoriesByPriority = (priority: 'critical' | 'important' | 'nice-to-have'): StackCategory[] => {
  return stackCategories.filter(category => category.priority === priority);
};

/**
 * Get categories required for specific compliance frameworks
 */
export const getCategoriesForCompliance = (framework: string): StackCategory[] => {
  return stackCategories.filter(category => 
    category.required_for_compliance?.includes(framework)
  );
};

/**
 * Calculate base completeness score based on filled categories
 */
export const calculateCompletenessScore = (existingStack: any): number => {
  const criticalCategories = getCategoriesByPriority('critical');
  const importantCategories = getCategoriesByPriority('important');
  
  const filledCritical = criticalCategories.filter(cat => 
    existingStack[cat.id] && existingStack[cat.id].length > 0
  ).length;
  
  const filledImportant = importantCategories.filter(cat => 
    existingStack[cat.id] && existingStack[cat.id].length > 0
  ).length;
  
  // Weight critical categories more heavily
  const criticalScore = (filledCritical / criticalCategories.length) * 60; // 60% weight
  const importantScore = (filledImportant / importantCategories.length) * 30; // 30% weight
  
  // Nice-to-have categories contribute remaining 10%
  const niceToHaveCategories = getCategoriesByPriority('nice-to-have');
  const filledNiceToHave = niceToHaveCategories.filter(cat => 
    existingStack[cat.id] && existingStack[cat.id].length > 0
  ).length;
  const niceToHaveScore = (filledNiceToHave / niceToHaveCategories.length) * 10;
  
  return Math.round(criticalScore + importantScore + niceToHaveScore);
};
