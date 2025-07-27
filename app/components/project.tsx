import { useState } from "react";
import { AppLayout } from "~/components/shared/app-layout";
import { SavingIndicator } from "~/components/ui/saving-indicator";
import { ModeSwitch } from "~/components/ui/mode-switch";
import { RealTimeGapAnalysisCard } from "~/components/cards/real-time-gap-analysis-card";
import { ProjectSetupCard } from "~/components/cards/project-setup-card";
import { CodeHostingCard } from "~/components/cards/code-hosting-card";
import { DependencyManagementCard } from "~/components/cards/dependency-management-card";
import { DocumentationCard } from "~/components/cards/documentation-card";
import { CICDCard } from "~/components/cards/cicd-card";
import { IssueTrackingCard } from "~/components/cards/issue-tracking-card";
import { CloudPlatformCard } from "~/components/cards/cloud-platform-card";
import { ArchitectureServicesCard } from "~/components/cards/architecture-services-card";
import { FeatureFlagCard } from "~/components/cards/feature-flag-card";
import { useProjectState } from "~/hooks/use-project-state";

// Data imports
import { platforms } from "~/data/platforms";
import { getArchitecture } from "~/data/project-types";
import { getCloudPlatformProducts, hasMultipleProducts, getCloudPlatformById } from "~/data/cloud-platforms";

// Try to use analysis context if available
import { useAnalysisContext } from "./smart-stack-analyzer";

function useOptionalAnalysisContext() {
  try {
    return useAnalysisContext();
  } catch {
    return null;
  }
}

interface ProjectProps {
  projectStateRef?: React.MutableRefObject<any>;
  mode?: 'gap-analysis' | 'stack-builder';
  onModeChange?: (mode: 'gap-analysis' | 'stack-builder') => void;
}

