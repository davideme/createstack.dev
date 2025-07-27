import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { Progress } from "~/components/ui/progress"
import { SavingIndicator } from "~/components/ui/saving-indicator"
import { MermaidDiagram } from "~/components/ui/mermaid-diagram"
import { AppLayout } from "~/components/shared/app-layout"
import { InfrastructureAsCode } from "~/components/shared/infrastructure-as-code"
import { DependencyManagementCard } from "~/components/cards/dependency-management-card"
import { DocumentationCard } from "~/components/cards/documentation-card"
import { CICDCard } from "~/components/cards/cicd-card"
import { IssueTrackingCard } from "~/components/cards/issue-tracking-card"
import { CloudPlatformCard } from "~/components/cards/cloud-platform-card"
import { ArchitectureServicesCard } from "~/components/cards/architecture-services-card"
import { FeatureFlagCard } from "~/components/cards/feature-flag-card"
import { ExternalLink, ChevronDown, ChevronUp, Search, Plus, Lock, Unlock, BarChart3, CheckCircle, AlertTriangle, Info, TrendingUp } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useDB, useCurrentProject } from "~/lib/db"

// Data imports
import { platforms } from "~/data/platforms"
import { projectTypes, getArchitecturesForProjectType, getArchitecture } from "~/data/project-types"
import { teamPersonas } from "~/data/personas"
import { industries } from "~/data/industries"
import { getCloudPlatformProducts, hasMultipleProducts, getCloudPlatformById } from "~/data/cloud-platforms"

// Try to use analysis context if available
import { useAnalysisContext } from "./smart-stack-analyzer"

function useOptionalAnalysisContext() {
  try {
    return useAnalysisContext()
  } catch {
    return null
  }
}

// Real-time Gap Analysis Card Component
interface RealTimeGapAnalysisCardProps {
  projectState: any;
  completedCards: Record<string, boolean>;
}

function RealTimeGapAnalysisCard({ projectState, completedCards }: RealTimeGapAnalysisCardProps) {
  // Calculate completeness based on completed cards
  const totalCards = Object.keys(completedCards).length;
  const completedCount = Object.values(completedCards).filter(Boolean).length;
  const completionPercentage = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;
  
  // Get missing/incomplete categories
  const incompleteCategories = Object.entries(completedCards)
    .filter(([_, isCompleted]) => !isCompleted)
    .map(([cardId, _]) => cardId);
  
  // Map card IDs to user-friendly names and recommendations
  const cardRecommendations = {
    'project-setup': {
      name: 'Project Setup',
      recommendation: 'Define your project name, team personas, and industry focus to get tailored recommendations.',
      priority: 'critical' as const
    },
    'project-type': {
      name: 'Product Strategy & Architecture',
      recommendation: 'Select your project type and architecture pattern to align technical decisions with business goals.',
      priority: 'critical' as const
    },
    'code-hosting': {
      name: 'Code Hosting Platform',
      recommendation: 'Choose a version control platform that fits your team size, budget, and compliance requirements.',
      priority: 'important' as const
    },
    'documentation': {
      name: 'Documentation Strategy',
      recommendation: 'Set up documentation tools to ensure knowledge sharing and project maintainability.',
      priority: 'important' as const
    },
    'issue-tracking': {
      name: 'Issue Tracking',
      recommendation: 'Implement project management tools for task tracking and team collaboration.',
      priority: 'important' as const
    },
    'dependency-management': {
      name: 'Dependency Management',
      recommendation: 'Configure automated dependency updates and security scanning for your project.',
      priority: 'important' as const
    },
    'cicd': {
      name: 'CI/CD Pipeline',
      recommendation: 'Set up continuous integration and deployment to automate testing and releases.',
      priority: 'critical' as const
    },
    'feature-flags': {
      name: 'Feature Flags',
      recommendation: 'Add feature flag management for safer deployments and gradual rollouts.',
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
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <BarChart3 className="h-5 w-5" />
            Start Your Gap Analysis
          </CardTitle>
          <CardDescription className="text-blue-600">
            Complete the cards below to see your stack completeness score and get personalized recommendations
          </CardDescription>
        </CardHeader>
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
                    <p className="text-sm text-gray-600">{rec.recommendation}</p>
                  </div>
                </div>
              ))}
              {recommendations.length > 3 && (
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    +{recommendations.length - 3} more cards to complete
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

// Card completion toggle component
interface CardCompletionToggleProps {
  cardId: string;
  isCompleted: boolean;
  onToggle: (cardId: string) => void;
}

function CardCompletionToggle({ cardId, isCompleted, onToggle }: CardCompletionToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onToggle(cardId)}
      className={`ml-auto flex items-center gap-1 text-xs ${
        isCompleted 
          ? 'text-green-600 hover:text-green-700' 
          : 'text-gray-400 hover:text-gray-600'
      }`}
      title={isCompleted ? 'Click to unlock and edit' : 'Mark as complete'}
    >
      {isCompleted ? (
        <>
          <Lock className="h-3 w-3" />
          Complete
        </>
      ) : (
        <>
          <Unlock className="h-3 w-3" />
          Mark Complete
        </>
      )}
    </Button>
  )
}

