import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import { BarChart3, TrendingUp, AlertTriangle, Info, CheckCircle } from "lucide-react";

interface RealTimeGapAnalysisCardProps {
  projectState: any;
  completedCards: Record<string, boolean>;
}

export function RealTimeGapAnalysisCard({ projectState, completedCards }: RealTimeGapAnalysisCardProps) {
  // Calculate completeness based on completed cards
  const totalCards = Object.keys(completedCards).length;
  const completedCount = Object.values(completedCards).filter(Boolean).length;
  const completionPercentage = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;

  // Get incomplete cards
  const incompleteCategories = Object.entries(completedCards)
    .filter(([, isCompleted]) => !isCompleted)
    .map(([cardId]) => cardId);

  // Recommendations mapping
  const cardRecommendations = {
    'code-hosting': {
      name: 'Code Hosting',
      recommendation: 'Set up a version control system to track changes and enable team collaboration.',
      priority: 'critical' as const
    },
    'dependency-management': {
      name: 'Dependency Management',
      recommendation: 'Implement automated dependency updates to maintain security and compatibility.',
      priority: 'important' as const
    },
    'documentation': {
      name: 'Documentation',
      recommendation: 'Establish a documentation system for team knowledge sharing and onboarding.',
      priority: 'important' as const
    },
    'cicd': {
      name: 'CI/CD Pipeline',
      recommendation: 'Set up automated testing and deployment to improve development velocity.',
      priority: 'critical' as const
    },
    'issue-tracking': {
      name: 'Issue Tracking',
      recommendation: 'Implement project management tools for better team coordination and planning.',
      priority: 'important' as const
    },
    'feature-flags': {
      name: 'Feature Flags',
      recommendation: 'Add feature management to enable safer deployments and A/B testing.',
      priority: 'nice-to-have' as const
    },
    'cloud-platform': {
      name: 'Cloud Platform',
      recommendation: 'Select a cloud provider that matches your scalability needs and budget constraints.',
      priority: 'critical' as const
    },
    'architecture-services': {
      name: 'Architecture Services',
      recommendation: 'Configure cloud services that support your chosen architecture pattern.',
      priority: 'important' as const
    }
  };

  const recommendations = incompleteCategories
    .map(cardId => ({
      key: cardId,
      ...cardRecommendations[cardId as keyof typeof cardRecommendations]
    }))
    .filter(rec => rec.name) // Filter out any unmapped cards
    .sort((a, b) => {
      // Sort by priority: critical > important > nice-to-have
      const priorityOrder = { 'critical': 0, 'important': 1, 'nice-to-have': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

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

  if (completedCount === 0) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <BarChart3 className="h-5 w-5" />
                Stack Completeness Analysis
              </CardTitle>
              <CardDescription className="text-blue-600">
                Complete the cards below to improve your stack completeness score and get personalized recommendations
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-red-600">
                {completionPercentage}%
              </div>
              <div className="text-sm text-gray-600">
                {completedCount}/{totalCards} cards completed
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-3" />
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Start by completing any of the cards below to see your progress and receive targeted recommendations.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <TrendingUp className="h-5 w-5" />
              Stack Completeness Analysis
            </CardTitle>
            <CardDescription className="text-blue-600">
              {completionPercentage >= 80 ? "Excellent! Your stack is well-rounded." :
               completionPercentage >= 60 ? "Good foundation with some gaps to fill." :
               completionPercentage >= 40 ? "Making progress, several areas need attention." :
               "Great start! Many opportunities to strengthen your stack."}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              completionPercentage >= 80 ? 'text-green-600' :
              completionPercentage >= 60 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {completionPercentage}%
            </div>
            <div className="text-sm text-gray-600">
              {completedCount}/{totalCards} cards completed
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={completionPercentage} className="h-3" />
        
        {/* Incomplete Cards - Real-time */}
        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              Next Steps ({recommendations.length} remaining)
            </h4>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec) => (
                <div key={rec.key} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                  {getPriorityIcon(rec.priority)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="font-medium text-sm">{rec.name}</h5>
                      <Badge 
                        variant={rec.priority === 'critical' ? 'destructive' : 
                               rec.priority === 'important' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{rec.recommendation}</p>
                  </div>
                </div>
              ))}
              {recommendations.length > 3 && (
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    +{recommendations.length - 3} more recommendations available
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
