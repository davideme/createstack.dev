import type { DependencyTool } from "~/types/project";

export const getDependencyTechnicalConsiderations = (toolId: string): string => {
  const considerations = {
    dependabot: `- Native GitHub integration with zero configuration overhead
- Automatic security vulnerability detection and patching
- Support for 20+ package ecosystems and languages
- Pull request-based workflow for dependency updates
- Configurable update schedules and grouping options`,
    renovate: `- Universal platform support (GitHub, GitLab, Bitbucket, Azure DevOps)
- Highly configurable with extensive customization options
- Support for 60+ package managers and ecosystems
- Advanced scheduling and grouping capabilities
- Self-hosted deployment option for enhanced control`,
    snyk: `- Security-first approach with comprehensive vulnerability database
- License compliance scanning and policy enforcement
- Container and infrastructure as code scanning
- IDE integrations for developer workflow integration
- Advanced reporting and analytics capabilities`,
    whitesource: `- Enterprise-grade compliance and risk management
- Support for 200+ programming languages and package managers
- Advanced license policy enforcement and legal compliance
- Risk scoring and prioritization algorithms
- Integration with enterprise security and compliance workflows`,
    "gitlab-deps": `- Native GitLab integration with built-in CI/CD pipeline support
- Security dashboard with merge request integration
- Automatic vulnerability detection in CI/CD pipelines
- Policy-based security gates and compliance controls
- Integration with GitLab's complete DevOps platform`,
    manual: `- Complete control over dependency update timing and process
- No automated changes or potential breaking updates
- Custom review and testing processes for each update
- Requires manual monitoring of security advisories
- Time-intensive but provides maximum oversight`
  }
  return considerations[toolId as keyof typeof considerations] || "Standard dependency management capabilities"
};

export const getDependencyPositiveConsequences = (toolId: string): string[] => {
  const positive = {
    dependabot: [
      "Zero configuration required for basic functionality",
      "Native GitHub integration ensures seamless workflow",
      "Automatic security vulnerability patching reduces risk",
      "Free for all GitHub repositories",
      "Well-documented and widely adopted"
    ],
    renovate: [
      "Platform-agnostic solution works across different Git hosts",
      "Highly customizable to fit complex project requirements",
      "Self-hosted option provides complete control and privacy",
      "Advanced scheduling prevents overwhelming pull requests",
      "Active open-source community and regular updates"
    ],
    snyk: [
      "Security-focused approach prioritizes vulnerability management",
      "Comprehensive license compliance reduces legal risks",
      "Developer-friendly IDE integrations catch issues early",
      "Detailed vulnerability intelligence and remediation guidance",
      "Enterprise-grade reporting and compliance features"
    ],
    whitesource: [
      "Enterprise-scale support for large organizations",
      "Comprehensive language and ecosystem coverage",
      "Advanced compliance and risk management capabilities",
      "Professional support and service level agreements",
      "Integration with enterprise security frameworks"
    ],
    "gitlab-deps": [
      "Native integration with GitLab's complete DevOps platform",
      "Built-in security dashboard and reporting",
      "Automatic integration with CI/CD pipelines",
      "Policy enforcement at the merge request level",
      "No additional tool licensing for GitLab users"
    ],
    manual: [
      "Complete control over update timing and testing",
      "No risk of automated breaking changes",
      "Custom review processes ensure quality",
      "No dependency on external tools or services",
      "Perfect understanding of all changes being made"
    ]
  }
  return positive[toolId as keyof typeof positive] || ["Tool-specific advantages"]
};

export const getDependencyNegativeConsequences = (toolId: string): string[] => {
  const negative = {
    dependabot: [
      "Limited to GitHub platform only",
      "Less configuration flexibility compared to alternatives",
      "Can generate many pull requests without careful configuration",
      "Limited support for complex monorepo scenarios",
      "Dependency on GitHub's service availability"
    ],
    renovate: [
      "Requires more initial configuration and setup time",
      "Can be overwhelming with extensive configuration options",
      "Self-hosted deployment requires infrastructure management",
      "Learning curve for advanced configuration features",
      "May require dedicated team member for optimal configuration"
    ],
    snyk: [
      "Commercial product with licensing costs for advanced features",
      "Can be noisy with many security alerts requiring triage",
      "Focus on security may miss functional dependency updates",
      "Requires integration setup across development tools",
      "May require security expertise to interpret results effectively"
    ],
    whitesource: [
      "Enterprise pricing may be prohibitive for smaller teams",
      "Complex setup and configuration for full feature utilization",
      "Requires dedicated compliance and security expertise",
      "May be overkill for simple projects or small teams",
      "Vendor lock-in with proprietary enterprise features"
    ],
    "gitlab-deps": [
      "Limited to GitLab platform and users",
      "Premium features require paid GitLab subscription",
      "Less extensive than dedicated dependency management tools",
      "Dependent on GitLab's roadmap and feature priorities",
      "May not cover all specialized package managers"
    ],
    manual: [
      "Significant time investment required for monitoring and updates",
      "High risk of missing critical security vulnerabilities",
      "Prone to human error and inconsistent processes",
      "Does not scale well with project or team growth",
      "May lead to outdated dependencies and technical debt"
    ]
  }
  return negative[toolId as keyof typeof negative] || ["Tool-specific limitations"]
};

