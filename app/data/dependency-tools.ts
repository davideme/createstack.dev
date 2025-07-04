import type { DependencyTool } from "~/types/project";

export const dependencyTools: DependencyTool[] = [
  {
    id: "dependabot",
    name: "Dependabot",
    emoji: "🤖",
    description: "GitHub's built-in automated dependency updates. ✅ Security alerts, automated PRs, supports 20+ ecosystems. Languages: JavaScript/Node.js, Python, Ruby, Java, .NET, Go, PHP, Rust, Elixir, Docker, GitHub Actions.",
    platform: "GitHub",
    bestFor: "GitHub repositories, automated security updates.",
    pricing: "Free on GitHub",
    features: ["Security alerts", "Automated PRs", "Version updates", "Vulnerability scanning"]
  },
  {
    id: "renovate",
    name: "Renovate",
    emoji: "🔄",
    description: "Universal dependency update tool. ✅ Multi-platform support, highly configurable, self-hosted option available. Languages: JavaScript/Node.js, Python, Java, .NET, Go, PHP, Ruby, Rust, Docker, Kubernetes, Terraform, and 60+ package managers.",
    platform: "Multi-platform",
    bestFor: "Complex projects, custom update strategies.",
    pricing: "Free (self-hosted), WhiteSource hosted plans available",
    features: ["Multi-platform", "Custom configs", "Scheduled updates", "Grouped updates"]
  },
  {
    id: "snyk",
    name: "Snyk",
    emoji: "🛡️",
    description: "Security-focused dependency scanning. ✅ Vulnerability database, license compliance, container scanning. Languages: JavaScript/Node.js, Python, Java, .NET, Ruby, Go, PHP, Scala, Swift, C/C++, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Security-first teams, enterprise compliance.",
    pricing: "Free tier, Pro plans from $25/month",
    features: ["Vulnerability scanning", "License compliance", "Container security", "IDE integrations"]
  },
  {
    id: "whitesource",
    name: "WhiteSource (Mend)",
    emoji: "🔍",
    description: "Enterprise dependency management. ✅ License compliance, vulnerability scanning, policy enforcement. Languages: JavaScript/Node.js, Python, Java, .NET, Ruby, Go, PHP, C/C++, Scala, R, and 200+ programming languages.",
    platform: "Multi-platform",
    bestFor: "Enterprise teams, compliance requirements.",
    pricing: "Enterprise pricing, contact for quotes",
    features: ["License scanning", "Policy enforcement", "Risk assessment", "Compliance reporting"]
  },
  {
    id: "gitlab-deps",
    name: "GitLab Dependency Scanning",
    emoji: "🦊",
    description: "GitLab's built-in dependency scanning. ✅ Security dashboard, merge request integration, CI/CD native. Languages: JavaScript/Node.js, Python, Java, .NET, Go, PHP, Ruby, C/C++, Scala.",
    platform: "GitLab",
    bestFor: "GitLab users, integrated DevOps workflows.",
    pricing: "Free tier, Premium features from $19/user/month",
    features: ["Security dashboard", "MR integration", "CI/CD native", "Vulnerability management"]
  },
  {
    id: "manual",
    name: "Manual Management",
    emoji: "👤",
    description: "Traditional manual dependency updates. ⚠️ No automation, requires manual monitoring and updates. Languages: All programming languages (manual process).",
    platform: "Any",
    bestFor: "Small projects, full control over updates.",
    pricing: "Free (but requires developer time)",
    features: ["Full control", "No automation", "Manual review", "Custom timing"]
  }
];

export const getAvailableDependencyTools = (selectedPlatform: string): DependencyTool[] => {
  return dependencyTools.filter(tool => {
    // Platform-specific filtering
    if (tool.id === 'dependabot') {
      return selectedPlatform === 'github'
    }
    if (tool.id === 'gitlab-deps') {
      return selectedPlatform === 'gitlab'
    }
    // Other tools are available for all platforms
    return true
  })
};

export const getDependencyToolDocumentationUrl = (toolId: string): string => {
  const urls = {
    dependabot: "https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuring-dependabot-version-updates#enabling-dependabot-version-updates",
    renovate: "https://docs.renovatebot.com/getting-started/",
    snyk: "https://docs.snyk.io/getting-started",
    whitesource: "https://docs.mend.io/bundle/integrations/page/getting_started.html",
    "gitlab-deps": "https://docs.gitlab.com/ee/user/application_security/dependency_scanning/",
    manual: "#" // No specific documentation for manual management
  }
  return urls[toolId as keyof typeof urls] || "#"
};

export const isDependencyToolNativeToPlatform = (selectedPlatform: string, selectedDepTool: string): boolean => {
  return (selectedPlatform === 'github' && selectedDepTool === 'dependabot') ||
         (selectedPlatform === 'gitlab' && selectedDepTool === 'gitlab-deps')
};
