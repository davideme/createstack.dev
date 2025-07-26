import type { 
  ExistingStack, 
  StackGapAnalysis, 
  StackAnalysisInput,
  StackAnalysisResult,
  StackGapRecommendation,
  ComplianceGap,
  StackTool
} from "~/types/stack-analysis";

import { stackCategories, calculateCompletenessScore, getCategoriesForCompliance } from "~/data/stack-categories";
import { dependencyTools } from "~/data/dependency-tools";
import { documentationTools } from "~/data/documentation-tools";
import { cicdTools } from "~/data/ci-cd-tools";
import { issueTrackingTools } from "~/data/issue-tracking-tools";
import { featureFlagTools } from "~/data/feature-flag-tools";
import { cloudPlatforms } from "~/data/cloud-platforms";

/**
 * Main Stack Gap Analysis Engine
 * Analyzes existing technology stack and identifies missing components
 */
export class StackAnalysisEngine {
  
  /**
   * Perform comprehensive stack gap analysis
   */
  static analyzeStack(input: StackAnalysisInput): StackAnalysisResult {
    const analysis = this.performGapAnalysis(input.existing_stack, input.context);
    
    return {
      input,
      analysis,
      generated_at: new Date(),
      recommendations_count: analysis.recommended_additions.length,
      priority_actions: analysis.recommended_additions.filter(rec => rec.priority === 'critical').slice(0, 3)
    };
  }

  /**
   * Core gap analysis logic
   */
  private static performGapAnalysis(existingStack: ExistingStack, context: any): StackGapAnalysis {
    const missingCategories = this.identifyMissingCategories(existingStack);
    const completenessScore = calculateCompletenessScore(existingStack);
    const recommendations = this.generateRecommendations(missingCategories, context);
    const complianceGaps = this.analyzeComplianceGaps(existingStack, context.compliance_requirements || []);

    return {
      completeness_score: completenessScore,
      missing_categories: missingCategories.map(cat => cat.name),
      recommended_additions: recommendations,
      compliance_gaps: complianceGaps,
      team_size_considerations: this.getTeamSizeRecommendations(context.team_size, missingCategories),
      industry_specific_gaps: this.getIndustrySpecificGaps(context.industry, existingStack)
    };
  }

  /**
   * Identify categories that are missing or incomplete
   */
  private static identifyMissingCategories(existingStack: ExistingStack) {
    return stackCategories.filter(category => {
      const categoryData = existingStack[category.id];
      return !categoryData || categoryData.length === 0;
    });
  }

  /**
   * Generate specific recommendations for missing categories
   */
  private static generateRecommendations(missingCategories: any[], context: any): StackGapRecommendation[] {
    return missingCategories.map(category => {
      const tools = this.getToolsForCategory(category.id, context);
      const priority = this.determinePriority(category, context);
      const rationale = this.generateRationale(category, context);

      return {
        category: category.name,
        tools: tools.slice(0, 3), // Top 3 recommendations per category
        priority,
        rationale,
        compliance_impact: this.getComplianceImpact(category.id),
        estimated_cost: this.estimateCosts(tools[0]) // Use primary recommendation for cost estimate
      };
    });
  }

  /**
   * Get tool recommendations for a specific category
   */
  private static getToolsForCategory(categoryId: string, context: any): StackTool[] {
    const complexity = context.technical_expertise || 'intermediate';
    const teamSize = context.team_size || 10;
    
    switch (categoryId) {
      case 'dependency_management':
        return this.mapToStackTools(dependencyTools, complexity, teamSize);
      case 'documentation':
        return this.mapToStackTools(documentationTools, complexity, teamSize);
      case 'ci_cd':
        return this.mapToStackTools(cicdTools, complexity, teamSize);
      case 'issue_tracking':
        return this.mapToStackTools(issueTrackingTools, complexity, teamSize);
      case 'feature_flags':
        return this.mapToStackTools(featureFlagTools, complexity, teamSize);
      case 'cloud_platforms':
        return this.mapToStackTools(cloudPlatforms, complexity, teamSize);
      case 'monitoring':
        return this.getMonitoringTools(complexity, teamSize);
      case 'security':
        return this.getSecurityTools(complexity, teamSize);
      case 'testing':
        return this.getTestingTools(complexity, teamSize);
      case 'communication':
        return this.getCommunicationTools(complexity, teamSize);
      default:
        return this.getGenericTools(categoryId, complexity, teamSize);
    }
  }

