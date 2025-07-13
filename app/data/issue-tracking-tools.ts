import type { IssueTrackingTool } from "~/types/project";

export const issueTrackingTools: IssueTrackingTool[] = [
  {
    id: "github-issues",
    name: "GitHub Issues",
    emoji: "🐛",
    description: "GitHub's built-in issue tracking system. ✅ Integrated with GitHub, labels, milestones, project boards, discussions. Perfect for software projects.",
    platform: "GitHub",
    bestFor: "GitHub repositories, open source projects, agile development teams.",
    pricing: "Free for public repos, included with GitHub plans",
    features: ["Issue templates", "Labels & milestones", "Project boards", "Discussions", "Assignees", "Automation"],
    url: "https://docs.github.com/en/issues",
    targetPersonas: ["developer", "product-owner", "qa-tester"],
    complexityLevel: "beginner"
  },
  {
    id: "gitlab-issues",
    name: "GitLab Issues",
    emoji: "🦊",
    description: "GitLab's integrated issue tracking and project management. ✅ Epics, issue boards, time tracking, requirements management.",
    platform: "GitLab",
    bestFor: "GitLab users, DevOps teams, requirement tracking.",
    pricing: "Free tier, Premium from $19/user/month",
    features: ["Issue boards", "Epics", "Time tracking", "Requirements", "Health status", "Iterations"],
    url: "https://docs.gitlab.com/ee/user/project/issues/",
    targetPersonas: ["developer", "product-owner", "devops", "qa-tester"],
    complexityLevel: "intermediate"
  },
  {
    id: "jira",
    name: "Jira",
    emoji: "🔷",
    description: "Atlassian's comprehensive issue tracking and project management tool. ✅ Agile workflows, custom fields, advanced reporting, integrations.",
    platform: "Multi-platform",
    bestFor: "Enterprise teams, agile development, complex project management.",
    pricing: "Free up to 10 users, Standard from $7/user/month",
    features: ["Agile boards", "Custom workflows", "Advanced reporting", "JQL search", "Automation", "Integrations"],
    url: "https://www.atlassian.com/software/jira",
    targetPersonas: ["product-owner", "developer", "qa-tester", "stakeholder"],
    complexityLevel: "advanced"
  },
  {
    id: "linear",
    name: "Linear",
    emoji: "🚀",
    description: "Modern issue tracking built for high-performance teams. ✅ Fast interface, keyboard shortcuts, Git integration, cycles, roadmaps.",
    platform: "Multi-platform",
    bestFor: "Product teams, fast-moving startups, engineering teams.",
    pricing: "Free up to 10 users, Standard from $8/user/month",
    features: ["Fast interface", "Cycles", "Roadmaps", "Git integration", "Keyboard shortcuts", "SLA tracking"],
    url: "https://linear.app/",
    targetPersonas: ["product-owner", "developer", "designer"],
    complexityLevel: "intermediate"
  },
  {
    id: "asana",
    name: "Asana",
    emoji: "📋",
    description: "Work management platform with project tracking. ✅ Project views, task dependencies, team collaboration, timeline view.",
    platform: "Multi-platform",
    bestFor: "Cross-functional teams, project management, task coordination.",
    pricing: "Free up to 15 users, Premium from $10.99/user/month",
    features: ["Multiple project views", "Task dependencies", "Timeline view", "Custom fields", "Proofing", "Portfolios"],
    url: "https://asana.com/",
    targetPersonas: ["product-owner", "stakeholder", "designer", "technical-writer"],
    complexityLevel: "beginner"
  },
  {
    id: "trello",
    name: "Trello",
    emoji: "📌",
    description: "Visual project management with Kanban boards. ✅ Simple interface, Power-Ups, automation, team collaboration.",
    platform: "Multi-platform",
    bestFor: "Small teams, visual project management, simple workflows.",
    pricing: "Free, Standard from $5/user/month",
    features: ["Kanban boards", "Power-Ups", "Automation", "Calendar view", "Team collaboration", "Mobile apps"],
    url: "https://trello.com/",
    targetPersonas: ["product-owner", "designer", "stakeholder"],
    complexityLevel: "beginner"
  },
  {
    id: "notion",
    name: "Notion",
    emoji: "📝",
    description: "All-in-one workspace with database and project management. ✅ Flexible databases, templates, team wikis, custom properties.",
    platform: "Multi-platform",
    bestFor: "Knowledge management, documentation, flexible project tracking.",
    pricing: "Free for personal use, Plus from $8/user/month",
    features: ["Database views", "Templates", "Team wikis", "Custom properties", "Automation", "AI features"],
    url: "https://www.notion.so/",
    targetPersonas: ["product-owner", "technical-writer", "designer", "stakeholder"],
    complexityLevel: "intermediate"
  },
  {
    id: "azure-boards",
    name: "Azure Boards",
    emoji: "🔵",
    description: "Microsoft's agile project management tool. ✅ Work items, backlogs, sprints, queries, Azure DevOps integration.",
    platform: "Azure DevOps",
    bestFor: "Microsoft ecosystem, enterprise teams, agile development.",
    pricing: "Free up to 5 users, Basic from $6/user/month",
    features: ["Work items", "Backlogs", "Sprints", "Queries", "Dashboards", "Azure integration"],
    url: "https://azure.microsoft.com/en-us/products/devops/boards/",
    targetPersonas: ["developer", "product-owner", "devops", "stakeholder"],
    complexityLevel: "intermediate"
  },
  {
    id: "monday",
    name: "Monday.com",
    emoji: "📊",
    description: "Work management platform with customizable workflows. ✅ Custom workflows, automation, dashboards, time tracking.",
    platform: "Multi-platform",
    bestFor: "Project management, team collaboration, custom workflows.",
    pricing: "Basic from $8/user/month",
    features: ["Custom workflows", "Automation", "Dashboards", "Time tracking", "Forms", "Integrations"],
    url: "https://monday.com/",
    targetPersonas: ["product-owner", "stakeholder", "designer"],
    complexityLevel: "intermediate"
  },
  {
    id: "clickup",
    name: "ClickUp",
    emoji: "⚡",
    description: "All-in-one productivity platform. ✅ Multiple views, goals, docs, time tracking, automation, custom fields.",
    platform: "Multi-platform",
    bestFor: "All-in-one solution, productivity teams, feature-rich requirements.",
    pricing: "Free tier, Unlimited from $7/user/month",
    features: ["Multiple views", "Goals", "Docs", "Time tracking", "Automation", "Custom fields"],
    url: "https://clickup.com/",
    targetPersonas: ["product-owner", "developer", "designer", "qa-tester"],
    complexityLevel: "advanced"
  }
];

