import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { 
  Search, 
  Plus, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ArrowRight,
  TrendingUp
} from "lucide-react";

// Existing components
import Project from "~/components/project";
import { useStackAnalysis, useGapAnalysisRecommendations } from "~/hooks/use-stack-analysis";

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

interface StackModeToggleProps {
  mode: 'gap-analysis' | 'stack-builder';
  onModeChange: (mode: 'gap-analysis' | 'stack-builder') => void;
}

function StackModeToggle({ mode, onModeChange }: StackModeToggleProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex justify-center gap-4">
          <Button
            variant={mode === 'gap-analysis' ? 'default' : 'outline'}
            onClick={() => onModeChange('gap-analysis')}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Analyze Existing Stack
          </Button>
          <Button
            variant={mode === 'stack-builder' ? 'default' : 'outline'}
            onClick={() => onModeChange('stack-builder')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Build New Stack
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          {mode === 'gap-analysis' ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-600">Gap Analysis Mode</h3>
              <p className="text-sm text-gray-600">
                Fill in your existing technologies below to identify missing components
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold text-green-600">Stack Builder Mode</h3>
              <p className="text-sm text-gray-600">
                Build a comprehensive technology stack from scratch with guided recommendations
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface RealTimeGapAnalysisProps {
  getProjectState: () => any;
}

function RealTimeGapAnalysis({ getProjectState }: RealTimeGapAnalysisProps) {
  const [projectState, setProjectState] = useState(getProjectState());
  
  // Update project state periodically to get real-time analysis
  useEffect(() => {
    const interval = setInterval(() => {
      setProjectState(getProjectState());
    }, 500); // Update every 500ms
    
    return () => clearInterval(interval);
  }, [getProjectState]);

  const analysis = useStackAnalysis(projectState);
  const recommendations = useGapAnalysisRecommendations(
    analysis.missingCategories,
    projectState.selectedPersonas?.length,
    projectState.selectedIndustry
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'text-red-600';
      case 'important':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'important':
        return <Info className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  if (analysis.filledCategories === 0) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="h-5 w-5" />
            Start Your Gap Analysis
          </CardTitle>
          <CardDescription className="text-blue-600">
            Fill in the technology choices below to see your stack completeness score and get personalized recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Real-time Completeness Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <TrendingUp className="h-5 w-5" />
                Stack Completeness
              </CardTitle>
              <CardDescription className="text-blue-600">
                {analysis.score >= 80 ? "Excellent! Your stack is well-rounded." :
                 analysis.score >= 60 ? "Good foundation with some gaps to fill." :
                 analysis.score >= 40 ? "Making progress, several areas need attention." :
                 "Great start! Many opportunities to strengthen your stack."}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${
                analysis.score >= 80 ? 'text-green-600' :
                analysis.score >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {analysis.score}%
              </div>
              <div className="text-sm text-gray-600">
                {analysis.filledCategories}/{analysis.totalCategories} categories
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={analysis.score} className="h-3" />
        </CardContent>
      </Card>

      {/* Missing Categories - Real-time */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recommended Next Steps ({recommendations.length})
            </CardTitle>
            <CardDescription>
              Add these components to strengthen your technology stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.key} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  {getPriorityIcon(rec.priority)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{rec.name}</h4>
                      <Badge 
                        variant={rec.priority === 'critical' ? 'destructive' : 
                               rec.priority === 'important' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{rec.recommendation}</p>
                  </div>
                </div>
              ))}
              {recommendations.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    +{recommendations.length - 3} more recommendations available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
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
      <div className="space-y-6">
        <StackModeToggle mode={mode} onModeChange={setMode} />
        
        {mode === 'gap-analysis' && (
          <RealTimeGapAnalysis getProjectState={getProjectState} />
        )}
        
        <Project 
          projectStateRef={projectStateRef} 
          mode={mode}
          onModeChange={setMode}
        />
      </div>
    </AnalysisContext.Provider>
  );
}