  /**
   * Map existing tool data to StackTool format
   */
  private static mapToStackTools(tools: any[], complexity: string, teamSize: number): StackTool[] {
    return tools
      .filter(tool => this.isToolSuitableForContext(tool, complexity, teamSize))
      .map(tool => ({
        id: tool.id,
        name: tool.name,
        category: tool.platform || 'general',
        description: tool.description,
        pricing: tool.pricing,
        features: tool.features,
        best_for: tool.bestFor,
        complexity_level: tool.complexityLevel || 'intermediate',
        popularity_score: this.calculatePopularityScore(tool),
        compliance_certifications: tool.complianceCertifications || [],
        integration_difficulty: this.assessIntegrationDifficulty(tool),
        url: tool.url
      }))
      .sort((a, b) => b.popularity_score - a.popularity_score);
  }

  /**
   * Determine if a tool is suitable for the given context
   */
  private static isToolSuitableForContext(tool: any, complexity: string, teamSize: number): boolean {
    // Filter by complexity level
    if (tool.complexityLevel && complexity === 'beginner' && tool.complexityLevel === 'advanced') {
      return false;
    }

    // Filter by team size (basic heuristic)
    if (teamSize < 5 && tool.bestFor?.includes('enterprise')) {
      return false;
    }

    if (teamSize > 50 && tool.bestFor?.includes('small teams')) {
      return false;
    }

    return true;
  }

  /**
   * Calculate popularity score based on various factors
   */
  private static calculatePopularityScore(tool: any): number {
    let score = 5; // Base score

    // Adjust based on pricing (free tools get bonus)
    if (tool.pricing?.toLowerCase().includes('free')) {
      score += 2;
    }

    // Adjust based on feature count
    if (tool.features?.length > 5) {
      score += 1;
    }

    // Adjust based on platform support
    if (tool.platform === 'Multi-platform') {
      score += 1;
    }

    return Math.min(score, 10); // Cap at 10
  }

  /**
   * Assess integration difficulty
   */
  private static assessIntegrationDifficulty(tool: any): 'easy' | 'medium' | 'hard' {
    if (tool.platform === 'GitHub' || tool.platform === 'GitLab') {
      return 'easy';
    }
    if (tool.platform === 'Multi-platform') {
      return 'medium';
    }
    return 'medium'; // Default to medium difficulty
  }

  /**
   * Determine priority based on category and context
   */
  private static determinePriority(category: any, context: any): 'critical' | 'important' | 'nice-to-have' {
    // If compliance is required and this category supports it, upgrade priority
    if (context.compliance_requirements?.length > 0 && 
        category.required_for_compliance?.some((req: string) => context.compliance_requirements.includes(req))) {
      return 'critical';
    }

    return category.priority;
  }

  /**
   * Generate contextual rationale for recommendations
   */
  private static generateRationale(category: any, context: any): string {
    const teamSize = context.team_size || 10;
    const industry = context.industry || 'general';
    
    let rationale = `${category.description}. `;

    // Add team size context
    if (teamSize < 5) {
      rationale += `For small teams (${teamSize} people), this category helps establish essential development processes. `;
    } else if (teamSize > 25) {
      rationale += `For larger teams (${teamSize} people), this category is crucial for coordination and maintaining quality. `;
    } else {
      rationale += `For teams of your size (${teamSize} people), this category improves development efficiency and reduces risks. `;
    }

    // Add industry context
    if (industry === 'fintech' || industry === 'healthcare') {
      rationale += `This is especially important for ${industry} companies due to regulatory requirements. `;
    }

    // Add compliance context
    if (category.required_for_compliance?.length > 0) {
      rationale += `Required for compliance frameworks: ${category.required_for_compliance.join(', ')}. `;
    }

    return rationale.trim();
  }