export function getAvailableIssueTrackingTools(platform: string, personas: string[] = []): IssueTrackingTool[] {
  let tools = [...issueTrackingTools];
  
  // If personas are specified, filter and sort by persona relevance
  if (personas.length > 0) {
    tools = tools.map(tool => {
      // Calculate relevance score based on persona overlap
      const relevanceScore = tool.targetPersonas.filter(persona => personas.includes(persona)).length;
      return { ...tool, relevanceScore };
    })
    .sort((a, b) => {
      // Sort by relevance first, then by complexity (simpler first)
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }
      const complexityOrder = { beginner: 1, intermediate: 2, advanced: 3 };
      return complexityOrder[a.complexityLevel] - complexityOrder[b.complexityLevel];
    });
  }
  
  // Platform-specific prioritization
  if (platform === "github") {
    tools = tools.sort((a, b) => {
      if (a.id === "github-issues") return -1;
      if (b.id === "github-issues") return 1;
      return 0;
    });
  } else if (platform === "gitlab") {
    tools = tools.sort((a, b) => {
      if (a.id === "gitlab-issues") return -1;
      if (b.id === "gitlab-issues") return 1;
      return 0;
    });
  } else if (platform === "azure") {
    tools = tools.sort((a, b) => {
      if (a.id === "azure-boards") return -1;
      if (b.id === "azure-boards") return 1;
      return 0;
    });
  }
  
  return tools;
}

export function getIssueTrackingToolDocumentationUrl(toolId: string): string {
  const tool = issueTrackingTools.find(t => t.id === toolId);
  return tool?.url || "#";
}

export function isIssueTrackingToolNativeToPlatform(platform: string, toolId: string): boolean {
  const nativeMappings: Record<string, string[]> = {
    github: ["github-issues"],
    gitlab: ["gitlab-issues"],
    azure: ["azure-boards"]
  };
  
  return nativeMappings[platform]?.includes(toolId) || false;
}
