import type { Platform, DependencyTool, DocumentationTool, CICDTool, IssueTrackingTool, FeatureFlagTool } from "~/types/project";
import type { Architecture } from "~/data/project-types";
import { getDependencyToolDocumentationUrl } from "~/data/dependency-tools";
import { getDocumentationToolUrl } from "~/data/documentation-tools";
import { getCICDToolDocumentationUrl } from "~/data/ci-cd-tools";
import {
  getDependencyTechnicalConsiderations,
  getDependencyPositiveConsequences,
  getDependencyNegativeConsequences,
  getDependencyImplementationEffort,
  getDependencyTrainingRequirements,
  getDependencyImplementationSteps,
  getDependencyAlternativesConsidered
} from "~/utils/dependency-utils";
import {
  getDocumentationTechnicalConsiderations,
  getDocumentationPositiveConsequences,
  getDocumentationNegativeConsequences,
  getDocumentationImplementationEffort,
  getDocumentationTrainingRequirements,
  getDocumentationImplementationSteps,
  getDocumentationAlternativesConsidered
} from "~/utils/documentation-utils";
import {
  getEcosystemBenefits,
  getTeamFamiliarityNotes,
  getTechnicalConsiderations,
  getPositiveConsequences,
  getNegativeConsequences,
  getCIGuidance,
  getAlternativesConsidered
} from "~/utils/platform-utils";