  /**
   * Analyze compliance gaps
   */
  private static analyzeComplianceGaps(existingStack: ExistingStack, requirements: string[]): ComplianceGap[] {
    return requirements.map(framework => {
      const requiredCategories = getCategoriesForCompliance(framework);
      const missingCategories = requiredCategories.filter(cat => {
        const categoryData = existingStack[cat.id];
        return !categoryData || categoryData.length === 0;
      });

      return {
        framework: framework as any,
        missing_controls: missingCategories.map(cat => cat.name),
        recommended_tools: [], // Would be populated with compliance-specific tools
        audit_requirements: this.getAuditRequirements(framework),
        estimated_cost: this.estimateComplianceCost(framework, missingCategories.length),
        implementation_timeline: this.estimateImplementationTime(missingCategories.length)
      };
    });
  }

  /**
   * Get team size specific recommendations
   */
  private static getTeamSizeRecommendations(teamSize: number | undefined, missingCategories: any[]) {
    if (!teamSize) return [];

    if (teamSize < 5) {
      return [{
        team_size_range: "1-5 people",
        specific_needs: ["Simple setup", "Low maintenance", "Cost-effective"],
        tooling_complexity_level: 'beginner' as const
      }];
    } else if (teamSize < 25) {
      return [{
        team_size_range: "5-25 people",
        specific_needs: ["Team collaboration", "Process standardization", "Scalable solutions"],
        tooling_complexity_level: 'intermediate' as const
      }];
    } else {
      return [{
        team_size_range: "25+ people",
        specific_needs: ["Enterprise features", "Advanced security", "Compliance capabilities"],
        tooling_complexity_level: 'advanced' as const
      }];
    }
  }

  /**
   * Get industry-specific gaps
   */
  private static getIndustrySpecificGaps(industry: string | undefined, existingStack: ExistingStack) {
    if (!industry || industry === 'none') return [];

    // This would be expanded with industry-specific requirements
    const industryRequirements: Record<string, any> = {
      fintech: {
        specific_requirements: ["PCI compliance", "Data encryption", "Audit trails"],
        compliance_needs: ["soc2", "pci"],
        required_categories: ["security", "monitoring", "documentation"]
      },
      healthcare: {
        specific_requirements: ["HIPAA compliance", "PHI protection", "Access controls"],
        compliance_needs: ["hipaa", "soc2"],
        required_categories: ["security", "monitoring", "documentation"]
      }
    };

    const requirements = industryRequirements[industry];
    if (!requirements) return [];

    return [{
      industry,
      specific_requirements: requirements.specific_requirements,
      compliance_needs: requirements.compliance_needs,
      recommended_tools: [] // Would be populated with industry-specific tools
    }];
  }

