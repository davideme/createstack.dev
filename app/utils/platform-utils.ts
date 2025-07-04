import type { Platform } from "~/types/project";

export const getEcosystemBenefits = (platformId: string): string => {
  const benefits = {
    github: "Largest developer community, extensive third-party integrations, GitHub Actions for CI/CD",
    gitlab: "Built-in DevOps lifecycle tools, integrated CI/CD, container registry, security scanning",
    bitbucket: "Seamless Atlassian suite integration (Jira, Confluence), built-in CI/CD with Pipelines",
    azure: "Native Microsoft/Azure ecosystem integration, Azure DevOps services, enterprise features",
    codecommit: "AWS service integration, IAM-based access control, scalable and secure",
    sourcehut: "Minimal, privacy-focused, email-based workflows, no JavaScript dependencies",
    gitea: "Self-hosted control, lightweight resource usage, customizable to organization needs"
  }
  return benefits[platformId as keyof typeof benefits] || "Platform-specific integration benefits"
};

export const getTeamFamiliarityNotes = (platformId: string): string => {
  const notes = {
    github: "Most widely known platform among developers",
    gitlab: "Growing adoption, especially in enterprise environments",
    bitbucket: "Common in organizations already using Atlassian tools",
    azure: "Familiar to teams working with Microsoft technologies",
    codecommit: "Suitable for AWS-native development teams",
    sourcehut: "Appeals to developers preferring minimal, traditional workflows",
    gitea: "Requires self-hosting expertise but offers full control"
  }
  return notes[platformId as keyof typeof notes] || "Team will need to learn platform-specific features"
};

export const getTechnicalConsiderations = (platformId: string): string => {
  const considerations = {
    github: `- Git-based version control with web interface
- GitHub Actions for CI/CD automation
- API access for integrations
- Large file storage with Git LFS support
- Advanced security features (Dependabot, CodeQL)`,
    gitlab: `- Comprehensive DevOps platform beyond just Git hosting
- Built-in CI/CD with GitLab Runners
- Integrated container registry and package management
- Security and compliance features built-in
- Self-hosted options available`,
    bitbucket: `- Git and Mercurial support (though Mercurial is legacy)
- Bitbucket Pipelines for CI/CD
- Jira integration for issue tracking
- Code insights and quality gates
- Atlassian ecosystem synergy`,
    azure: `- Integrated with Azure DevOps services
- Azure Pipelines for CI/CD
- Azure Artifacts for package management
- Strong integration with Microsoft development tools
- Enterprise-grade security and compliance`,
    codecommit: `- Fully managed Git service by AWS
- Scales automatically with usage
- Integrated with AWS IAM for access control
- Pay-per-use pricing model
- Regional availability for compliance`,
    sourcehut: `- Email-based workflows (patches via email)
- Minimal web interface, focus on Git fundamentals
- No JavaScript required for basic operations
- Open-source and transparent development model
- Builds.sr.ht for CI/CD`,
    gitea: `- Self-hosted Git service with full control
- Lightweight and fast performance
- Customizable to organization needs
- API compatibility with other platforms
- Requires infrastructure management`
  }
  return considerations[platformId as keyof typeof considerations] || "Standard Git hosting capabilities with platform-specific features"
};

export const getPositiveConsequences = (platformId: string): string[] => {
  const positive = {
    github: [
      "Access to the largest developer community and ecosystem",
      "Extensive marketplace of actions and integrations",
      "Strong brand recognition for open-source projects",
      "Excellent documentation and learning resources"
    ],
    gitlab: [
      "Complete DevOps lifecycle in a single platform",
      "Built-in security scanning and compliance tools",
      "No need for multiple tool integrations",
      "Strong self-hosted options for enterprise needs"
    ],
    bitbucket: [
      "Seamless workflow with existing Atlassian tools",
      "Integrated project management through Jira",
      "Good CI/CD capabilities with Pipelines",
      "Familiar interface for Atlassian users"
    ],
    azure: [
      "Native integration with Microsoft development stack",
      "Enterprise-grade security and compliance features",
      "Unified Azure ecosystem for cloud-native development",
      "Strong Visual Studio and VS Code integration"
    ],
    codecommit: [
      "Tight integration with AWS services and IAM",
      "Automatic scaling without infrastructure management",
      "Pay-per-use pricing model",
      "Regional data residency options"
    ],
    sourcehut: [
      "Privacy-focused development environment",
      "Traditional, email-based Git workflows",
      "No JavaScript dependencies",
      "Transparent and open-source platform"
    ],
    gitea: [
      "Full control over hosting and customization",
      "Lightweight resource requirements",
      "No vendor lock-in",
      "Cost-effective for large teams"
    ]
  }
  return positive[platformId as keyof typeof positive] || ["Platform-specific advantages"]
};

export const getNegativeConsequences = (platformId: string): string[] => {
  const negative = {
    github: [
      "Potential vendor lock-in with platform-specific features",
      "Limited self-hosting options",
      "Can be expensive for large private repositories",
      "Subject to Microsoft's strategic decisions"
    ],
    gitlab: [
      "Can be complex for simple use cases",
      "Requires learning GitLab-specific workflows",
      "Self-hosted version requires infrastructure expertise",
      "Less third-party ecosystem compared to GitHub"
    ],
    bitbucket: [
      "Smaller community compared to GitHub",
      "Limited marketplace of integrations",
      "Tied to Atlassian ecosystem decisions",
      "Less suitable for open-source community projects"
    ],
    azure: [
      "Requires familiarity with Microsoft ecosystem",
      "Can be complex for non-Microsoft stack projects",
      "Learning curve for Azure DevOps concepts",
      "Pricing can be complex to understand"
    ],
    codecommit: [
      "AWS-specific, less suitable for multi-cloud strategies",
      "Limited community features",
      "No built-in project management tools",
      "Requires AWS account and billing setup"
    ],
    sourcehut: [
      "Minimal web interface may not suit all users",
      "Email-based workflows require adaptation",
      "Smaller community and ecosystem",
      "Limited third-party integrations"
    ],
    gitea: [
      "Requires self-hosting infrastructure and maintenance",
      "Team needs expertise in server management",
      "Responsibility for security updates and backups",
      "May lack some advanced features of hosted solutions"
    ]
  }
  return negative[platformId as keyof typeof negative] || ["Platform-specific limitations"]
};

export const getCIGuidance = (platformId: string): string => {
  const guidance = {
    github: "(GitHub Actions recommended)",
    gitlab: "(GitLab CI/CD built-in)",
    bitbucket: "(Bitbucket Pipelines available)",
    azure: "(Azure Pipelines integration)",
    codecommit: "(integrate with AWS CodeBuild/CodePipeline)",
    sourcehut: "(builds.sr.ht for CI builds)",
    gitea: "(external CI/CD tools like Jenkins, GitLab CI, or GitHub Actions)"
  }
  return guidance[platformId as keyof typeof guidance] || "(configure appropriate CI/CD solution)"
};

export const getAlternativesConsidered = (selectedPlatformId: string, platforms: Platform[]): string => {
  const alternatives = platforms
    .filter(p => p.id !== selectedPlatformId)
    .slice(0, 3) // Show top 3 alternatives
    .map(platform => `- **${platform.name}**: ${platform.description} Best for: ${platform.bestFor}`)
    .join('\n')
  
  return alternatives || "Other major Git hosting platforms were evaluated but deemed less suitable for this project's requirements."
};
