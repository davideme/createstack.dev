import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { X, Plus, Search } from "lucide-react";
import type { ExistingStack, StackAnalysisContext } from "~/types/stack-analysis";
import { stackCategories } from "~/data/stack-categories";

interface StackInputProps {
  existingStack: ExistingStack;
  context: StackAnalysisContext;
  onStackChange: (stack: ExistingStack) => void;
  onContextChange: (context: StackAnalysisContext) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

export function StackInput({ 
  existingStack, 
  context, 
  onStackChange, 
  onContextChange, 
  onAnalyze,
  isAnalyzing = false 
}: StackInputProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [newTechnology, setNewTechnology] = useState("");

  // Popular technology suggestions for each category
  const technologySuggestions: Record<string, string[]> = {
    programming_languages: ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C#", "Ruby", "PHP", "Swift"],
    frameworks: ["React", "Vue.js", "Angular", "Next.js", "Svelte", "Express.js", "FastAPI", "Django", "Spring Boot", "Rails"],
    databases: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "DynamoDB", "Cassandra", "SQLite", "MariaDB"],
    cloud_platforms: ["AWS", "Google Cloud", "Azure", "Vercel", "Netlify", "Digital Ocean", "Heroku", "Railway", "Fly.io"],
    ci_cd: ["GitHub Actions", "GitLab CI", "Jenkins", "CircleCI", "Travis CI", "Azure DevOps", "Bitbucket Pipelines"],
    monitoring: ["Datadog", "New Relic", "Sentry", "LogRocket", "Grafana", "Prometheus", "Splunk", "CloudWatch"],
    security: ["Auth0", "Okta", "Firebase Auth", "AWS Cognito", "Supabase Auth", "Clerk", "NextAuth.js"],
    communication: ["Slack", "Discord", "Microsoft Teams", "Zoom", "Google Meet", "Linear", "Notion"],
    issue_tracking: ["Jira", "Linear", "GitHub Issues", "GitLab Issues", "Asana", "Monday.com", "Trello"],
    documentation: ["Notion", "Confluence", "GitBook", "Docusaurus", "Storybook", "Swagger", "README.md"],
    dependency_management: ["Dependabot", "Renovate", "Snyk", "WhiteSource", "npm audit", "Yarn audit"],
    feature_flags: ["LaunchDarkly", "Split", "ConfigCat", "Unleash", "PostHog", "Amplitude"],
    testing: ["Jest", "Cypress", "Playwright", "Vitest", "Mocha", "PyTest", "JUnit", "RSpec"],
    containerization: ["Docker", "Podman", "containerd", "Docker Compose", "Buildah"],
    orchestration: ["Kubernetes", "Docker Swarm", "Amazon ECS", "Google Cloud Run", "Azure Container Instances"]
  };

  const addTechnology = (category: string, technology: string) => {
    const currentTechs = existingStack[category as keyof ExistingStack] || [];
    if (!currentTechs.includes(technology)) {
      onStackChange({
        ...existingStack,
        [category]: [...currentTechs, technology]
      });
    }
    setNewTechnology("");
    setActiveCategory(null);
  };

  const removeTechnology = (category: string, technology: string) => {
    const currentTechs = existingStack[category as keyof ExistingStack] || [];
    onStackChange({
      ...existingStack,
      [category]: currentTechs.filter(tech => tech !== technology)
    });
  };

  const handleAddCustomTechnology = (category: string) => {
    if (newTechnology.trim()) {
      addTechnology(category, newTechnology.trim());
    }
  };

  const getTechnologyCount = () => {
    return Object.values(existingStack).flat().filter(Boolean).length;
  };

  const getFilledCategoriesCount = () => {
    return Object.values(existingStack).filter(techs => techs && techs.length > 0).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Tell us what technology you're already using
          </CardTitle>
          <CardDescription>
            Input your current technology stack to identify missing components and gaps.
            We'll analyze your setup and provide targeted recommendations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Size</label>
              <Select 
                value={context.team_size?.toString() || ""} 
                onValueChange={(value) => onContextChange({
                  ...context, 
                  team_size: value ? parseInt(value) : undefined
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1-2 people</SelectItem>
                  <SelectItem value="5">3-5 people</SelectItem>
                  <SelectItem value="10">6-10 people</SelectItem>
                  <SelectItem value="25">11-25 people</SelectItem>
                  <SelectItem value="50">26-50 people</SelectItem>
                  <SelectItem value="100">50+ people</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <Select 
                value={context.industry || ""} 
                onValueChange={(value) => onContextChange({...context, industry: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="fintech">Fintech</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="gaming">Gaming</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Technical Expertise</label>
              <Select 
                value={context.technical_expertise || ""} 
                onValueChange={(value) => onContextChange({
                  ...context, 
                  technical_expertise: value as any
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expertise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress indicators */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{getTechnologyCount()}</div>
              <div className="text-sm text-gray-600">Technologies Added</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{getFilledCategoriesCount()}</div>
              <div className="text-sm text-gray-600">Categories Filled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Categories */}
      <div className="grid gap-4">
        {stackCategories.map((category) => {
          const categoryTechs = existingStack[category.id] || [];
          const isActive = activeCategory === category.id;
          
          return (
            <Card key={category.id} className={`transition-all ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription className="text-sm">{category.description}</CardDescription>
                    </div>
                    <Badge 
                      variant={category.priority === 'critical' ? 'destructive' : 
                              category.priority === 'important' ? 'default' : 'outline'}
                    >
                      {category.priority}
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveCategory(isActive ? null : category.id)}
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Current technologies */}
                {categoryTechs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {categoryTechs.map((tech) => (
                      <Badge key={tech} variant="secondary" className="gap-1">
                        {tech}
                        <button
                          onClick={() => removeTechnology(category.id, tech)}
                          className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Add new technology interface */}
                {isActive && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder={`Add ${category.name.toLowerCase()}...`}
                        value={newTechnology}
                        onChange={(e) => setNewTechnology(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCustomTechnology(category.id);
                          }
                        }}
                      />
                      <Button 
                        onClick={() => handleAddCustomTechnology(category.id)}
                        disabled={!newTechnology.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    
                    {/* Popular suggestions */}
                    <div>
                      <div className="text-sm font-medium mb-2">Popular choices:</div>
                      <div className="flex flex-wrap gap-2">
                        {technologySuggestions[category.id]?.slice(0, 8).map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant="outline"
                            size="sm"
                            onClick={() => addTechnology(category.id, suggestion)}
                            disabled={categoryTechs.includes(suggestion)}
                            className="h-8 text-xs"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {categoryTechs.length === 0 && !isActive && (
                  <div className="text-sm text-gray-500 italic">
                    No technologies added yet. Click "Add" to get started.
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analyze Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <div className="text-lg font-semibold">Ready to analyze your stack?</div>
              <div className="text-sm text-gray-600">
                We'll identify gaps and provide personalized recommendations
              </div>
            </div>
            <Button 
              onClick={onAnalyze}
              disabled={isAnalyzing || getTechnologyCount() === 0}
              size="lg"
              className="w-full md:w-auto"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze My Stack"}
            </Button>
            {getTechnologyCount() === 0 && (
              <div className="text-sm text-red-600">
                Please add at least one technology to analyze your stack
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