  // Helper methods for specific tool categories
  private static getMonitoringTools(complexity: string, teamSize: number): StackTool[] {
    const tools = [
      {
        id: "datadog",
        name: "Datadog",
        category: "monitoring",
        description: "Comprehensive monitoring and analytics platform",
        pricing: "Pro plans from $15/host/month",
        features: ["APM", "Infrastructure monitoring", "Log management", "Alerting"],
        best_for: "Enterprise teams needing comprehensive monitoring",
        complexity_level: 'intermediate' as const,
        popularity_score: 9,
        integration_difficulty: 'medium' as const
      },
      {
        id: "newrelic",
        name: "New Relic",
        category: "monitoring",
        description: "Full-stack observability platform",
        pricing: "Free tier, Pro from $25/month",
        features: ["APM", "Browser monitoring", "Mobile monitoring", "Infrastructure"],
        best_for: "Teams needing application performance monitoring",
        complexity_level: 'intermediate' as const,
        popularity_score: 8,
        integration_difficulty: 'medium' as const
      },
      {
        id: "grafana",
        name: "Grafana + Prometheus",
        category: "monitoring",
        description: "Open-source monitoring and observability stack",
        pricing: "Free (self-hosted), Cloud from $50/month",
        features: ["Custom dashboards", "Alerting", "Data visualization", "Open source"],
        best_for: "Teams wanting customizable, cost-effective monitoring",
        complexity_level: 'advanced' as const,
        popularity_score: 7,
        integration_difficulty: 'hard' as const
      }
    ];

    return tools.filter(tool => this.isToolSuitableForContext(tool, complexity, teamSize));
  }

  private static getSecurityTools(complexity: string, teamSize: number): StackTool[] {
    const tools = [
      {
        id: "auth0",
        name: "Auth0",
        category: "security",
        description: "Identity and access management platform",
        pricing: "Free tier, Essentials from $23/month",
        features: ["SSO", "MFA", "Social login", "Enterprise connections"],
        best_for: "Teams needing flexible authentication",
        complexity_level: 'intermediate' as const,
        popularity_score: 9,
        integration_difficulty: 'easy' as const
      },
      {
        id: "okta",
        name: "Okta",
        category: "security",
        description: "Enterprise identity and access management",
        pricing: "Workforce from $2/user/month",
        features: ["SSO", "MFA", "Lifecycle management", "API access"],
        best_for: "Enterprise teams with complex identity needs",
        complexity_level: 'advanced' as const,
        popularity_score: 8,
        integration_difficulty: 'medium' as const
      },
      {
        id: "firebase-auth",
        name: "Firebase Authentication",
        category: "security",
        description: "Google's authentication service",
        pricing: "Free tier, Pay as you go",
        features: ["Multiple providers", "Phone auth", "Anonymous auth", "Custom auth"],
        best_for: "Teams using Firebase ecosystem",
        complexity_level: 'beginner' as const,
        popularity_score: 8,
        integration_difficulty: 'easy' as const
      }
    ];

    return tools.filter(tool => this.isToolSuitableForContext(tool, complexity, teamSize));
  }

  private static getTestingTools(complexity: string, teamSize: number): StackTool[] {
    const tools = [
      {
        id: "jest",
        name: "Jest",
        category: "testing",
        description: "JavaScript testing framework with built-in mocking",
        pricing: "Free (open source)",
        features: ["Unit testing", "Snapshot testing", "Mocking", "Code coverage"],
        best_for: "JavaScript/TypeScript projects",
        complexity_level: 'beginner' as const,
        popularity_score: 9,
        integration_difficulty: 'easy' as const
      },
      {
        id: "cypress",
        name: "Cypress",
        category: "testing",
        description: "End-to-end testing framework",
        pricing: "Free (open source), Cloud plans from $75/month",
        features: ["E2E testing", "Visual testing", "Real browser testing", "Time travel debugging"],
        best_for: "Teams needing comprehensive E2E testing",
        complexity_level: 'intermediate' as const,
        popularity_score: 8,
        integration_difficulty: 'medium' as const
      },
      {
        id: "playwright",
        name: "Playwright",
        category: "testing",
        description: "Cross-browser end-to-end testing",
        pricing: "Free (open source)",
        features: ["Cross-browser testing", "Mobile testing", "API testing", "Visual comparisons"],
        best_for: "Teams needing cross-browser testing",
        complexity_level: 'intermediate' as const,
        popularity_score: 7,
        integration_difficulty: 'medium' as const
      }
    ];

    return tools.filter(tool => this.isToolSuitableForContext(tool, complexity, teamSize));
  }