// Utility imports
import { generateADR, generateArchitectureADR } from "~/utils/adr-generators"
import { generateVendorComparison } from "~/utils/vendor-utils"
import { generateArchitectureDiagram } from "~/utils/architecture-diagrams"

export default function Project({ 
  projectStateRef, 
  mode = 'stack-builder', // Default to stack-builder mode
  onModeChange 
}: { 
  projectStateRef?: React.MutableRefObject<any>;
  mode?: 'gap-analysis' | 'stack-builder';
  onModeChange?: (mode: 'gap-analysis' | 'stack-builder') => void;
}) {
  // Check if we're in analysis context
  const analysisContext = useOptionalAnalysisContext()
  
  // Define default values based on mode
  const getDefaultValue = (buildModeDefault: string, analyzeDefault: string = "") => {
    return mode === 'gap-analysis' ? analyzeDefault : buildModeDefault;
  };
  
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState(getDefaultValue("github"))
  const [selectedProjectType, setSelectedProjectType] = useState(getDefaultValue("web-app"))
  const [selectedArchitecture, setSelectedArchitecture] = useState("")
  const [selectedCloudPlatform, setSelectedCloudPlatform] = useState(getDefaultValue("aws"))
  const [selectedDepTool, setSelectedDepTool] = useState(getDefaultValue("dependabot"))
  const [selectedDocTool, setSelectedDocTool] = useState(getDefaultValue("readme"))
  const [selectedCICDTool, setSelectedCICDTool] = useState(getDefaultValue("github-actions"))
  const [selectedIssueTrackingTool, setSelectedIssueTrackingTool] = useState(getDefaultValue("github-issues"))
  const [selectedFeatureFlagTool, setSelectedFeatureFlagTool] = useState(getDefaultValue("configcat"))
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(
    mode === 'gap-analysis' ? [] : ["developer", "product-owner"]
  )
  const [selectedIndustry, setSelectedIndustry] = useState(
    mode === 'gap-analysis' ? "" : "none"
  )
  const [showArchitectureDiagram, setShowArchitectureDiagram] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  // Card completion tracking
  const [completedCards, setCompletedCards] = useState<Record<string, boolean>>({
    'project-setup': false,
    'project-type': false,
    'code-hosting': false,
    'documentation': false,
    'issue-tracking': false,
    'dependency-management': false,
    'cicd': false,
    'feature-flags': false,
    'cloud-platform': false,
    'architecture-services': false
  })

  // Toggle card completion status
  const toggleCardCompletion = (cardId: string) => {
    setCompletedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  // Track if we're loading data from database to prevent auto-save loops
  const isLoadingFromDB = useRef(false)
  // Track if we're updating from context to prevent circular updates
  const isUpdatingFromContext = useRef(false)
  const { isReady, error } = useDB()
  const { currentProject, saveCurrentProject, clearCurrentProject } = useCurrentProject()

  // Load UI preferences from localStorage
  const [showIaC, setShowIaC] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('createstack-showIaC')
      return saved ? JSON.parse(saved) : false
    }
    return false
  })

  const [defaultIaCTool, setDefaultIaCTool] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('createstack-defaultIaCTool')
      return saved ? JSON.parse(saved) : 'terraform'
    }
    return 'terraform'
  })

  // Save UI preferences to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('createstack-showIaC', JSON.stringify(showIaC))
    }
  }, [showIaC])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('createstack-defaultIaCTool', JSON.stringify(defaultIaCTool))
    }
  }, [defaultIaCTool])

  // Load current project data when available
  useEffect(() => {
    if (currentProject) {
      isLoadingFromDB.current = true
      setProjectName(currentProject.name)
      setSelectedPlatform(currentProject.platform)
      setSelectedProjectType(currentProject.projectType || "web-app")
      setSelectedArchitecture(currentProject.architecture || "")
      setSelectedCloudPlatform(currentProject.cloudPlatform || "aws")
      setSelectedDepTool(currentProject.dependencyTool)
      setSelectedDocTool(currentProject.documentationTool)
      setSelectedCICDTool(currentProject.cicdTool || "github-actions")
      setSelectedIssueTrackingTool(currentProject.issueTrackingTool || "github-issues")
      setSelectedFeatureFlagTool(currentProject.featureFlagTool || "configcat")
      setSelectedPersonas(currentProject.teamPersonas || ["developer", "product-owner"])
      setSelectedIndustry(currentProject.industry || "none")
      // Reset loading flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isLoadingFromDB.current = false
      }, 100)
    }
  }, [currentProject])

  // Update external project state ref when provided (for gap analysis)
  useEffect(() => {
    if (projectStateRef && !isLoadingFromDB.current) {
      projectStateRef.current = {
        projectName,
        selectedPlatform,
        selectedProjectType,
        selectedArchitecture,
        selectedCloudPlatform,
        selectedDepTool,
        selectedDocTool,
        selectedCICDTool,
        selectedIssueTrackingTool,
        selectedFeatureFlagTool,
        selectedPersonas,
        selectedIndustry
      };
    }
  }, [
    projectStateRef,
    projectName,
    selectedPlatform,
    selectedProjectType,
    selectedArchitecture,
    selectedCloudPlatform,
    selectedDepTool,
    selectedDocTool,
    selectedCICDTool,
    selectedIssueTrackingTool,
    selectedFeatureFlagTool,
    selectedPersonas,
    selectedIndustry
  ])

  // Reset architecture selection when project type changes
  useEffect(() => {
    const availableArchitectures = getArchitecturesForProjectType(selectedProjectType)
    const isCurrentArchitectureAvailable = availableArchitectures.some(arch => arch.id === selectedArchitecture)
    
    if (!isCurrentArchitectureAvailable && availableArchitectures.length > 0) {
      setSelectedArchitecture(availableArchitectures[0].id)
      setShowArchitectureDiagram(false)
    } else if (availableArchitectures.length === 0) {
      setSelectedArchitecture("")
      setShowArchitectureDiagram(false)
    }
  }, [selectedProjectType, selectedArchitecture])

  const handleCreateRepository = async () => {
    if (projectName.trim()) {
      const platform = platforms.find(p => p.id === selectedPlatform)
      if (platform) {
        try {
          await saveCurrentProject({
            name: projectName.trim(),
            platform: selectedPlatform,
            projectType: selectedProjectType,
            architecture: selectedArchitecture,
            cloudPlatform: selectedCloudPlatform,
            dependencyTool: selectedDepTool,
            documentationTool: selectedDocTool,
            cicdTool: selectedCICDTool,
            issueTrackingTool: selectedIssueTrackingTool,
            featureFlagTool: selectedFeatureFlagTool,
            teamPersonas: selectedPersonas,
            industry: selectedIndustry
          })

          const url = platform.url === '#' ? '#' : platform.url + encodeURIComponent(projectName.trim())
          if (url !== '#') {
            window.open(url, '_blank')
          }
        } catch (error) {
          console.error('Failed to save project:', error)
        }
      }
    }
  }

  const saveData = async () => {
    if (!isReady || !projectName.trim()) return

    setIsSaving(true)
    try {
      await saveCurrentProject({
        name: projectName.trim(),
        platform: selectedPlatform,
        projectType: selectedProjectType,
        architecture: selectedArchitecture,
        cloudPlatform: selectedCloudPlatform,
        dependencyTool: selectedDepTool,
        documentationTool: selectedDocTool,
        cicdTool: selectedCICDTool,
        issueTrackingTool: selectedIssueTrackingTool,
        featureFlagTool: selectedFeatureFlagTool,
        teamPersonas: selectedPersonas,
        industry: selectedIndustry
      })
    } catch (error) {
      console.error('Failed to save data:', error)
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }

  const clearSavedData = async () => {
    if (!isReady) return

    try {
      await clearCurrentProject()
      
      setProjectName("")
      setSelectedPlatform("github")
      setSelectedProjectType("web-app")
      setSelectedArchitecture("")
      setSelectedCloudPlatform("aws")
      setSelectedDepTool("dependabot")
      setSelectedDocTool("readme")
      setSelectedCICDTool("github-actions")
      setSelectedIssueTrackingTool("github-issues")
      setSelectedFeatureFlagTool("configcat")
      setSelectedPersonas(["developer", "product-owner"])
      setSelectedIndustry("none")
      setShowIaC(false)
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  // Auto-save when data changes
  useEffect(() => {
    if (isReady && projectName.trim() && !isLoadingFromDB.current) {
      const timeoutId = setTimeout(saveData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [projectName, selectedPlatform, selectedProjectType, selectedArchitecture, selectedCloudPlatform, selectedDepTool, selectedDocTool, selectedCICDTool, selectedIssueTrackingTool, selectedFeatureFlagTool, selectedPersonas, selectedIndustry, isReady])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Content copied to clipboard!")
    })
  }

  // Create clear saved data action (fallback for when not in mode switching context)
  const clearSavedDataAction = (
    <div className="flex items-center space-x-3">
      <SavingIndicator isSaving={isSaving} />
      <Button 
        variant="default"
        onClick={clearSavedData}
        className="flex items-center space-x-2"
        disabled={!isReady}
      >
        <span>+</span>
        <span>New Project Plan</span>
      </Button>
    </div>
  );

  // Create header actions for mode switching
  const headerActions = onModeChange ? (
    <div className="flex gap-2">
      <Button
        variant={mode === 'gap-analysis' ? 'default' : 'outline'}
        onClick={() => onModeChange('gap-analysis')}
        className="flex items-center gap-2"
        size="sm"
      >
        <Search className="h-4 w-4" />
        Analyze Existing Stack
      </Button>
      <Button
        variant={mode === 'stack-builder' ? 'default' : 'outline'}
        onClick={() => onModeChange('stack-builder')}
        className="flex items-center gap-2"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Build New Stack
      </Button>
    </div>
  ) : clearSavedDataAction;

  const currentMode = mode || analysisContext?.mode;

  if (error) {
    return (
      <AppLayout 
        title="Project" 
        description="Database Error"
      >
        <div className="text-center py-8">
          <p className="text-red-600">Failed to initialize database: {error}</p>
          <p className="text-sm text-muted-foreground mt-2">Please refresh the page to try again.</p>
        </div>
      </AppLayout>
    )
  }

  if (!isReady) {
    return (
      <AppLayout 
        title="Project" 
        description="Loading..."
      >
        <div className="text-center py-8">
          <p>Initializing database...</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout 
      title={currentMode === 'gap-analysis' ? "Stack Gap Analysis" : "Technology Stack Planning"}
      description={currentMode === 'gap-analysis' 
        ? "Analyze your existing technology stack to identify gaps and get targeted recommendations."
        : "Build business-aligned technology choices with clear rationale for stakeholders across teams."
      }
      headerActions={headerActions}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Setup Card */}
        <Card className={completedCards['project-setup'] ? 'bg-gray-50 border-green-200' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">🚀</span>
              <span>{currentMode === 'gap-analysis' ? "Current Stack Setup" : "Project Setup"}</span>
              <CardCompletionToggle
                cardId="project-setup"
                isCompleted={completedCards['project-setup']}
                onToggle={toggleCardCompletion}
              />
            </CardTitle>
            <CardDescription>
              {analysisContext?.mode === 'gap-analysis' 
                ? "Enter your existing technologies below to see what's missing from your stack"
                : "Define your project name and team composition to get personalized tool recommendations"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="Enter your project name..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full"
                disabled={completedCards['project-setup']}
              />
            </div>
            
            {/* Team Personas Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Team Personas</label>
              <p className="text-xs text-muted-foreground">
                Select the roles working on this project to get personalized tool recommendations
              </p>
              <div className="flex flex-wrap gap-2">
                {teamPersonas.map((persona) => {
                  const isSelected = selectedPersonas.includes(persona.id);
                  return (
                    <Badge
                      key={persona.id}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        completedCards['project-setup'] 
                          ? "opacity-50 cursor-not-allowed" 
                          : isSelected 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted"
                      }`}
                      onClick={() => {
                        if (completedCards['project-setup']) return;
                        if (isSelected) {
                          setSelectedPersonas(selectedPersonas.filter(id => id !== persona.id));
                        } else {
                          setSelectedPersonas([...selectedPersonas, persona.id]);
                        }
                      }}
                    >
                      <span className="mr-1">{persona.emoji}</span>
                      {persona.name}
                    </Badge>
                  );
                })}
              </div>
              {selectedPersonas.length > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-700">
                    <strong>Selected:</strong> {selectedPersonas.map(id => 
                      teamPersonas.find(p => p.id === id)?.name
                    ).join(", ")}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Tools will be filtered and prioritized based on these roles
                  </p>
                </div>
              )}
            </div>

            {/* Industry Selection */}
            <div className="space-y-2">
              <label htmlFor="industry-select" className="text-sm font-medium">
                Industry (Optional)
              </label>
              <p className="text-xs text-muted-foreground">
                Select your industry for domain-specific recommendations, or skip for general recommendations
              </p>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry} disabled={completedCards['project-setup']}>
                <SelectTrigger id="industry-select">
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      <div className="flex items-center space-x-2">
                        <span>{industry.emoji}</span>
                        <span>{industry.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedIndustry && (
                <div className={`p-3 rounded-lg border ${
                  selectedIndustry === "none" 
                    ? "bg-gray-50 border-gray-200" 
                    : "bg-amber-50 border-amber-200"
                }`}>
                  <p className={`text-xs ${
                    selectedIndustry === "none" 
                      ? "text-gray-700" 
                      : "text-amber-700"
                  }`}>
                    <strong>Selected:</strong> {industries.find(i => i.id === selectedIndustry)?.name}
                  </p>
                  <p className={`text-xs mt-1 ${
                    selectedIndustry === "none" 
                      ? "text-gray-700" 
                      : "text-amber-700"
                  }`}>
                    {industries.find(i => i.id === selectedIndustry)?.description}
                  </p>
                </div>
              )}
            </div>

            {/* Project Status */}
            {projectName.trim() && selectedPersonas.length > 0 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800 mb-1">
                  ✅ Project Ready
                </p>
                <p className="text-xs text-green-700">
                  <strong>{projectName}</strong> is configured for a team with {selectedPersonas.length} persona{selectedPersonas.length > 1 ? 's' : ''}{selectedIndustry && selectedIndustry !== "none" ? ` in the ${industries.find(i => i.id === selectedIndustry)?.name} industry` : ' with general recommendations'}. 
                  Tool recommendations will be tailored to your team composition{selectedIndustry && selectedIndustry !== "none" ? ' and industry focus' : ''}.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Real-time Gap Analysis Card - only in gap analysis mode */}
        {currentMode === 'gap-analysis' && (
          <RealTimeGapAnalysisCard 
            projectState={{
              projectName,
              selectedPlatform,
              selectedProjectType,
              selectedArchitecture,
              selectedCloudPlatform,
              selectedDepTool,
              selectedDocTool,
              selectedCICDTool,
              selectedIssueTrackingTool,
              selectedFeatureFlagTool,
              selectedPersonas,
              selectedIndustry
            }} 
            completedCards={completedCards}
          />
        )}

        {/* Project Type Card */}
        <Card className={completedCards['project-type'] ? 'bg-gray-50 border-green-200' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{projectTypes.find(p => p.id === selectedProjectType)?.emoji}</span>
              <span>Product Strategy & Architecture</span>
              <CardCompletionToggle
                cardId="project-type"
                isCompleted={completedCards['project-type']}
                onToggle={toggleCardCompletion}
              />
            </CardTitle>
            <CardDescription>
              Align technical approach with business goals, budget constraints, and delivery timelines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-type-select" className="text-sm font-medium">
                Project Type
              </label>
              <Select value={selectedProjectType} onValueChange={setSelectedProjectType} disabled={completedCards['project-type']}>
                <SelectTrigger id="project-type-select">
                  <SelectValue placeholder="Select a project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center space-x-2">
                        <span>{type.emoji}</span>
                        <span>{type.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Project Type Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
                <span>{projectTypes.find(p => p.id === selectedProjectType)?.emoji}</span>
                <span>{projectTypes.find(p => p.id === selectedProjectType)?.name}</span>
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {projectTypes.find(p => p.id === selectedProjectType)?.description}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Best for:</strong> {projectTypes.find(p => p.id === selectedProjectType)?.bestFor}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Common Stacks:</strong> {projectTypes.find(p => p.id === selectedProjectType)?.commonStacks.join(", ")}
              </p>
            </div>
            
            {/* Architecture Selection */}
            {getArchitecturesForProjectType(selectedProjectType).length > 0 && (
              <div className="space-y-2">
                <label htmlFor="architecture-select" className="text-sm font-medium">
                  Architecture Pattern
                </label>
                <Select value={selectedArchitecture} onValueChange={setSelectedArchitecture} disabled={completedCards['project-type']}>
                  <SelectTrigger id="architecture-select">
                    <SelectValue placeholder="Select an architecture pattern" />
                  </SelectTrigger>
                  <SelectContent>
                    {getArchitecturesForProjectType(selectedProjectType).map((arch) => (
                      <SelectItem key={arch.id} value={arch.id}>
                        <span>{arch.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Architecture Info */}
            {selectedArchitecture && getArchitecture(selectedProjectType, selectedArchitecture) && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">
                  {getArchitecture(selectedProjectType, selectedArchitecture)?.name}
                </h4>
                <p className="text-xs text-blue-700 mb-2">
                  {getArchitecture(selectedProjectType, selectedArchitecture)?.description}
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  <strong>Best for:</strong> {getArchitecture(selectedProjectType, selectedArchitecture)?.bestFor}
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Examples:</strong> {getArchitecture(selectedProjectType, selectedArchitecture)?.examples.join(", ")}
                </p>
              </div>
            )}
            
            {/* Architecture Diagram */}
            {selectedArchitecture && getArchitecture(selectedProjectType, selectedArchitecture) && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowArchitectureDiagram(!showArchitectureDiagram)}
                  className="flex items-center justify-between w-full text-left text-sm font-medium hover:text-blue-600 transition-colors"
                >
                  <span>🏗️ Architecture Diagram</span>
                  {showArchitectureDiagram ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {showArchitectureDiagram && (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <MermaidDiagram 
                      key={`${selectedProjectType}-${selectedArchitecture}`}
                      id={`architecture-${selectedArchitecture}-${selectedProjectType}`}
                      diagram={generateArchitectureDiagram(getArchitecture(selectedProjectType, selectedArchitecture)!).mermaidCode}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            )}
            
            {/* Architecture ADR Section */}
            {projectName.trim() && selectedArchitecture && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📝 Architecture Decision Record</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateArchitectureADR(projectName, selectedArchitecture, getArchitecturesForProjectType(selectedProjectType)))}
                  >
                    Copy ADR
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Document your architecture pattern decision for future reference
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PLAN PHASE - DevOps Lifecycle */}
        {/* Documentation Card - PLAN: Tech specs and product specifications */}
        <DocumentationCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedDocTool={selectedDocTool}
          onDocToolChange={setSelectedDocTool}
          onCopyToClipboard={copyToClipboard}
          isCompleted={completedCards['documentation']}
          onToggleCompletion={() => toggleCardCompletion('documentation')}
        />

        {/* Issue Tracking Card - PLAN: Project management and planning */}
        <IssueTrackingCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedIssueTrackingTool={selectedIssueTrackingTool}
          selectedPersonas={selectedPersonas}
          onIssueTrackingToolChange={setSelectedIssueTrackingTool}
          onCopyToClipboard={copyToClipboard}
          isCompleted={completedCards['issue-tracking']}
          onToggleCompletion={() => toggleCardCompletion('issue-tracking')}
        />

        {/* CODE PHASE - DevOps Lifecycle */}
        {/* Code Hosting Card - CODE: Version control and collaboration */}
        <Card className={`border-l-4 border-l-green-400 ${completedCards['code-hosting'] ? 'bg-gray-50 border-green-200' : ''}`}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
              <span>Code Hosting</span>
              <CardCompletionToggle
                cardId="code-hosting"
                isCompleted={completedCards['code-hosting']}
                onToggle={toggleCardCompletion}
              />
            </CardTitle>
            <CardDescription>
              Choose development tools considering budget, compliance requirements, and team productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="platform-select" className="text-sm font-medium">
                Platform
              </label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform} disabled={completedCards['code-hosting']}>
                <SelectTrigger id="platform-select">
                  <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center space-x-2">
                        <span>{platform.emoji}</span>
                        <span>{platform.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Platform Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
                <span>{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
                <span>{platforms.find(p => p.id === selectedPlatform)?.name}</span>
              </h4>
              <p className="text-xs text-muted-foreground mb-1">
                {platforms.find(p => p.id === selectedPlatform)?.description}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Best for:</strong> {platforms.find(p => p.id === selectedPlatform)?.bestFor}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="flex items-center space-x-2"
                disabled={!projectName.trim() || completedCards['code-hosting']}
                onClick={handleCreateRepository}
              >
                <span>{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
                <span>Create Repository</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                className="flex items-center space-x-2"
                disabled={!projectName.trim()}
                onClick={() => setShowIaC(!showIaC)}
              >
                <span>🏗️</span>
                <span>Infrastructure as Code</span>
              </Button>
            </div>
            
            {/* ADR Section */}
            {projectName.trim() && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📝 Architecture Decision Record</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateADR(projectName, selectedPlatform, platforms))}
                  >
                    Copy ADR
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Document your code hosting platform decision for future reference
                </p>
              </div>
            )}

            {/* Vendor Comparison Section */}
            {projectName.trim() && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generateVendorComparison(projectName, selectedPlatform, platforms))}
                  >
                    Copy Vendor Row
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vendor assessment template for finance approvals and procurement processes
                </p>
              </div>
            )}

            {/* Infrastructure as Code Section */}
            {showIaC && projectName.trim() && (
              <InfrastructureAsCode
                projectName={projectName}
                selectedPlatform={selectedPlatform}
                defaultIaCTool={defaultIaCTool}
                onDefaultIaCToolChange={setDefaultIaCTool}
                onCopyToClipboard={copyToClipboard}
              />
            )}
          </CardContent>
        </Card>

        {/* Dependencies Management Card - CODE: Package management */}
        <DependencyManagementCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedDepTool={selectedDepTool}
          onDepToolChange={setSelectedDepTool}
          onCopyToClipboard={copyToClipboard}
          isCompleted={completedCards['dependency-management']}
          onToggleCompletion={() => toggleCardCompletion('dependency-management')}
        />

        {/* BUILD & TEST PHASE - DevOps Lifecycle */}
        {/* CI/CD Card - BUILD/TEST: Continuous integration and testing */}
        <CICDCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedCICDTool={selectedCICDTool}
          onCICDToolChange={setSelectedCICDTool}
          onCopyToClipboard={copyToClipboard}
          isCompleted={completedCards['cicd']}
          onToggleCompletion={() => toggleCardCompletion('cicd')}
        />

        {/* Feature Flag Card - BUILD/TEST: Feature rollout and experimentation */}
        <FeatureFlagCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedFeatureFlagTool={selectedFeatureFlagTool}
          onFeatureFlagToolChange={setSelectedFeatureFlagTool}
          onCopyToClipboard={copyToClipboard}
          isCompleted={completedCards['feature-flags']}
          onToggleCompletion={() => toggleCardCompletion('feature-flags')}
        />

        {/* DEPLOY & OPERATE PHASE - DevOps Lifecycle */}
        {/* Cloud Platform Card - DEPLOY/OPERATE: Infrastructure and deployment */}
        <CloudPlatformCard
          projectName={projectName}
          selectedCloudPlatform={selectedCloudPlatform}
          selectedArchitecture={selectedArchitecture}
          selectedPersonas={selectedPersonas}
          onCloudPlatformChange={setSelectedCloudPlatform}
          onCopyToClipboard={copyToClipboard}
          isCompleted={completedCards['cloud-platform']}
          onToggleCompletion={() => toggleCardCompletion('cloud-platform')}
        />

        {/* Architecture Services Card - Show services and their mapped cloud products */}
        {(() => {
          const architecture = getArchitecture(selectedProjectType, selectedArchitecture);
          
          return architecture && selectedCloudPlatform ? (
            <ArchitectureServicesCard
              architecture={architecture}
              cloudPlatform={selectedCloudPlatform as 'aws' | 'azure' | 'gcp'}
              onServiceSelectionChange={(selections) => {
                // TODO: Store service selections if needed for project generation
                console.log('Service selections:', selections);
              }}
              isCompleted={completedCards['architecture-services']}
              onToggleCompletion={() => toggleCardCompletion('architecture-services')}
            />
          ) : null;
        })()}
      </div>
    </AppLayout>
  )
}
