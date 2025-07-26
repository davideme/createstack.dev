import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Progress } from "~/components/ui/progress";
import { 
  Search, 
  ArrowRight, 
  BarChart3, 
  FileText, 
  Users, 
  Building, 
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import { StackInput } from "~/components/stack-input";
import { StackAnalysisResults } from "~/components/stack-analysis-results";
import { StackAnalysisEngine } from "~/utils/stack-analysis-engine";
import { calculateCompletenessScore } from "~/data/stack-categories";

import type { 
  ExistingStack, 
  StackAnalysisContext, 
  StackAnalysisResult 
} from "~/types/stack-analysis";

type AnalysisStep = 'input' | 'analyzing' | 'results';

export function StackGapAnalyzer() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>('input');
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [existingStack, setExistingStack] = useState<ExistingStack>({});
  const [context, setContext] = useState<StackAnalysisContext>({
    team_size: undefined,
    industry: undefined,
    technical_expertise: 'intermediate',
    budget_range: 'small',
    priority_focus: 'speed'
  });
  const [analysisResult, setAnalysisResult] = useState<StackAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calculate real-time completeness score
  const currentCompletenessScore = calculateCompletenessScore(existingStack);
  const technologyCount = Object.values(existingStack).flat().filter(Boolean).length;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setCurrentStep('analyzing');

    // Simulate analysis delay for better UX
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const result = StackAnalysisEngine.analyzeStack({
        existing_stack: existingStack,
        context,
        current_project_stage: 'development'
      });

      setAnalysisResult(result);
      setCurrentStep('results');
    } catch (error) {
      console.error('Analysis failed:', error);
      // Handle error - could show error state
      setCurrentStep('input');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setShowLandingPage(true);
    setExistingStack({});
    setContext({
      team_size: undefined,
      industry: undefined,
      technical_expertise: 'intermediate',
      budget_range: 'small',
      priority_focus: 'speed'
    });
    setAnalysisResult(null);
  };

  const handleGenerateDocumentation = () => {
    // This would navigate to the business documentation generator
    // For now, we'll just show an alert
    alert('Business documentation generation coming soon! This would create stakeholder-appropriate documentation for your technology decisions.');
  };

  const handleStartAnalysis = () => {
    // Hide the landing page and show the input form
    setShowLandingPage(false);
    setCurrentStep('input');
    // Use a timeout to ensure the DOM is updated before scrolling
    setTimeout(() => {
      document.getElementById('stack-input')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Landing page content when no stack is being analyzed
  if (showLandingPage && currentStep === 'input' && technologyCount === 0) {
    return (
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <BarChart3 className="h-4 w-4 mr-2" />
              Stack Gap Analysis
            </Badge>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            Identify Critical Gaps in Your Technology Stack
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us what technology you're already using, and we'll analyze your setup to identify 
            missing components, security gaps, and optimization opportunities.
          </p>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Input your existing technologies and get a comprehensive analysis of what's missing 
                from your development stack.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Stack Completeness Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get a visual completeness meter showing how well-rounded your technology stack is 
                across critical categories.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Business Justification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate stakeholder-appropriate documentation explaining your technology choices 
                and their business impact.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">How It Works</CardTitle>
            <CardDescription className="text-center">
              Get from existing stack to actionable recommendations in 3 simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold">Input Your Current Stack</h3>
                <p className="text-sm text-gray-600">
                  Tell us what programming languages, frameworks, databases, and tools you're already using
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold">Get Gap Analysis</h3>
                <p className="text-sm text-gray-600">
                  Our engine identifies missing components across monitoring, security, CI/CD, and more
                </p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="mx-auto h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold">Take Action</h3>
                <p className="text-sm text-gray-600">
                  Receive prioritized recommendations with cost estimates and implementation guidance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-blue-600" />
                <CardTitle>For Engineering Teams</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Identify missing monitoring and observability tools
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Find security gaps in your development workflow
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Optimize CI/CD pipeline with missing components
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Generate business cases for stakeholder approval
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-purple-600" />
                <CardTitle>For Regulated Industries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  SOC2, HIPAA, and PCI compliance gap analysis
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Audit-ready documentation generation
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Security control mapping and recommendations
                </li>
                <li className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Cost estimation for compliance requirements
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to analyze your stack?</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Start by telling us what technology you're currently using, and we'll identify opportunities to strengthen your stack.
              </p>
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleStartAnalysis}
              >
                Start Stack Analysis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Stack Gap Analysis</h2>
            {currentStep === 'input' && technologyCount > 0 && (
              <div className="text-right">
                <div className="text-lg font-semibold">
                  {currentCompletenessScore}% Complete
                </div>
                <div className="text-sm text-gray-600">
                  {technologyCount} technologies added
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep === 'input' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'input' ? 'bg-blue-600 text-white' : 
                currentStep === 'analyzing' || currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                1
              </div>
              <span className="font-medium">Input Stack</span>
            </div>
            
            <div className={`flex-1 h-2 rounded ${
              currentStep === 'analyzing' || currentStep === 'results' ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            
            <div className={`flex items-center gap-2 ${currentStep === 'analyzing' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'analyzing' ? 'bg-blue-600 text-white' : 
                currentStep === 'results' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}>
                2
              </div>
              <span className="font-medium">Analyze</span>
            </div>
            
            <div className={`flex-1 h-2 rounded ${
              currentStep === 'results' ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            
            <div className={`flex items-center gap-2 ${currentStep === 'results' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === 'results' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                3
              </div>
              <span className="font-medium">Results</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 'input' && (
        <div id="stack-input">
          <StackInput
            existingStack={existingStack}
            context={context}
            onStackChange={setExistingStack}
            onContextChange={setContext}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}

      {currentStep === 'analyzing' && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-6 py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Analyzing Your Technology Stack</h3>
                <p className="text-gray-600 mb-4">
                  We're examining your current setup and identifying gaps across critical categories...
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-gray-500">✓ Checking security tools and practices</div>
                  <div className="text-sm text-gray-500">✓ Analyzing monitoring and observability</div>
                  <div className="text-sm text-gray-500">✓ Reviewing CI/CD pipeline components</div>
                  <div className="text-sm text-gray-500">✓ Evaluating team collaboration tools</div>
                  <div className="text-sm text-gray-500">✓ Generating personalized recommendations</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 'results' && analysisResult && (
        <StackAnalysisResults
          analysis={analysisResult}
          onStartOver={handleStartOver}
          onGenerateDocumentation={handleGenerateDocumentation}
        />
      )}
    </div>
  );
}