  private static getCommunicationTools(complexity: string, teamSize: number): StackTool[] {
    const tools = [
      {
        id: "slack",
        name: "Slack",
        category: "communication",
        description: "Team collaboration and messaging platform",
        pricing: "Free tier, Pro from $7.25/user/month",
        features: ["Channels", "Direct messaging", "File sharing", "App integrations"],
        best_for: "Most teams needing organized communication",
        complexity_level: 'beginner' as const,
        popularity_score: 9,
        integration_difficulty: 'easy' as const
      },
      {
        id: "discord",
        name: "Discord",
        category: "communication",
        description: "Voice, video, and text communication platform",
        pricing: "Free, Nitro from $5/month",
        features: ["Voice channels", "Screen sharing", "Server organization", "Bots"],
        best_for: "Developer communities and informal teams",
        complexity_level: 'beginner' as const,
        popularity_score: 7,
        integration_difficulty: 'easy' as const
      },
      {
        id: "teams",
        name: "Microsoft Teams",
        category: "communication",
        description: "Enterprise communication and collaboration platform",
        pricing: "Free tier, Microsoft 365 plans from $6/user/month",
        features: ["Video meetings", "File collaboration", "Office integration", "Phone system"],
        best_for: "Teams using Microsoft ecosystem",
        complexity_level: 'intermediate' as const,
        popularity_score: 8,
        integration_difficulty: 'easy' as const
      }
    ];

    return tools.filter(tool => this.isToolSuitableForContext(tool, complexity, teamSize));
  }

  private static getGenericTools(categoryId: string, complexity: string, teamSize: number): StackTool[] {
    // Fallback for categories not specifically handled
    return [{
      id: `generic-${categoryId}`,
      name: `Generic ${categoryId.replace('_', ' ')} Tool`,
      category: categoryId,
      description: `Recommended tool for ${categoryId.replace('_', ' ')} category`,
      pricing: "Varies",
      features: ["Basic functionality"],
      best_for: "General use cases",
      complexity_level: 'intermediate' as const,
      popularity_score: 5,
      integration_difficulty: 'medium' as const
    }];
  }

  private static getComplianceImpact(categoryId: string) {
    // Map categories to compliance impact
    const complianceMap: Record<string, any> = {
      security: {
        frameworks_addressed: ["soc2", "hipaa", "pci"],
        security_improvements: ["Access control", "Data protection", "Audit trails"],
        audit_benefits: ["Compliance documentation", "Security controls", "Risk assessment"]
      },
      monitoring: {
        frameworks_addressed: ["soc2", "pci"],
        security_improvements: ["Incident detection", "Performance monitoring", "System visibility"],
        audit_benefits: ["Audit trails", "Compliance reporting", "Security monitoring"]
      }
    };

    return complianceMap[categoryId];
  }

  private static estimateCosts(tool: StackTool | undefined) {
    if (!tool) return undefined;

    return {
      monthly_cost_range: tool.pricing,
      setup_cost: "Varies",
      training_time: "1-2 weeks",
      maintenance_effort: 'medium' as const
    };
  }

  private static getAuditRequirements(framework: string): string[] {
    const requirements: Record<string, string[]> = {
      soc2: ["Access controls", "System monitoring", "Data protection", "Incident response"],
      hipaa: ["PHI protection", "Access logs", "Encryption", "Business associate agreements"],
      pci: ["Data encryption", "Access controls", "Network monitoring", "Vulnerability management"]
    };

    return requirements[framework] || [];
  }

  private static estimateComplianceCost(framework: string, missingCount: number): number {
    const baseCosts: Record<string, number> = {
      soc2: 15000,
      hipaa: 20000,
      pci: 25000
    };

    const baseCost = baseCosts[framework] || 10000;
    return baseCost + (missingCount * 2000); // Additional cost per missing category
  }

  private static estimateImplementationTime(missingCount: number): string {
    if (missingCount <= 2) return "2-4 weeks";
    if (missingCount <= 5) return "1-2 months";
    return "2-4 months";
  }
}
