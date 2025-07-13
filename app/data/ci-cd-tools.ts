import type { CICDTool } from "~/types/project";

export const cicdTools: CICDTool[] = [
  {
    id: "github-actions",
    name: "GitHub Actions",
    emoji: "⚡",
    description: "GitHub's built-in CI/CD platform. ✅ Integrated with GitHub, extensive marketplace, matrix builds, self-hosted runners. Languages: All major languages, Docker, Kubernetes.",
    platform: "GitHub",
    bestFor: "GitHub repositories, open source projects, integrated workflows.",
    pricing: "Free for public repos, $0.008/minute for private repos",
    features: ["Matrix builds", "Self-hosted runners", "Marketplace actions", "Secrets management", "Artifact storage"]
  },
  {
    id: "gitlab-ci",
    name: "GitLab CI/CD",
    emoji: "🦊",
    description: "GitLab's integrated CI/CD solution. ✅ Auto DevOps, built-in container registry, Kubernetes integration. Languages: All major languages, Docker, Kubernetes.",
    platform: "GitLab",
    bestFor: "GitLab users, DevOps teams, container-first workflows.",
    pricing: "Free tier, Premium from $19/user/month",
    features: ["Auto DevOps", "Built-in registry", "Kubernetes integration", "Security scanning", "Review apps"]
  },
  {
    id: "jenkins",
    name: "Jenkins",
    emoji: "🏗️",
    description: "Open source automation server. ✅ Highly customizable, extensive plugin ecosystem, self-hosted. Languages: All major languages, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Enterprise teams, complex workflows, on-premises deployments.",
    pricing: "Free (self-hosted), enterprise support available",
    features: ["Plugin ecosystem", "Distributed builds", "Pipeline as code", "Blue Ocean UI", "Multi-branch support"]
  },
  {
    id: "circleci",
    name: "CircleCI",
    emoji: "🔵",
    description: "Cloud-native CI/CD platform. ✅ Fast builds, Docker support, parallelism, orbs ecosystem. Languages: All major languages, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Fast builds, Docker workflows, parallelism.",
    pricing: "Free tier, Performance from $15/month",
    features: ["Fast builds", "Docker support", "Parallelism", "Orbs marketplace", "SSH debugging"]
  },
  {
    id: "travis-ci",
    name: "Travis CI",
    emoji: "🚀",
    description: "Hosted CI service for GitHub. ✅ Easy setup, multiple environments, build matrix. Languages: All major languages, Docker.",
    platform: "GitHub",
    bestFor: "Open source projects, simple CI workflows.",
    pricing: "Free for open source, plans from $69/month",
    features: ["Easy setup", "Build matrix", "Multiple environments", "Deployment integrations", "Caching"]
  },
  {
    id: "azure-pipelines",
    name: "Azure Pipelines",
    emoji: "🔷",
    description: "Microsoft's cloud CI/CD service. ✅ Multi-platform, YAML pipelines, Microsoft ecosystem integration. Languages: All major languages, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Microsoft ecosystem, enterprise teams, multi-platform builds.",
    pricing: "Free tier, $40/month for additional parallel jobs",
    features: ["Multi-platform", "YAML pipelines", "Microsoft integration", "Parallel jobs", "Release gates"]
  },
  {
    id: "aws-codebuild",
    name: "AWS CodeBuild",
    emoji: "🟠",
    description: "AWS managed build service. ✅ Serverless, auto-scaling, deep AWS integration. Languages: All major languages, Docker.",
    platform: "Multi-platform",
    bestFor: "AWS workloads, serverless applications, auto-scaling builds.",
    pricing: "Pay per build minute, free tier available",
    features: ["Serverless", "Auto-scaling", "AWS integration", "Custom build environments", "Artifact storage"]
  },
  {
    id: "bitbucket-pipelines",
    name: "Bitbucket Pipelines",
    emoji: "🪣",
    description: "Atlassian's integrated CI/CD for Bitbucket. ✅ Docker-based, Atlassian ecosystem, deployment tracking. Languages: All major languages, Docker.",
    platform: "Bitbucket",
    bestFor: "Atlassian ecosystem, Docker-based workflows.",
    pricing: "Free tier, $10/month for additional minutes",
    features: ["Docker-based", "Atlassian integration", "Deployment tracking", "Branch permissions", "Smart mirroring"]
  },
  {
    id: "teamcity",
    name: "TeamCity",
    emoji: "🏢",
    description: "JetBrains' enterprise CI/CD server. ✅ Powerful build chains, extensive IDE integration, on-premises. Languages: All major languages, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Enterprise teams, complex build chains, JetBrains ecosystem.",
    pricing: "Free for small teams, enterprise licensing available",
    features: ["Build chains", "IDE integration", "Powerful UI", "Build artifacts", "Test reporting"]
  },
  {
    id: "buildkite",
    name: "Buildkite",
    emoji: "🔨",
    description: "Hybrid CI/CD platform. ✅ Self-hosted agents, cloud dashboard, parallelism. Languages: All major languages, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Hybrid deployments, high-performance builds, custom infrastructure.",
    pricing: "Free for open source, $15/user/month",
    features: ["Self-hosted agents", "Cloud dashboard", "Parallelism", "Custom infrastructure", "Artifact storage"]
  },
  {
    id: "drone",
    name: "Drone",
    emoji: "🚁",
    description: "Container-native CI/CD platform. ✅ Docker-based, lightweight, cloud or on-premises. Languages: All major languages, Docker, Kubernetes.",
    platform: "Multi-platform",
    bestFor: "Container-first workflows, lightweight deployments.",
    pricing: "Open source version free, enterprise support available",
    features: ["Container-native", "Lightweight", "Plugin ecosystem", "Multi-architecture", "Secrets management"]
  },
  {
    id: "manual",
    name: "Manual Deployment",
    emoji: "👤",
    description: "Manual deployment process. ✅ Full control, custom workflows, no external dependencies. Suitable for: Small teams, simple projects, security-sensitive environments.",
    platform: "Multi-platform",
    bestFor: "Simple projects, security-sensitive environments, full control.",
    pricing: "Free (manual labor costs)",
    features: ["Full control", "No external dependencies", "Custom workflows", "Security compliance", "Simple setup"]
  }
];

