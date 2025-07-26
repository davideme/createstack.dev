import { useEffect, useState } from 'react';

interface ProjectState {
  projectName: string;
  selectedPlatform: string;
  selectedProjectType: string;
  selectedArchitecture: string;
  selectedCloudPlatform: string;
  selectedDepTool: string;
  selectedDocTool: string;
  selectedCICDTool: string;
  selectedIssueTrackingTool: string;
  selectedFeatureFlagTool: string;
  selectedPersonas: string[];
  selectedIndustry: string;
}

interface StackCompleteness {
  score: number;
  filledCategories: number;
  totalCategories: number;
  missingCategories: Array<{
    key: string;
    name: string;
    priority: 'critical' | 'important' | 'nice-to-have';
    recommendation: string;
  }>;
}

export function useStackAnalysis(projectState: ProjectState): StackCompleteness {
  const [analysis, setAnalysis] = useState<StackCompleteness>({
    score: 0,
    filledCategories: 0,
    totalCategories: 0,
    missingCategories: []
  });

  useEffect(() => {
    const categories = [
      {
        key: 'platform',
        name: 'Code Hosting',
        value: projectState.selectedPlatform,
        priority: 'critical' as const,
        recommendation: 'Essential for version control and team collaboration'
      },
      {
        key: 'projectType',
        name: 'Project Type',
        value: projectState.selectedProjectType,
        priority: 'critical' as const,
        recommendation: 'Defines your application architecture and requirements'
      },
      {
        key: 'dependencyTool',
        name: 'Dependency Management',
        value: projectState.selectedDepTool,
        priority: 'critical' as const,
        recommendation: 'Prevents security vulnerabilities and keeps libraries up-to-date'
      },
      {
        key: 'cicdTool',
        name: 'CI/CD Pipeline',
        value: projectState.selectedCICDTool,
        priority: 'important' as const,
        recommendation: 'Automates testing and deployment, reducing risks'
      },
      {
        key: 'documentationTool',
        name: 'Documentation',
        value: projectState.selectedDocTool,
        priority: 'important' as const,
        recommendation: 'Improves team efficiency and knowledge sharing'
      },
      {
        key: 'issueTrackingTool',
        name: 'Issue Tracking',
        value: projectState.selectedIssueTrackingTool,
        priority: 'important' as const,
        recommendation: 'Organizes work and maintains project visibility'
      },
      {
        key: 'cloudPlatform',
        name: 'Cloud Platform',
        value: projectState.selectedCloudPlatform,
        priority: 'important' as const,
        recommendation: 'Provides scalable infrastructure and managed services'
      },
      {
        key: 'featureFlagTool',
        name: 'Feature Flags',
        value: projectState.selectedFeatureFlagTool,
        priority: 'nice-to-have' as const,
        recommendation: 'Enables safer deployments and gradual rollouts'
      }
    ];

    const filledCategories = categories.filter(cat => 
      cat.value && cat.value !== '' && cat.value !== 'none'
    );

    const missingCategories = categories
      .filter(cat => !cat.value || cat.value === '' || cat.value === 'none')
      .map(cat => ({
        key: cat.key,
        name: cat.name,
        priority: cat.priority,
        recommendation: cat.recommendation
      }));

    const score = Math.round((filledCategories.length / categories.length) * 100);

    setAnalysis({
      score,
      filledCategories: filledCategories.length,
      totalCategories: categories.length,
      missingCategories
    });
  }, [
    projectState.selectedPlatform,
    projectState.selectedProjectType,
    projectState.selectedDepTool,
    projectState.selectedCICDTool,
    projectState.selectedDocTool,
    projectState.selectedIssueTrackingTool,
    projectState.selectedCloudPlatform,
    projectState.selectedFeatureFlagTool
  ]);

  return analysis;
}

export function useGapAnalysisRecommendations(missingCategories: StackCompleteness['missingCategories'], teamSize?: number, industry?: string) {
  return missingCategories.map(category => {
    let enhancedRecommendation = category.recommendation;

    // Add team size context
    if (teamSize) {
      if (teamSize < 5) {
        enhancedRecommendation += ` For small teams (${teamSize} people), focus on simple, low-maintenance solutions.`;
      } else if (teamSize > 20) {
        enhancedRecommendation += ` For larger teams (${teamSize} people), prioritize enterprise features and advanced collaboration tools.`;
      }
    }

    // Add industry context
    if (industry && industry !== 'none') {
      if (industry === 'fintech' || industry === 'healthcare') {
        enhancedRecommendation += ` This is especially critical for ${industry} due to regulatory compliance requirements.`;
      }
    }

    return {
      ...category,
      recommendation: enhancedRecommendation
    };
  });
}
