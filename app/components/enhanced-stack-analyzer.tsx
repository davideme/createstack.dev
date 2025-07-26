import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Progress } from "~/components/ui/progress";
import { 
  Search, 
  Plus, 
  BarChart3, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ArrowRight
} from "lucide-react";

// Existing components
import Project from "~/components/project";

interface StackModeToggleProps {
  mode: 'gap-analysis' | 'stack-builder';
  onModeChange: (mode: 'gap-analysis' | 'stack-builder') => void;
}

function StackModeToggle({ mode, onModeChange }: StackModeToggleProps) {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <Tabs value={mode} onValueChange={onModeChange as any}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gap-analysis" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Analyze Existing Stack
            </TabsTrigger>
            <TabsTrigger value="stack-builder" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Build New Stack
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="mt-4 text-center">
          {mode === 'gap-analysis' ? (
            <div className="space-y-2">
              <h3 className="font-semibold text-blue-600">Gap Analysis Mode</h3>
              <p className="text-sm text-gray-600">
                Input your existing technologies to identify missing components and strengthen your stack
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

interface GapAnalysisLandingProps {
  onStartAnalysis: () => void;
}

function GapAnalysisLanding({ onStartAnalysis }: GapAnalysisLandingProps) {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <Badge className="mx-auto mb-4 bg-blue-100 text-blue-800 px-4 py-2 w-fit">
            <BarChart3 className="h-4 w-4 mr-2" />
            Stack Gap Analysis
          </Badge>
          <CardTitle className="text-2xl">
            Identify Critical Gaps in Your Technology Stack
          </CardTitle>
          <CardDescription className="text-lg">
            Tell us what technology you're already using, and we'll analyze your setup to identify 
            missing components, security gaps, and optimization opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Button 
              size="lg" 
              onClick={onStartAnalysis}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Start Stack Analysis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Value Props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <Search className="h-5 w-5 text-blue-600" />
            </div>
            <CardTitle className="text-lg">Gap Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Identify missing components across monitoring, security, CI/CD, and more
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
            </div>
            <CardTitle className="text-lg">Completeness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Get a visual score showing how well-rounded your technology stack is
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <CardTitle className="text-lg">Business Docs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Generate stakeholder documentation explaining your technology choices
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface GapAnalysisResultsProps {
  projectData: any;
  onGenerateDocumentation: () => void;
}

function GapAnalysisResults({ projectData, onGenerateDocumentation }: GapAnalysisResultsProps) {
  // Calculate completeness based on filled categories
  const categories = [
    { key: 'platform', name: 'Code Hosting', filled: !!projectData.platform },
    { key: 'dependencyTool', name: 'Dependency Management', filled: !!projectData.dependencyTool },
    { key: 'documentationTool', name: 'Documentation', filled: !!projectData.documentationTool },
    { key: 'cicdTool', name: 'CI/CD Pipeline', filled: !!projectData.cicdTool },
    { key: 'issueTrackingTool', name: 'Issue Tracking', filled: !!projectData.issueTrackingTool },
    { key: 'featureFlagTool', name: 'Feature Flags', filled: !!projectData.featureFlagTool },
    { key: 'cloudPlatform', name: 'Cloud Platform', filled: !!projectData.cloudPlatform },
  ];

  const filledCategories = categories.filter(cat => cat.filled);
  const missingCategories = categories.filter(cat => !cat.filled);
  const completenessScore = Math.round((filledCategories.length / categories.length) * 100);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'important':
        return <Info className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getRecommendationPriority = (categoryKey: string) => {
    const criticalCategories = ['platform', 'dependencyTool', 'cicdTool'];
    const importantCategories = ['documentationTool', 'issueTrackingTool'];
    
    if (criticalCategories.includes(categoryKey)) return 'critical';
    if (importantCategories.includes(categoryKey)) return 'important';
    return 'nice-to-have';
  };

  const getRecommendationText = (categoryKey: string, teamSize?: number) => {
    const teamContext = teamSize ? `For a ${teamSize}-person team, ` : '';
    
    const recommendations: Record<string, string> = {
      platform: `${teamContext}a code hosting platform is essential for version control and collaboration.`,
      dependencyTool: `${teamContext}automated dependency management prevents security vulnerabilities and keeps libraries up-to-date.`,
      documentationTool: `${teamContext}proper documentation improves team efficiency and knowledge sharing.`,
      cicdTool: `${teamContext}CI/CD automation reduces deployment risks and improves development velocity.`,
      issueTrackingTool: `${teamContext}issue tracking helps organize work and maintain project visibility.`,
      featureFlagTool: `${teamContext}feature flags enable safer deployments and gradual rollouts.`,
      cloudPlatform: `${teamContext}a cloud platform provides scalable infrastructure and managed services.`,
    };

    return recommendations[categoryKey] || 'This component improves your development workflow.';
  };

  return (
    <div className="space-y-6">
      {/* Completeness Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            {completenessScore}%
          </div>
          <CardTitle>Stack Completeness Score</CardTitle>
          <CardDescription>
            {completenessScore >= 80 ? "Excellent! Your stack is well-rounded." :
             completenessScore >= 60 ? "Good foundation with some gaps to fill." :
             "Significant opportunities to strengthen your stack."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={completenessScore} className="h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{filledCategories.length} categories covered</span>
            <span>{missingCategories.length} gaps identified</span>
          </div>
        </CardContent>
      </Card>

      {/* Missing Categories */}
      {missingCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Recommended Additions
            </CardTitle>
            <CardDescription>
              Missing components that would strengthen your technology stack
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {missingCategories.map((category) => {
                const priority = getRecommendationPriority(category.key);
                return (
                  <div key={category.key} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getPriorityIcon(priority)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant={priority === 'critical' ? 'destructive' : priority === 'important' ? 'default' : 'outline'}>
                          {priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {getRecommendationText(category.key, projectData.teamPersonas?.length)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Stack Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Current Stack
          </CardTitle>
          <CardDescription>
            Technologies you're already using
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filledCategories.map((category) => (
              <div key={category.key} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <span className="font-medium">{category.name}</span>
                <Badge variant="outline" className="bg-white">
                  Configured
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-4">
            <Button onClick={onGenerateDocumentation}>
              Generate Business Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EnhancedStackAnalyzer() {
  const [mode, setMode] = useState<'gap-analysis' | 'stack-builder'>('gap-analysis');
  const [showLanding, setShowLanding] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [projectData, setProjectData] = useState<any>({});

  const handleStartAnalysis = () => {
    setShowLanding(false);
  };

  const handleGenerateDocumentation = () => {
    alert('Business documentation generation coming soon! This would create stakeholder-appropriate documentation for your technology decisions.');
  };

  const handleAnalyzeStack = (data: any) => {
    setProjectData(data);
    setShowResults(true);
  };

  if (mode === 'stack-builder') {
    return (
      <div>
        <StackModeToggle mode={mode} onModeChange={setMode} />
        <Project />
      </div>
    );
  }

  return (
    <div>
      <StackModeToggle mode={mode} onModeChange={setMode} />
      
      {showLanding && (
        <GapAnalysisLanding onStartAnalysis={handleStartAnalysis} />
      )}
      
      {!showLanding && !showResults && (
        <div>
          <Card className="mb-6 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Fill out your existing technology choices below
                </h3>
                <p className="text-sm text-blue-600">
                  We'll analyze your selections and identify gaps when you're done
                </p>
                <Button 
                  size="sm" 
                  className="mt-3"
                  onClick={() => handleAnalyzeStack({
                    // This would be filled from the actual project form
                    platform: 'github',
                    dependencyTool: 'dependabot',
                    cicdTool: 'github-actions'
                  })}
                >
                  Analyze My Stack
                </Button>
              </div>
            </CardContent>
          </Card>
          <Project />
        </div>
      )}
      
      {showResults && (
        <GapAnalysisResults 
          projectData={projectData}
          onGenerateDocumentation={handleGenerateDocumentation}
        />
      )}
    </div>
  );
}