export default function Project({ 
  projectStateRef, 
  mode = 'stack-builder',
  onModeChange 
}: ProjectProps) {
  // Check if we're in analysis context
  const analysisContext = useOptionalAnalysisContext();
  
  // Use the extracted project state hook
  const projectState = useProjectState({ mode });

  // Mode configuration
  const modeConfig = {
    'gap-analysis': {
      theme: {
        primary: 'blue',
        accent: 'indigo', 
        cardBorder: 'border-blue-200',
        completedBg: 'bg-blue-50'
      },
      labels: {
        title: "Stack Gap Analysis",
        description: "Analyze your current technology stack and identify missing components",
        subtitle: "Identify gaps and optimization opportunities in your current stack"
      }
    },
    'stack-builder': {
      theme: {
        primary: 'green',
        accent: 'blue', 
        cardBorder: 'border-green-200',
        completedBg: 'bg-green-50'
      },
      labels: {
        title: "Technology Stack Builder",
        description: "Build a complete technology stack for your project",
        subtitle: "Create a comprehensive technology foundation for your project"
      }
    }
  };

  const currentContent = modeConfig[mode];

  // Utility functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Content copied to clipboard!");
    });
  };

  const handleCreateRepository = async () => {
    if (projectState.projectName.trim()) {
      const platform = platforms.find(p => p.id === projectState.selectedPlatform);
      if (platform) {
        try {
          await projectState.saveData();
          const url = platform.url === '#' ? '#' : platform.url + encodeURIComponent(projectState.projectName.trim());
          if (url !== '#') {
            window.open(url, '_blank');
          }
        } catch (error) {
          console.error('Failed to save project:', error);
        }
      }
    }
  };

  return (
    <AppLayout 
      title={currentContent.labels.title}
      description={currentContent.labels.description}
      headerActions={
        onModeChange ? (
          <ModeSwitch mode={mode} onModeChange={onModeChange} />
        ) : undefined
      }
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className={`p-6 rounded-lg mb-8 ${mode === 'gap-analysis' ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${mode === 'gap-analysis' ? 'bg-blue-100' : 'bg-green-100'}`}>
              <span className="text-2xl">
                {mode === 'gap-analysis' ? '🔍' : '🚀'}
              </span>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${mode === 'gap-analysis' ? 'text-blue-800' : 'text-green-800'}`}>
                {mode === 'gap-analysis' ? 'Gap Analysis Mode' : 'Stack Builder Mode'}
              </h3>
              <p className={`text-sm ${mode === 'gap-analysis' ? 'text-blue-700' : 'text-green-700'}`}>
                {currentContent.labels.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Gap Analysis Card - Only for gap analysis mode */}
        {mode === 'gap-analysis' && (
          <div className="mb-6">
            <RealTimeGapAnalysisCard
              projectState={projectState}
              completedCards={projectState.completedCards}
            />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Project Setup Card */}
          <ProjectSetupCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            selectedProjectType={projectState.selectedProjectType}
            selectedArchitecture={projectState.selectedArchitecture}
            selectedPersonas={projectState.selectedPersonas}
            selectedIndustry={projectState.selectedIndustry}
            mode={mode}
            onProjectNameChange={projectState.setProjectName}
            onPlatformChange={projectState.setSelectedPlatform}
            onProjectTypeChange={projectState.setSelectedProjectType}
            onArchitectureChange={projectState.setSelectedArchitecture}
            onPersonasChange={projectState.setSelectedPersonas}
            onIndustryChange={projectState.setSelectedIndustry}
            onCopyToClipboard={copyToClipboard}
            onCreateRepository={handleCreateRepository}
            onClearData={projectState.clearSavedData}
            isCompleted={projectState.completedCards['project-setup']}
            onToggleCompletion={() => projectState.toggleCardCompletion('project-setup')}
          />

          {/* PLAN PHASE - DevOps Lifecycle */}
          {/* Documentation Card - PLAN: Tech specs and product specifications */}
          <DocumentationCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            selectedDocTool={projectState.selectedDocTool}
            onDocToolChange={projectState.setSelectedDocTool}
            onCopyToClipboard={copyToClipboard}
            isCompleted={projectState.completedCards['documentation']}
            onToggleCompletion={() => projectState.toggleCardCompletion('documentation')}
          />

          {/* Issue Tracking Card - PLAN: Project management and planning */}
          <IssueTrackingCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            selectedIssueTrackingTool={projectState.selectedIssueTrackingTool}
            selectedPersonas={projectState.selectedPersonas}
            onIssueTrackingToolChange={projectState.setSelectedIssueTrackingTool}
            onCopyToClipboard={copyToClipboard}
            isCompleted={projectState.completedCards['issue-tracking']}
            onToggleCompletion={() => projectState.toggleCardCompletion('issue-tracking')}
          />

          {/* CODE PHASE - DevOps Lifecycle */}
          {/* Code Hosting Card - CODE: Version control and collaboration */}
          <CodeHostingCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            onPlatformChange={projectState.setSelectedPlatform}
            onCopyToClipboard={copyToClipboard}
            onCreateRepository={handleCreateRepository}
            isCompleted={projectState.completedCards['code-hosting']}
            onToggleCompletion={() => projectState.toggleCardCompletion('code-hosting')}
          />

          {/* Dependencies Management Card - CODE: Package management */}
          <DependencyManagementCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            selectedDepTool={projectState.selectedDepTool}
            onDepToolChange={projectState.setSelectedDepTool}
            onCopyToClipboard={copyToClipboard}
            isCompleted={projectState.completedCards['dependency-management']}
            onToggleCompletion={() => projectState.toggleCardCompletion('dependency-management')}
          />

          {/* BUILD & TEST PHASE - DevOps Lifecycle */}
          {/* CI/CD Card - BUILD/TEST: Continuous integration and testing */}
          <CICDCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            selectedCICDTool={projectState.selectedCICDTool}
            onCICDToolChange={projectState.setSelectedCICDTool}
            onCopyToClipboard={copyToClipboard}
            isCompleted={projectState.completedCards['cicd']}
            onToggleCompletion={() => projectState.toggleCardCompletion('cicd')}
          />

          {/* Feature Flag Card - BUILD/TEST: Feature rollout and experimentation */}
          <FeatureFlagCard
            projectName={projectState.projectName}
            selectedPlatform={projectState.selectedPlatform}
            selectedFeatureFlagTool={projectState.selectedFeatureFlagTool}
            onFeatureFlagToolChange={projectState.setSelectedFeatureFlagTool}
            onCopyToClipboard={copyToClipboard}
            isCompleted={projectState.completedCards['feature-flags']}
            onToggleCompletion={() => projectState.toggleCardCompletion('feature-flags')}
          />

          {/* DEPLOY & OPERATE PHASE - DevOps Lifecycle */}
          {/* Cloud Platform Card - DEPLOY/OPERATE: Infrastructure and deployment */}
          <CloudPlatformCard
            projectName={projectState.projectName}
            selectedCloudPlatform={projectState.selectedCloudPlatform}
            selectedArchitecture={projectState.selectedArchitecture}
            selectedPersonas={projectState.selectedPersonas}
            onCloudPlatformChange={projectState.setSelectedCloudPlatform}
            onCopyToClipboard={copyToClipboard}
            isCompleted={projectState.completedCards['cloud-platform']}
            onToggleCompletion={() => projectState.toggleCardCompletion('cloud-platform')}
          />

          {/* Architecture Services Card - Supporting services for the selected architecture */}
          {projectState.selectedArchitecture && projectState.selectedCloudPlatform && (
            <ArchitectureServicesCard
              architecture={getArchitecture(projectState.selectedProjectType, projectState.selectedArchitecture)!}
              cloudPlatform={projectState.selectedCloudPlatform as 'aws' | 'azure' | 'gcp'}
              isCompleted={projectState.completedCards['architecture-services']}
              onToggleCompletion={() => projectState.toggleCardCompletion('architecture-services')}
            />
          )}
        </div>

        {/* Saving Indicator */}
        {projectState.isSaving && (
          <div className="fixed bottom-4 right-4">
            <SavingIndicator isSaving={projectState.isSaving} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