export const getDependencyImplementationEffort = (toolId: string): string => {
  const effort = {
    dependabot: "Low - Enable in GitHub repository settings, optionally add .github/dependabot.yml",
    renovate: "Medium - Configure renovate.json and set up authentication",
    snyk: "Medium - Install CLI, configure integrations, set up policies",
    whitesource: "High - Enterprise deployment, policy configuration, training",
    "gitlab-deps": "Low - Enable in GitLab project settings and CI/CD pipeline",
    manual: "High - Establish processes, monitoring, and update procedures"
  }
  return effort[toolId as keyof typeof effort] || "Varies based on tool complexity"
};

export const getDependencyTrainingRequirements = (toolId: string): string => {
  const training = {
    dependabot: "Minimal - Basic understanding of pull request workflows",
    renovate: "Moderate - Configuration syntax and scheduling concepts",
    snyk: "Moderate - Security vulnerability assessment and remediation",
    whitesource: "Extensive - Enterprise compliance and policy management",
    "gitlab-deps": "Minimal - GitLab CI/CD and merge request workflows",
    manual: "Extensive - Security monitoring and update best practices"
  }
  return training[toolId as keyof typeof training] || "Standard tool-specific training"
};

export const getDependencyImplementationSteps = (toolId: string): string[] => {
  const steps = {
    dependabot: [
      "Enable Dependabot security updates in repository settings",
      "Create .github/dependabot.yml configuration file",
      "Configure update schedules and package ecosystems",
      "Set up branch protection rules for automated PRs",
      "Configure team notification preferences"
    ],
    renovate: [
      "Install Renovate app or configure self-hosted instance",
      "Create renovate.json configuration file",
      "Configure platform authentication and permissions",
      "Set up update schedules and grouping rules",
      "Configure branch protection and auto-merge policies"
    ],
    snyk: [
      "Sign up for Snyk account and install CLI tools",
      "Integrate with repository and CI/CD pipelines",
      "Configure vulnerability policies and thresholds",
      "Set up IDE integrations for developer workflows",
      "Establish security triage and remediation processes"
    ],
    whitesource: [
      "Deploy WhiteSource agents and configure organization settings",
      "Set up project scanning and policy enforcement",
      "Configure license compliance rules and approval workflows",
      "Integrate with enterprise security and compliance systems",
      "Train team on compliance reporting and risk management"
    ],
    "gitlab-deps": [
      "Enable dependency scanning in GitLab project settings",
      "Configure .gitlab-ci.yml to include dependency scanning jobs",
      "Set up security dashboard monitoring and alerts",
      "Configure merge request security policies",
      "Establish vulnerability triage and remediation workflows"
    ],
    manual: [
      "Establish dependency monitoring and tracking processes",
      "Create update schedules and responsibility assignments",
      "Set up security advisory monitoring systems",
      "Develop testing and validation procedures for updates",
      "Document update procedures and emergency response plans"
    ]
  }
  return steps[toolId as keyof typeof steps] || ["Configure tool according to documentation", "Set up monitoring and alerting", "Train team on tool usage", "Establish update and triage processes"]
};

export const getDependencyAlternativesConsidered = (selectedToolId: string, dependencyTools: DependencyTool[]): string => {
  const alternatives = dependencyTools
    .filter(t => t.id !== selectedToolId)
    .slice(0, 3) // Show top 3 alternatives
    .map(tool => `- **${tool.name}**: ${tool.description} Best for: ${tool.bestFor}`)
    .join('\n')
  
  return alternatives || "Other dependency management approaches were evaluated but deemed less suitable for this project's requirements."
};
