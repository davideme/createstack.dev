import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { SavingIndicator } from "~/components/ui/saving-indicator"
import { MermaidDiagram } from "~/components/ui/mermaid-diagram"
import { AppLayout } from "~/components/shared/app-layout"
import { InfrastructureAsCode } from "~/components/shared/infrastructure-as-code"
import { DependencyManagementCard } from "~/components/cards/dependency-management-card"
import { DocumentationCard } from "~/components/cards/documentation-card"
import { CICDCard } from "~/components/cards/cicd-card"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useDB, useCurrentProject } from "~/lib/db"

// Data imports
import { platforms } from "~/data/platforms"
import { projectTypes, getArchitecturesForProjectType, getArchitecture } from "~/data/project-types"

// Utility imports
import { generateADR, generateArchitectureADR } from "~/utils/adr-generators"
import { generateVendorComparison } from "~/utils/vendor-utils"
import { generateArchitectureDiagram } from "~/utils/architecture-diagrams"

export default function Project() {
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("github")
  const [selectedProjectType, setSelectedProjectType] = useState("web-app")
  const [selectedArchitecture, setSelectedArchitecture] = useState("")
  const [selectedDepTool, setSelectedDepTool] = useState("dependabot")
  const [selectedDocTool, setSelectedDocTool] = useState("readme")
  const [selectedCICDTool, setSelectedCICDTool] = useState("github-actions")
  const [showArchitectureDiagram, setShowArchitectureDiagram] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
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
      setProjectName(currentProject.name)
      setSelectedPlatform(currentProject.platform)
      setSelectedProjectType(currentProject.projectType || "web-app")
      setSelectedArchitecture(currentProject.architecture || "")
      setSelectedDepTool(currentProject.dependencyTool)
      setSelectedDocTool(currentProject.documentationTool)
      setSelectedCICDTool(currentProject.cicdTool || "github-actions")
    }
  }, [currentProject])

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
            dependencyTool: selectedDepTool,
            documentationTool: selectedDocTool,
            cicdTool: selectedCICDTool
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
        dependencyTool: selectedDepTool,
        documentationTool: selectedDocTool,
        cicdTool: selectedCICDTool
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
      setSelectedDepTool("dependabot")
      setSelectedDocTool("readme")
      setSelectedCICDTool("github-actions")
      setShowIaC(false)
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  // Auto-save when data changes
  useEffect(() => {
    if (isReady && (projectName || selectedPlatform || selectedProjectType || selectedArchitecture || selectedDepTool || selectedDocTool || selectedCICDTool)) {
      const timeoutId = setTimeout(saveData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [projectName, selectedPlatform, selectedProjectType, selectedArchitecture, selectedDepTool, selectedDocTool, selectedCICDTool, isReady])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Content copied to clipboard!")
    })
  }

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
  )

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
      title="Technology Stack Planning" 
      description="Build business-aligned technology choices with clear rationale for stakeholders across teams."
      headerActions={clearSavedDataAction}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Project Type Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{projectTypes.find(p => p.id === selectedProjectType)?.emoji}</span>
              <span>Product Strategy & Architecture</span>
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
              <Select value={selectedProjectType} onValueChange={setSelectedProjectType}>
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
                <Select value={selectedArchitecture} onValueChange={setSelectedArchitecture}>
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

        {/* Code Hosting Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
              <span>Code Hosting</span>
            </CardTitle>
            <CardDescription>
              Choose development tools considering budget, compliance requirements, and team productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="platform-select" className="text-sm font-medium">
                  Platform
                </label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
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
                />
              </div>
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
                disabled={!projectName.trim()}
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

        {/* Dependencies Management Card */}
        <DependencyManagementCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedDepTool={selectedDepTool}
          onDepToolChange={setSelectedDepTool}
          onCopyToClipboard={copyToClipboard}
        />

        {/* Documentation Card */}
        <DocumentationCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedDocTool={selectedDocTool}
          onDocToolChange={setSelectedDocTool}
          onCopyToClipboard={copyToClipboard}
        />

        {/* CI/CD Card */}
        <CICDCard
          projectName={projectName}
          selectedPlatform={selectedPlatform}
          selectedCICDTool={selectedCICDTool}
          onCICDToolChange={setSelectedCICDTool}
          onCopyToClipboard={copyToClipboard}
        />
      </div>
    </AppLayout>
  )
}
