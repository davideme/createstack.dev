import type { FeatureFlagTool } from "~/types/project";

export const featureFlagTools: FeatureFlagTool[] = [
  {
    id: "launchdarkly",
    name: "LaunchDarkly",
    emoji: "🚀",
    description: "Comprehensive feature flag management platform with advanced targeting, rollout controls, and experimentation capabilities.",
    platform: "Multi-platform",
    bestFor: "Enterprise teams, A/B testing, complex feature rollouts, experimentation",
    pricing: "Starter from $8.33/seat/month, Pro from $16.67/seat/month",
    features: ["Feature flags", "A/B testing", "Experimentation", "Targeting rules", "Rollout controls", "Analytics", "Integrations"],
    url: "https://launchdarkly.com/",
    targetPersonas: ["developer", "product-owner", "qa-tester", "stakeholder"],
    complexityLevel: "advanced"
  },
  {
    id: "split",
    name: "Split",
    emoji: "🔀",
    description: "Feature flag and experimentation platform with impact measurement and data-driven feature delivery.",
    platform: "Multi-platform",
    bestFor: "Product teams, feature experimentation, impact measurement",
    pricing: "Developer plan free, Team from $20/seat/month",
    features: ["Feature flags", "Impact measurement", "Experimentation", "Analytics", "Impressions tracking", "Integrations"],
    url: "https://www.split.io/",
    targetPersonas: ["developer", "product-owner", "qa-tester", "stakeholder"],
    complexityLevel: "intermediate"
  },
  {
    id: "flagsmith",
    name: "Flagsmith",
    emoji: "🏴",
    description: "Open-source feature flag and remote config service with self-hosted and cloud options.",
    platform: "Multi-platform",
    bestFor: "Teams wanting open-source solution, self-hosted environments",
    pricing: "Free up to 50k requests/month, Scale from $45/month",
    features: ["Feature flags", "Remote config", "A/B testing", "Segment targeting", "API-first", "Open source"],
    url: "https://flagsmith.com/",
    targetPersonas: ["developer", "devops", "product-owner"],
    complexityLevel: "intermediate"
  },
  {
    id: "posthog",
    name: "PostHog",
    emoji: "📊",
    description: "All-in-one product analytics platform with feature flags, session recording, and experimentation.",
    platform: "Multi-platform",
    bestFor: "Product teams, analytics-driven development, comprehensive product insights",
    pricing: "Free up to 1M events/month, Paid from $0.00031/event",
    features: ["Feature flags", "Product analytics", "Session recording", "Experimentation", "Cohort analysis", "Funnels"],
    url: "https://posthog.com/",
    targetPersonas: ["developer", "product-owner", "qa-tester", "stakeholder"],
    complexityLevel: "intermediate"
  },
  {
    id: "unleash",
    name: "Unleash",
    emoji: "🔓",
    description: "Open-source feature flag service with enterprise-grade features and flexible deployment options.",
    platform: "Multi-platform",
    bestFor: "Enterprise teams, open-source advocates, flexible deployment needs",
    pricing: "Open source free, Pro from $80/month",
    features: ["Feature toggles", "Gradual rollouts", "Activation strategies", "Metrics", "Environments", "API access"],
    url: "https://www.getunleash.io/",
    targetPersonas: ["developer", "devops", "product-owner"],
    complexityLevel: "intermediate"
  },
  {
    id: "configcat",
    name: "ConfigCat",
    emoji: "⚙️",
    description: "Feature flag service with 10-minute setup, percentage-based rollouts, and targeting rules.",
    platform: "Multi-platform",
    bestFor: "Quick setup, small to medium teams, simple feature flag management",
    pricing: "Free up to 1k users, Pro from $99/month",
    features: ["Feature flags", "Percentage rollouts", "Targeting rules", "Environments", "Webhooks", "Integrations"],
    url: "https://configcat.com/",
    targetPersonas: ["developer", "product-owner", "qa-tester"],
    complexityLevel: "beginner"
  },
  {
    id: "optimizely",
    name: "Optimizely",
    emoji: "🎯",
    description: "Digital experience optimization platform with feature flags, experimentation, and personalization.",
    platform: "Multi-platform",
    bestFor: "Enterprise experimentation, personalization, conversion optimization",
    pricing: "Contact for pricing",
    features: ["Feature flags", "A/B testing", "Personalization", "Experimentation", "Analytics", "Audience targeting"],
    url: "https://www.optimizely.com/",
    targetPersonas: ["product-owner", "stakeholder", "developer"],
    complexityLevel: "advanced"
  },
  {
    id: "github-actions-flags",
    name: "GitHub Actions + Environment Variables",
    emoji: "🔧",
    description: "Simple feature flag implementation using GitHub Actions environment variables and conditional logic.",
    platform: "GitHub",
    bestFor: "Simple feature toggles, GitHub-centric teams, budget-conscious projects",
    pricing: "Free with GitHub Actions usage",
    features: ["Environment variables", "Conditional deployment", "Simple toggles", "Version control", "CI/CD integration"],
    url: "https://docs.github.com/en/actions/learn-github-actions/variables",
    targetPersonas: ["developer", "devops"],
    complexityLevel: "beginner"
  },
  {
    id: "custom-implementation",
    name: "Custom Implementation",
    emoji: "🛠️",
    description: "Build your own feature flag system using configuration files, database flags, or environment variables.",
    platform: "Multi-platform",
    bestFor: "Full control, specific requirements, learning purposes",
    pricing: "Free (development and infrastructure costs)",
    features: ["Full customization", "No vendor lock-in", "Database or config-based", "Environment-specific", "API design"],
    url: "#",
    targetPersonas: ["developer", "devops"],
    complexityLevel: "advanced"
  }
];

export function getAvailableFeatureFlagTools(platform: string): FeatureFlagTool[] {
  return featureFlagTools.filter(tool => 
    tool.platform === "Multi-platform" || 
    tool.platform === platform ||
    (platform === "github" && tool.id === "github-actions-flags")
  );
}

export function getFeatureFlagToolDocumentationUrl(toolId: string): string {
  const tool = featureFlagTools.find(t => t.id === toolId);
  return tool?.url || "#";
}

export function isFeatureFlagToolNativeToPlatform(platform: string, toolId: string): boolean {
  const tool = featureFlagTools.find(t => t.id === toolId);
  if (!tool) return false;
  
  // GitHub Actions flags are native to GitHub
  return (platform === "github" && toolId === "github-actions-flags");
}