export function getAvailableCICDTools(platform: string): CICDTool[] {
  return cicdTools.filter(tool => 
    tool.platform === "Multi-platform" || 
    tool.platform === platform ||
    (platform === "github" && tool.platform === "GitHub") ||
    (platform === "gitlab" && tool.platform === "GitLab") ||
    (platform === "bitbucket" && tool.platform === "Bitbucket")
  );
}

export function getCICDToolDocumentationUrl(toolId: string): string {
  const urls: Record<string, string> = {
    "github-actions": "https://docs.github.com/en/actions",
    "gitlab-ci": "https://docs.gitlab.com/ee/ci/",
    "jenkins": "https://www.jenkins.io/doc/",
    "circleci": "https://circleci.com/docs/",
    "travis-ci": "https://docs.travis-ci.com/",
    "azure-pipelines": "https://docs.microsoft.com/en-us/azure/devops/pipelines/",
    "aws-codebuild": "https://docs.aws.amazon.com/codebuild/",
    "bitbucket-pipelines": "https://support.atlassian.com/bitbucket-cloud/docs/get-started-with-bitbucket-pipelines/",
    "teamcity": "https://www.jetbrains.com/help/teamcity/",
    "buildkite": "https://buildkite.com/docs",
    "drone": "https://docs.drone.io/",
    "manual": "#"
  };
  return urls[toolId] || "#";
}

export function isCICDToolNativeToPlatform(platform: string, toolId: string): boolean {
  const nativeTools: Record<string, string[]> = {
    "github": ["github-actions"],
    "gitlab": ["gitlab-ci"],
    "bitbucket": ["bitbucket-pipelines"]
  };
  return nativeTools[platform]?.includes(toolId) || false;
}
