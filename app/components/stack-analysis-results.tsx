import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Building, 
  Shield,
  DollarSign,
  Clock,
  ArrowRight
} from "lucide-react";
import type { StackAnalysisResult } from "~/types/stack-analysis";

interface StackAnalysisResultsProps {
  analysis: StackAnalysisResult;
  onStartOver: () => void;
  onGenerateDocumentation?: () => void;
}

export function StackAnalysisResults({ 
  analysis, 
  onStartOver, 
  onGenerateDocumentation 
}: StackAnalysisResultsProps) {
  const [activeTab, setActiveTab] = useState("overview");

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'important':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getCompletenessColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCompletenessMessage = (score: number) => {
    if (score >= 80) return "Great job! Your stack is well-rounded.";
    if (score >= 60) return "Good foundation with some important gaps to fill.";
    if (score >= 40) return "Solid start, but several key areas need attention.";
    return "Significant opportunities to strengthen your technology stack.";
  };

  return (
    <div className="space-y-6">
      {/* Header with Completeness Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Stack Analysis Complete</CardTitle>
              <CardDescription>
                Analysis for {analysis.input.context.team_size} person team • {new Date(analysis.generated_at).toLocaleDateString()}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getCompletenessColor(analysis.analysis.completeness_score)}`}>
                {analysis.analysis.completeness_score}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress 
              value={analysis.analysis.completeness_score} 
              className="h-3"
            />
            <div className="flex items-center justify-between text-sm">
              <span className={getCompletenessColor(analysis.analysis.completeness_score)}>
                {getCompletenessMessage(analysis.analysis.completeness_score)}
              </span>
              <span className="text-gray-600">
                {analysis.recommendations_count} recommendations found
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Priority Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Priority Actions
              </CardTitle>
              <CardDescription>
                Top 3 most critical gaps to address first
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.priority_actions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{action.category}</h4>
                        <Badge variant={getPriorityColor(action.priority)}>
                          {action.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{action.rationale}</p>
                      <div className="flex gap-2">
                        {action.tools.slice(0, 2).map((tool) => (
                          <Badge key={tool.id} variant="outline" className="text-xs">
                            {tool.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <div>
                    <div className="text-2xl font-bold text-red-600">
                      {analysis.analysis.recommended_additions.filter(r => r.priority === 'critical').length}
                    </div>
                    <div className="text-sm text-gray-600">Critical Gaps</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold text-orange-600">
                      {analysis.analysis.recommended_additions.filter(r => r.priority === 'important').length}
                    </div>
                    <div className="text-sm text-gray-600">Important Gaps</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {analysis.analysis.compliance_gaps?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Compliance Gaps</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {analysis.analysis.recommended_additions.filter(r => r.priority === 'nice-to-have').length}
                    </div>
                    <div className="text-sm text-gray-600">Enhancements</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          {analysis.analysis.recommended_additions.map((recommendation, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(recommendation.priority)}
                    <CardTitle>{recommendation.category}</CardTitle>
                    <Badge variant={getPriorityColor(recommendation.priority)}>
                      {recommendation.priority}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{recommendation.rationale}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Recommended Tools */}
                  <div>
                    <h4 className="font-semibold mb-3">Recommended Tools</h4>
                    <div className="grid gap-3">
                      {recommendation.tools.map((tool) => (
                        <div key={tool.id} className="flex items-start justify-between p-3 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{tool.name}</h5>
                              <Badge variant="outline" className="text-xs">
                                {tool.complexity_level}
                              </Badge>
                              {tool.url && (
                                <a 
                                  href={tool.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {tool.pricing}
                              </span>
                              <span>Best for: {tool.best_for}</span>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {tool.features.slice(0, 4).map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <div className="text-sm font-medium text-center">
                              <div className="text-lg text-blue-600">{tool.popularity_score}/10</div>
                              <div className="text-xs text-gray-500">Popularity</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cost Estimate */}
                  {recommendation.estimated_cost && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h5 className="font-medium mb-2">Cost Estimate</h5>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Monthly Cost: </span>
                          <span className="font-medium">{recommendation.estimated_cost.monthly_cost_range}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Training Time: </span>
                          <span className="font-medium">{recommendation.estimated_cost.training_time}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-6">
          {analysis.analysis.compliance_gaps && analysis.analysis.compliance_gaps.length > 0 ? (
            analysis.analysis.compliance_gaps.map((gap, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    {gap.framework.toUpperCase()} Compliance Gap
                  </CardTitle>
                  <CardDescription>
                    Missing controls and requirements for {gap.framework} compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Missing Controls</h4>
                      <div className="flex flex-wrap gap-2">
                        {gap.missing_controls.map((control) => (
                          <Badge key={control} variant="destructive" className="text-xs">
                            {control}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Audit Requirements</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {gap.audit_requirements.map((req, i) => (
                          <li key={i}>{req}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-lg">
                      <div>
                        <span className="text-gray-600 text-sm">Estimated Cost: </span>
                        <span className="font-semibold">${gap.estimated_cost.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600 text-sm">Timeline: </span>
                        <span className="font-semibold">{gap.implementation_timeline}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Compliance Gaps Identified</h3>
                  <p className="text-gray-600">
                    No specific compliance requirements were provided for analysis.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          {/* Team Size Insights */}
          {analysis.analysis.team_size_considerations && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Team Size Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.analysis.team_size_considerations.map((consideration, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge>{consideration.team_size_range}</Badge>
                      <Badge variant="outline">{consideration.tooling_complexity_level} tools</Badge>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {consideration.specific_needs.map((need, i) => (
                        <li key={i}>{need}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Industry Insights */}
          {analysis.analysis.industry_specific_gaps && analysis.analysis.industry_specific_gaps.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-purple-600" />
                  Industry-Specific Considerations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysis.analysis.industry_specific_gaps.map((gap, index) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-semibold capitalize">{gap.industry} Requirements</h4>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Specific Requirements:</h5>
                      <div className="flex flex-wrap gap-2">
                        {gap.specific_requirements.map((req) => (
                          <Badge key={req} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-1">Compliance Needs:</h5>
                      <div className="flex flex-wrap gap-2">
                        {gap.compliance_needs.map((need) => (
                          <Badge key={need} variant="secondary" className="text-xs">
                            {need.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={onStartOver}>
              Analyze Another Stack
            </Button>
            {onGenerateDocumentation && (
              <Button onClick={onGenerateDocumentation} className="flex items-center gap-2">
                Generate Business Documentation
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
