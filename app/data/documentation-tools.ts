export interface DocumentationTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  platform: string;
  bestFor: string;
  pricing: string;
  features: string[];
  url: string;
}

export const documentationTools: DocumentationTool[] = [
  {
    id: "github-wiki",
    name: "GitHub Wiki",
    emoji: "📖",
    description: "Built-in wiki system for GitHub repositories. ✅ Git-based, markdown support, collaborative editing. Perfect for project documentation.",
    platform: "GitHub",
    bestFor: "Simple project documentation, GitHub-hosted projects.",
    pricing: "Free with GitHub repositories",
    features: ["Markdown support", "Git-based", "Collaborative editing", "Version history"],
    url: "https://docs.github.com/en/communities/documenting-your-project-with-wikis"
  },
  {
    id: "gitlab-wiki",
    name: "GitLab Wiki",
    emoji: "📚",
    description: "GitLab's built-in wiki system. ✅ Markdown and AsciiDoc support, Git-based storage, integrated with CI/CD.",
    platform: "GitLab",
    bestFor: "GitLab projects, integrated documentation workflows.",
    pricing: "Free with GitLab repositories",
    features: ["Markdown/AsciiDoc", "Git storage", "CI/CD integration", "Access controls"],
    url: "https://docs.gitlab.com/ee/user/project/wiki/"
  },
  {
    id: "readme",
    name: "README.md",
    emoji: "📄",
    description: "Simple markdown file in repository root. ✅ Universal compatibility, version controlled, GitHub/GitLab rendering.",
    platform: "Universal",
    bestFor: "Quick start guides, simple project documentation.",
    pricing: "Free",
    features: ["Markdown syntax", "Version controlled", "Universal support", "Auto-rendered"],
    url: "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes"
  },
  {
    id: "gitbook",
    name: "GitBook",
    emoji: "📗",
    description: "Modern documentation platform. ✅ Beautiful UI, Git sync, collaborative editing, API documentation support.",
    platform: "Cloud/Self-hosted",
    bestFor: "Professional documentation, API docs, team collaboration.",
    pricing: "Free tier, Pro from $5/month per user",
    features: ["Rich editor", "Git integration", "API docs", "Team collaboration"],
    url: "https://www.gitbook.com/"
  },
  {
    id: "notion",
    name: "Notion",
    emoji: "📝",
    description: "All-in-one workspace for docs, wikis, and databases. ✅ Block-based editor, templates, collaboration features.",
    platform: "Cloud",
    bestFor: "Team wikis, knowledge bases, project planning.",
    pricing: "Free tier, Plus from $8/month per user",
    features: ["Block editor", "Databases", "Templates", "Real-time collaboration"],
    url: "https://www.notion.so/"
  },
  {
    id: "confluence",
    name: "Confluence",
    emoji: "🌊",
    description: "Atlassian's team workspace. ✅ Rich editing, Jira integration, templates, enterprise features.",
    platform: "Cloud/Server",
    bestFor: "Enterprise teams, Atlassian ecosystem, formal documentation.",
    pricing: "Standard from $5/month per user",
    features: ["Rich editor", "Jira integration", "Templates", "Advanced permissions"],
    url: "https://www.atlassian.com/software/confluence"
  },
  {
    id: "mkdocs",
    name: "MkDocs",
    emoji: "🏗️",
    description: "Static site generator for project documentation. ✅ Markdown-based, themes, plugins, GitHub Pages deployment.",
    platform: "Static/Self-hosted",
    bestFor: "Technical documentation, static sites, automated deployment.",
    pricing: "Free (open source)",
    features: ["Markdown-based", "Customizable themes", "Plugin system", "Static generation"],
    url: "https://www.mkdocs.org/"
  },
  {
    id: "docusaurus",
    name: "Docusaurus",
    emoji: "🦕",
    description: "Facebook's documentation platform. ✅ React-based, versioning, i18n, blog support, optimized for open source.",
    platform: "Static/Self-hosted",
    bestFor: "Open source projects, technical documentation, developer-focused sites.",
    pricing: "Free (open source)",
    features: ["React-based", "Versioning", "Internationalization", "Blog integration"],
    url: "https://docusaurus.io/"
  },
  {
    id: "gitiles",
    name: "Gitiles",
    emoji: "🔍",
    description: "Google's Git web interface with markdown rendering. ✅ Lightweight, fast browsing, markdown support.",
    platform: "Self-hosted",
    bestFor: "Git repository browsing, simple documentation hosting.",
    pricing: "Free (open source)",
    features: ["Git browsing", "Markdown rendering", "Lightweight", "Fast performance"],
    url: "https://gerrit.googlesource.com/gitiles/"
  },
  {
    id: "bookstack",
    name: "BookStack",
    emoji: "📚",
    description: "Self-hosted wiki-style documentation platform. ✅ WYSIWYG editor, hierarchical organization, user management.",
    platform: "Self-hosted",
    bestFor: "Private documentation, team wikis, self-hosted solutions.",
    pricing: "Free (open source)",
    features: ["WYSIWYG editor", "Hierarchical structure", "User management", "Full-text search"],
    url: "https://www.bookstackapp.com/"
  }
];

export function getAvailableDocumentationTools(platform: string): DocumentationTool[] {
  return documentationTools.filter(tool => 
    tool.platform === "Universal" || 
    tool.platform === platform || 
    tool.platform.includes("Multi-platform") ||
    tool.platform === "Cloud" ||
    tool.platform === "Static/Self-hosted" ||
    tool.platform === "Self-hosted" ||
    tool.platform === "Cloud/Self-hosted" ||
    tool.platform === "Cloud/Server"
  );
}

export function getDocumentationToolUrl(toolId: string): string {
  const tool = documentationTools.find(t => t.id === toolId);
  return tool?.url || "#";
}

export function isDocumentationToolNativeToPlatform(platform: string, toolId: string): boolean {
  const tool = documentationTools.find(t => t.id === toolId);
  if (!tool) return false;
  
  return (platform === "github" && toolId === "github-wiki") ||
         (platform === "gitlab" && toolId === "gitlab-wiki") ||
         (toolId === "readme"); // README is universal/native to all platforms
}