export const generateADR = (
  projectName: string,
  selectedPlatform: string,
  platforms: Platform[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const platform = platforms.find(p => p.id === selectedPlatform)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "001" // Could be made dynamic based on existing ADRs
  
  return `# ADR-${adrNumber}: Code Hosting Platform Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a code hosting platform for the ${repoName} project. This decision will impact our development workflow, collaboration processes, CI/CD capabilities, and integration options.

## Decision
We have decided to use **${platform?.name}** as our code hosting platform.

## Rationale
### Platform Overview
${platform?.description}

### Key Benefits
- **Best suited for**: ${platform?.bestFor}
- **Ecosystem integration**: ${getEcosystemBenefits(selectedPlatform)}
- **Team familiarity**: ${getTeamFamiliarityNotes(selectedPlatform)}

### Technical Considerations
${getTechnicalConsiderations(selectedPlatform)}

## Consequences
### Positive
- ${getPositiveConsequences(selectedPlatform).join('\n- ')}

### Negative
- ${getNegativeConsequences(selectedPlatform).join('\n- ')}

### Neutral
- Repository URL: \`${platform?.url !== '#' ? platform?.url + encodeURIComponent(repoName) : 'Self-hosted instance required'}\`
- Primary use case: Source code management and version control
- Expected team size: [To be filled]
- Project visibility: [Public/Private - To be decided]

## Implementation Notes
1. Set up repository with appropriate access controls
2. Configure branch protection rules
3. Set up CI/CD workflows ${getCIGuidance(selectedPlatform)}
4. Document contribution guidelines
5. Configure issue templates and pull request templates

## Alternatives Considered
${getAlternativesConsidered(selectedPlatform, platforms)}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

export const generateDependencyADR = (
  projectName: string,
  selectedDepTool: string,
  dependencyTools: DependencyTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = dependencyTools.find(t => t.id === selectedDepTool)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "002" // Could be made dynamic based on existing ADRs
  
  return `# ADR-${adrNumber}: Dependency Management Tool Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a dependency management tool for the ${repoName} project. This decision will impact our security posture, maintenance overhead, development workflow, and how we handle dependency updates and vulnerability management.

## Decision
We have decided to use **${tool?.name}** for dependency management.

## Rationale
### Tool Overview
${tool?.description}

### Key Benefits
- **Best suited for**: ${tool?.bestFor}
- **Platform compatibility**: ${tool?.platform}
- **Pricing model**: ${tool?.pricing}
- **Key features**: ${tool?.features.join(', ')}

### Technical Considerations
${getDependencyTechnicalConsiderations(selectedDepTool)}

## Consequences
### Positive
- ${getDependencyPositiveConsequences(selectedDepTool).join('\n- ')}

### Negative
- ${getDependencyNegativeConsequences(selectedDepTool).join('\n- ')}

### Neutral
- Documentation: ${getDependencyToolDocumentationUrl(selectedDepTool)}
- Implementation effort: ${getDependencyImplementationEffort(selectedDepTool)}
- Team training required: ${getDependencyTrainingRequirements(selectedDepTool)}

## Implementation Notes
1. ${getDependencyImplementationSteps(selectedDepTool).join('\n2. ')}

## Alternatives Considered
${getDependencyAlternativesConsidered(selectedDepTool, dependencyTools)}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

export const generateDocumentationADR = (
  projectName: string,
  selectedDocTool: string,
  documentationTools: DocumentationTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = documentationTools.find(t => t.id === selectedDocTool)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "003" // Could be made dynamic based on existing ADRs
  
  return `# ADR-${adrNumber}: Documentation Platform Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a documentation platform for the ${repoName} project. This decision will impact how we create, maintain, and share project documentation, API references, user guides, and team knowledge.

## Decision
We have decided to use **${tool?.name}** for project documentation.

## Rationale
### Platform Overview
${tool?.description}

### Key Benefits
- **Best suited for**: ${tool?.bestFor}
- **Platform compatibility**: ${tool?.platform}
- **Pricing model**: ${tool?.pricing}
- **Key features**: ${tool?.features.join(', ')}

### Technical Considerations
${getDocumentationTechnicalConsiderations(selectedDocTool)}

## Consequences
### Positive
- ${getDocumentationPositiveConsequences(selectedDocTool).join('\n- ')}

### Negative
- ${getDocumentationNegativeConsequences(selectedDocTool).join('\n- ')}

### Neutral
- Documentation URL: ${getDocumentationToolUrl(selectedDocTool)}
- Implementation effort: ${getDocumentationImplementationEffort(selectedDocTool)}
- Team training required: ${getDocumentationTrainingRequirements(selectedDocTool)}

## Implementation Notes
1. ${getDocumentationImplementationSteps(selectedDocTool).join('\n2. ')}

## Alternatives Considered
${getDocumentationAlternativesConsidered(selectedDocTool, documentationTools)}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

export const generateArchitectureADR = (
  projectName: string,
  selectedArchitecture: string,
  architectures: Architecture[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const architecture = architectures.find(a => a.id === selectedArchitecture)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "003" // Could be made dynamic based on existing ADRs
  
  if (!architecture) {
    return `# ADR-${adrNumber}: Architecture Pattern Selection for ${repoName}

## Status
Pending

## Date
${currentDate}

## Context
Architecture pattern selection is pending for the ${repoName} project.

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
  }
  
  return `# ADR-${adrNumber}: Architecture Pattern Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select an architecture pattern for the ${repoName} project. This decision will impact our code organization, scalability, maintainability, deployment strategy, and development workflow.

## Decision
We have decided to use **${architecture.name}** as our architecture pattern.

## Rationale
### Architecture Overview
${architecture.description}

### Key Benefits
- **Best suited for**: ${architecture.bestFor}
- **Example implementations**: ${architecture.examples.join(', ')}

### Technical Considerations
The ${architecture.name} pattern offers:
- Clear structural boundaries for development teams
- Appropriate scalability characteristics for our expected load
- Suitable complexity level for our team's expertise
- Good alignment with our chosen technology stack

## Consequences
### Positive
- Clear separation of concerns and responsibilities
- Supports team's technical expertise and project requirements
- Aligns with chosen technology stack and deployment strategy
- Provides flexibility for future scaling needs

### Negative
- Requires initial setup and configuration effort
- Team may need training on pattern-specific best practices
- May introduce additional complexity compared to simpler alternatives

### Neutral
- Architecture pattern: ${architecture.name}
- Implementation examples: ${architecture.examples.join(', ')}
- Primary use case: ${architecture.bestFor}

## Implementation Notes
1. Set up project structure according to ${architecture.name} pattern
2. Define component boundaries and interfaces
3. Establish development and deployment workflows
4. Document architecture decisions and guidelines
5. Set up monitoring and observability for the chosen pattern
6. Create templates and examples for team reference

## Alternatives Considered
${architectures.filter(a => a.id !== selectedArchitecture).map(alt => 
  `- **${alt.name}**: ${alt.description} (Best for: ${alt.bestFor})`
).join('\n')}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

export const generateCICDADR = (
  projectName: string,
  selectedCICDTool: string,
  cicdTools: CICDTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = cicdTools.find(t => t.id === selectedCICDTool)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "004" // Could be made dynamic based on existing ADRs
  
  if (!tool) {
    return `# ADR-${adrNumber}: CI/CD Platform Selection for ${repoName}

## Status
Pending

## Date
${currentDate}

## Context
CI/CD platform selection is pending for the ${repoName} project.

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
  }
  
  return `# ADR-${adrNumber}: CI/CD Platform Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a CI/CD platform for the ${repoName} project. This decision will impact our deployment automation, build processes, testing workflows, and development productivity.

## Decision
We have decided to use **${tool.name}** as our CI/CD platform.

## Rationale
### Platform Overview
${tool.description}

### Key Benefits
- **Best suited for**: ${tool.bestFor}
- **Pricing model**: ${tool.pricing}
- **Core features**: ${tool.features.join(', ')}

### Technical Considerations
${tool.name} provides:
- Integration capabilities with our chosen code hosting platform
- Scalability to meet our deployment frequency requirements
- Security features appropriate for our compliance needs
- Cost structure that aligns with our budget constraints

## Consequences
### Positive
- Automated deployment processes reduce manual errors
- Consistent build and test environments across all stages
- Faster feedback loops for development teams
- Scalable infrastructure that grows with the project
- ${tool.features.map(f => `Built-in ${f.toLowerCase()}`).join(', ')}

### Negative
- Initial setup and configuration effort required
- Team training needed for platform-specific features
- Dependency on external service availability
- Potential vendor lock-in considerations
- Ongoing costs: ${tool.pricing}

### Neutral
- CI/CD platform: ${tool.name}
- Documentation: ${getCICDToolDocumentationUrl(selectedCICDTool)}
- Platform compatibility: ${tool.platform}
- Feature set: ${tool.features.join(', ')}

## Implementation Notes
1. Set up CI/CD pipeline configuration files
2. Configure build environments and dependencies
3. Implement automated testing workflows
4. Set up deployment stages (dev, staging, production)
5. Configure secrets management and environment variables
6. Establish monitoring and alerting for build/deploy failures
7. Create documentation for team workflows
8. Set up backup and recovery procedures

## Alternatives Considered
${cicdTools.filter(t => t.id !== selectedCICDTool).map(alt => 
  `- **${alt.name}**: ${alt.description.split('.')[0]}. (Best for: ${alt.bestFor})`
).join('\n')}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

export const generateIssueTrackingADR = (
  projectName: string,
  selectedTool: string,
  issueTrackingTools: IssueTrackingTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = issueTrackingTools.find(t => t.id === selectedTool)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "005" // Could be made dynamic based on existing ADRs
  
  return `# ADR-${adrNumber}: Issue & Project Tracking Tool Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select an issue and project tracking tool for the ${repoName} project. This decision will impact our project management workflow, team collaboration, progress tracking, and how we handle bugs, feature requests, and project planning.

## Decision
We have decided to use **${tool?.name}** for issue and project tracking.

## Rationale
### Tool Overview
${tool?.description}

### Key Benefits
- **Best suited for**: ${tool?.bestFor}
- **Platform compatibility**: ${tool?.platform}
- **Pricing**: ${tool?.pricing}

### Key Features
${tool?.features.map(feature => `- ${feature}`).join('\n')}

## Implementation Plan
1. Set up ${tool?.name} for the project
2. Configure issue templates and labels
3. Create project boards/workflows
4. Set up team access and permissions
5. Integrate with development workflow
6. Train team on tool usage
7. Establish issue management processes
8. Set up automation and notifications

## Alternatives Considered
${issueTrackingTools.filter(t => t.id !== selectedTool).map(alt => 
  `- **${alt.name}**: ${alt.description.split('.')[0]}. (Best for: ${alt.bestFor})`
).join('\n')}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

export const generateFeatureFlagADR = (
  projectName: string,
  selectedFeatureFlagTool: string,
  featureFlagTools: FeatureFlagTool[]
): string => {
  const repoName = projectName.trim() || "my-project"
  const tool = featureFlagTools.find(t => t.id === selectedFeatureFlagTool)
  const currentDate = new Date().toISOString().split('T')[0]
  const adrNumber = "007" // Could be made dynamic based on existing ADRs
  
  return `# ADR-${adrNumber}: Feature Flag Tool Selection for ${repoName}

## Status
Accepted

## Date
${currentDate}

## Context
We need to select a feature flag management tool for the ${repoName} project. This decision will impact our ability to safely deploy features, conduct A/B testing, control feature rollouts, and manage experimentation across different environments and user segments.

## Decision
We have decided to use **${tool?.name}** for feature flag management.

## Rationale
### Tool Overview
${tool?.description}

### Key Benefits
- **Best suited for**: ${tool?.bestFor}
- **Platform compatibility**: ${tool?.platform}
- **Pricing model**: ${tool?.pricing}
- **Key features**: ${tool?.features.join(', ')}
- **Complexity level**: ${tool?.complexityLevel}

### Technical Considerations
${getFeatureFlagTechnicalConsiderations(selectedFeatureFlagTool)}

## Consequences
### Positive
- ${getFeatureFlagPositiveConsequences(selectedFeatureFlagTool).join('\n- ')}

### Negative
- ${getFeatureFlagNegativeConsequences(selectedFeatureFlagTool).join('\n- ')}

### Neutral
- Documentation: ${tool?.url}
- Implementation effort: ${getFeatureFlagImplementationEffort(selectedFeatureFlagTool)}
- Team training required: ${getFeatureFlagTrainingRequirements(selectedFeatureFlagTool)}

## Implementation Notes
1. ${getFeatureFlagImplementationSteps(selectedFeatureFlagTool).join('\n2. ')}

## Alternatives Considered
${getFeatureFlagAlternativesConsidered(selectedFeatureFlagTool, featureFlagTools)}

## Review Date
${new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} (90 days from decision)

---
*This ADR was generated by CreateStack.dev on ${currentDate}*`
};

function getFeatureFlagTechnicalConsiderations(toolId: string): string {
  const considerations: Record<string, string> = {
    'launchdarkly': 'Enterprise-grade feature flag platform with advanced targeting, rollout controls, and comprehensive SDK support. Strong API and integration capabilities.',
    'split': 'Feature flag platform with built-in impact measurement and experimentation capabilities. Strong analytics and data-driven approach.',
    'flagsmith': 'Open-source feature flag service with flexible deployment options (cloud or self-hosted). API-first architecture with good SDK support.',
    'posthog': 'All-in-one product analytics platform with integrated feature flags. Combines feature management with comprehensive product insights.',
    'unleash': 'Open-source feature toggle service with enterprise features. Flexible activation strategies and good metrics support.',
    'configcat': 'Simple feature flag service with quick setup and intuitive interface. Good for teams wanting straightforward feature flag management.',
    'optimizely': 'Enterprise experimentation platform with advanced personalization and targeting capabilities. Strong A/B testing and optimization features.',
    'github-actions-flags': 'Simple implementation using GitHub Actions and environment variables. Lightweight but limited to basic feature toggles.',
    'custom-implementation': 'Full control over feature flag implementation. Requires significant development effort but offers maximum flexibility.'
  };
  return considerations[toolId] || 'Technical considerations specific to this tool should be evaluated.';
}

function getFeatureFlagPositiveConsequences(toolId: string): string[] {
  const consequences: Record<string, string[]> = {
    'launchdarkly': ['Enterprise-grade reliability and performance', 'Advanced targeting and rollout controls', 'Comprehensive experimentation features', 'Strong SDK ecosystem', 'Excellent analytics and monitoring'],
    'split': ['Built-in impact measurement', 'Data-driven feature delivery', 'Good experimentation capabilities', 'Strong analytics platform', 'Reasonable pricing for teams'],
    'flagsmith': ['Open-source flexibility', 'Self-hosted option available', 'No vendor lock-in', 'API-first architecture', 'Good community support'],
    'posthog': ['All-in-one product platform', 'Integrated analytics and flags', 'Comprehensive user insights', 'Good value for money', 'Strong community'],
    'unleash': ['Open-source with enterprise features', 'Flexible deployment options', 'Good metrics and monitoring', 'Strong activation strategies', 'No vendor lock-in'],
    'configcat': ['Quick and easy setup', 'Intuitive user interface', 'Good pricing for small teams', 'Reliable service', 'Good documentation'],
    'optimizely': ['Enterprise-grade experimentation', 'Advanced personalization', 'Strong A/B testing capabilities', 'Comprehensive targeting', 'Good for conversion optimization'],
    'github-actions-flags': ['No additional cost', 'Integrated with GitHub workflow', 'Simple to implement', 'Version controlled', 'Good for basic needs'],
    'custom-implementation': ['Full control over implementation', 'No vendor lock-in', 'Tailored to specific needs', 'No recurring costs', 'Learning opportunity']
  };
  return consequences[toolId] || ['Tool-specific benefits should be evaluated'];
}

function getFeatureFlagNegativeConsequences(toolId: string): string[] {
  const consequences: Record<string, string[]> = {
    'launchdarkly': ['Higher cost for enterprise features', 'Complex setup for advanced features', 'Overkill for simple use cases', 'Learning curve for full utilization'],
    'split': ['Limited customization options', 'Pricing can escalate with usage', 'May be complex for simple needs', 'Requires integration setup'],
    'flagsmith': ['Requires more setup than SaaS options', 'Self-hosted maintenance overhead', 'Limited support for free tier', 'May need additional infrastructure'],
    'posthog': ['Feature flags are secondary to analytics', 'May be overkill if only flags needed', 'Data retention limits on free tier', 'Requires more configuration'],
    'unleash': ['Requires hosting and maintenance', 'Setup complexity', 'Limited support for open-source version', 'May need additional tooling'],
    'configcat': ['Limited advanced features', 'May not scale for complex needs', 'Fewer integration options', 'Limited customization'],
    'optimizely': ['High cost for enterprise features', 'Complex setup and configuration', 'Overkill for simple feature flags', 'Requires significant training'],
    'github-actions-flags': ['Very limited functionality', 'No advanced targeting', 'Manual management required', 'No analytics or insights', 'Not suitable for complex scenarios'],
    'custom-implementation': ['Significant development effort', 'Ongoing maintenance burden', 'No vendor support', 'Longer time to market', 'Risk of bugs and reliability issues']
  };
  return consequences[toolId] || ['Tool-specific limitations should be evaluated'];
}

function getFeatureFlagImplementationEffort(toolId: string): string {
  const efforts: Record<string, string> = {
    'launchdarkly': 'Medium to High - SDK integration, configuration, and team training required',
    'split': 'Medium - SDK integration and configuration needed',
    'flagsmith': 'Medium - Setup (cloud or self-hosted) and SDK integration',
    'posthog': 'Medium - Platform setup and SDK integration',
    'unleash': 'Medium to High - Hosting setup and SDK integration',
    'configcat': 'Low to Medium - Simple setup and SDK integration',
    'optimizely': 'High - Complex setup, configuration, and training',
    'github-actions-flags': 'Low - Simple environment variable setup',
    'custom-implementation': 'High - Full development and testing effort'
  };
  return efforts[toolId] || 'Implementation effort should be evaluated';
}

function getFeatureFlagTrainingRequirements(toolId: string): string {
  const training: Record<string, string> = {
    'launchdarkly': 'High - Comprehensive training for advanced features and best practices',
    'split': 'Medium - Training on feature management and experimentation',
    'flagsmith': 'Medium - Training on API usage and feature flag patterns',
    'posthog': 'Medium - Training on analytics platform and feature flags',
    'unleash': 'Medium - Training on activation strategies and flag management',
    'configcat': 'Low - Minimal training for straightforward interface',
    'optimizely': 'High - Extensive training for experimentation and personalization',
    'github-actions-flags': 'Low - Basic understanding of environment variables',
    'custom-implementation': 'High - Training on custom system and best practices'
  };
  return training[toolId] || 'Training requirements should be evaluated';
}

function getFeatureFlagImplementationSteps(toolId: string): string[] {
  const steps: Record<string, string[]> = {
    'launchdarkly': ['Create LaunchDarkly account', 'Set up project and environments', 'Install SDK in application', 'Configure feature flags', 'Implement flag evaluation logic', 'Set up monitoring and alerts'],
    'split': ['Create Split account', 'Set up treatments and environments', 'Install SDK', 'Implement feature flag logic', 'Configure targeting rules', 'Set up impact measurement'],
    'flagsmith': ['Choose deployment method (cloud/self-hosted)', 'Set up Flagsmith instance', 'Create project and environments', 'Install SDK', 'Implement feature flag logic', 'Configure user segments'],
    'posthog': ['Create PostHog account', 'Set up project tracking', 'Install SDK', 'Configure feature flags', 'Implement flag evaluation', 'Set up analytics integration'],
    'unleash': ['Deploy Unleash instance', 'Set up admin dashboard', 'Create feature toggles', 'Install client SDK', 'Implement activation strategies', 'Configure metrics collection'],
    'configcat': ['Create ConfigCat account', 'Set up configuration', 'Install SDK', 'Implement feature flag logic', 'Configure targeting rules', 'Set up webhooks if needed'],
    'optimizely': ['Create Optimizely account', 'Set up project and environments', 'Install SDK', 'Create experiments and features', 'Implement flag logic', 'Configure audience targeting'],
    'github-actions-flags': ['Define environment variables', 'Set up GitHub Actions workflow', 'Implement conditional logic', 'Configure environment-specific values', 'Test deployment process'],
    'custom-implementation': ['Design feature flag architecture', 'Implement flag storage mechanism', 'Create evaluation logic', 'Build management interface', 'Add monitoring and logging', 'Test thoroughly']
  };
  return steps[toolId] || ['Implementation steps should be defined'];
}

function getFeatureFlagAlternativesConsidered(toolId: string, tools: FeatureFlagTool[]): string {
  const otherTools = tools.filter(t => t.id !== toolId).slice(0, 3);
  const alternatives = otherTools.map(tool => `- **${tool.name}**: ${tool.description}`).join('\n');
  return `We considered the following alternatives:\n${alternatives}\n\nThe selected tool was chosen based on our specific requirements for feature management, experimentation capabilities, pricing, and team expertise.`;
}
