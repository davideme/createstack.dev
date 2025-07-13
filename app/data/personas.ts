import type { TeamPersona } from "~/types/project";

export const teamPersonas: TeamPersona[] = [
  {
    id: "developer",
    name: "Developer",
    emoji: "👨‍💻",
    description: "Software engineers and developers who write, test, and maintain code",
    primaryFocus: "Code quality, development efficiency, technical excellence",
    commonTools: ["GitHub", "GitLab", "VS Code", "Docker", "npm", "yarn", "Jest", "ESLint"]
  },
  {
    id: "product-manager",
    name: "Product Manager",
    emoji: "📋",
    description: "Product managers who define requirements, prioritize features, and track progress",
    primaryFocus: "Feature planning, roadmap management, stakeholder communication",
    commonTools: ["Jira", "Asana", "Linear", "Notion", "Confluence", "Figma", "Miro"]
  },
  {
    id: "designer",
    name: "Designer",
    emoji: "🎨",
    description: "UX/UI designers who create user experiences and visual designs",
    primaryFocus: "User experience, visual design, design systems",
    commonTools: ["Figma", "Sketch", "Adobe XD", "InVision", "Miro", "Storybook"]
  },
  {
    id: "devops",
    name: "DevOps Engineer",
    emoji: "🔧",
    description: "DevOps engineers who manage infrastructure, deployments, and operations",
    primaryFocus: "Infrastructure, CI/CD, monitoring, reliability",
    commonTools: ["Docker", "Kubernetes", "Terraform", "AWS", "Jenkins", "GitHub Actions"]
  },
  {
    id: "qa-tester",
    name: "QA Tester",
    emoji: "🧪",
    description: "Quality assurance engineers who test software and ensure quality",
    primaryFocus: "Testing, quality assurance, bug reporting",
    commonTools: ["Selenium", "Cypress", "Jest", "Postman", "Jira", "TestRail"]
  },
  {
    id: "technical-writer",
    name: "Technical Writer",
    emoji: "📝",
    description: "Technical writers who create documentation and user guides",
    primaryFocus: "Documentation, user guides, API documentation",
    commonTools: ["GitBook", "Confluence", "Notion", "Markdown", "Sphinx", "Docusaurus"]
  },
  {
    id: "stakeholder",
    name: "Stakeholder",
    emoji: "👔",
    description: "Business stakeholders, executives, and decision makers",
    primaryFocus: "Business outcomes, ROI, project visibility",
    commonTools: ["Slack", "Microsoft Teams", "PowerBI", "Tableau", "Excel", "Monday.com"]
  },
  {
    id: "data-scientist",
    name: "Data Scientist",
    emoji: "📊",
    description: "Data scientists and analysts who work with data and machine learning",
    primaryFocus: "Data analysis, machine learning, insights",
    commonTools: ["Jupyter", "Python", "R", "Tableau", "Power BI", "Docker", "Git"]
  }
];

export function getPersonasByIds(personaIds: string[]): TeamPersona[] {
  return teamPersonas.filter(persona => personaIds.includes(persona.id));
}

export function getPersonaById(personaId: string): TeamPersona | undefined {
  return teamPersonas.find(persona => persona.id === personaId);
}
