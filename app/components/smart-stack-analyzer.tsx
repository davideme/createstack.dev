import { useState, useRef } from "react";

// Existing components
import Project from "~/components/project";

// We'll create a context to share mode and state access
import React, { createContext, useContext } from 'react';

interface AnalysisContextType {
  mode: 'gap-analysis' | 'stack-builder';
  isAnalyzing: boolean;
  getProjectState: () => any;
}

const AnalysisContext = createContext<AnalysisContextType | null>(null);

export function useAnalysisContext() {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysisContext must be used within AnalysisProvider');
  }
  return context;
}

export function SmartStackAnalyzer() {
  const [mode, setMode] = useState<'gap-analysis' | 'stack-builder'>('gap-analysis');
  const projectStateRef = useRef<any>({
    projectName: '',
    selectedPlatform: '',
    selectedProjectType: 'web-app',
    selectedArchitecture: '',
    selectedCloudPlatform: 'aws',
    selectedDepTool: '',
    selectedDocTool: '',
    selectedCICDTool: '',
    selectedIssueTrackingTool: '',
    selectedFeatureFlagTool: '',
    selectedPersonas: [],
    selectedIndustry: 'none'
  });

  const getProjectState = () => projectStateRef.current;

  return (
    <AnalysisContext.Provider value={{
      mode,
      isAnalyzing: mode === 'gap-analysis',
      getProjectState
    }}>
      <Project 
        projectStateRef={projectStateRef} 
        mode={mode}
        onModeChange={setMode}
      />
    </AnalysisContext.Provider>
  );
}
