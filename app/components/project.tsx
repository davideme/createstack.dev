import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ScrollArea } from "~/components/ui/scroll-area"
import { SavingIndicator } from "~/components/ui/saving-indicator"
import { MermaidDiagram } from "~/components/ui/mermaid-diagram"
import { AppLayout } from "~/components/shared/app-layout"
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useDB, useCurrentProject } from "~/lib/db"

// Data imports
import { platforms } from "~/data/platforms"
import { projectTypes, getProjectType, getArchitecturesForProjectType, getArchitecture } from "~/data/project-types"
import { dependencyTools, getAvailableDependencyTools, getDependencyToolDocumentationUrl, isDependencyToolNativeToPlatform } from "~/data/dependency-tools"
import { documentationTools, getAvailableDocumentationTools, getDocumentationToolUrl, isDocumentationToolNativeToPlatform } from "~/data/documentation-tools"

// Utility imports
import { generateTerraformCode, generatePulumiCode, generateCloudFormationCode, generateCDKCode } from "~/utils/code-generators"
import { generateADR, generateDependencyADR, generateDocumentationADR, generateArchitectureADR } from "~/utils/adr-generators"
import { generateVendorComparison, generateDependencyVendorComparison, generateDocumentationVendorComparison } from "~/utils/vendor-utils"
import { generateArchitectureDiagram } from "~/utils/architecture-diagrams"

export default function Project() {
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("github")
  const [selectedProjectType, setSelectedProjectType] = useState("web-app")
  const [selectedArchitecture, setSelectedArchitecture] = useState("")
  const [selectedDepTool, setSelectedDepTool] = useState("dependabot")
  const [selectedDocTool, setSelectedDocTool] = useState("readme")
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
    }
  }, [currentProject])

  // Reset dependency tool selection when platform changes if current selection is not available
  useEffect(() => {
    const availableTools = getAvailableDependencyTools(selectedPlatform)
    const isCurrentToolAvailable = availableTools.some(tool => tool.id === selectedDepTool)
    
    if (!isCurrentToolAvailable && availableTools.length > 0) {
      // Set to the first available tool, preferring platform-specific ones
      const platformSpecificTool = availableTools.find(tool => 
        (selectedPlatform === 'github' && tool.id === 'dependabot') ||
        (selectedPlatform === 'gitlab' && tool.id === 'gitlab-deps')
      )
      setSelectedDepTool(platformSpecificTool?.id || availableTools[0].id)
    }
  }, [selectedPlatform, selectedDepTool])

  // Reset documentation tool selection when platform changes if current selection is not available
  useEffect(() => {
    const availableDocTools = getAvailableDocumentationTools(selectedPlatform)
    const isCurrentDocToolAvailable = availableDocTools.some(tool => tool.id === selectedDocTool)
    
    if (!isCurrentDocToolAvailable && availableDocTools.length > 0) {
      // Set to platform-specific tool or README as fallback
      const platformSpecificTool = availableDocTools.find(tool => 
        (selectedPlatform === 'github' && tool.id === 'github-wiki') ||
        (selectedPlatform === 'gitlab' && tool.id === 'gitlab-wiki') ||
        (tool.id === 'readme')
      )
      setSelectedDocTool(platformSpecificTool?.id || availableDocTools[0].id)
    }
  }, [selectedPlatform, selectedDocTool])

  // Reset architecture selection when project type changes if current selection is not available
  useEffect(() => {
    const availableArchitectures = getArchitecturesForProjectType(selectedProjectType)
    const isCurrentArchitectureAvailable = availableArchitectures.some(arch => arch.id === selectedArchitecture)
    
    if (!isCurrentArchitectureAvailable && availableArchitectures.length > 0) {
      // Set to the first architecture as default
      setSelectedArchitecture(availableArchitectures[0].id)
      // Reset diagram visibility when architecture changes
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
          // Save current project data to IndexedDB
          await saveCurrentProject({
            name: projectName.trim(),
            platform: selectedPlatform,
            projectType: selectedProjectType,
            architecture: selectedArchitecture,
            dependencyTool: selectedDepTool,
            documentationTool: selectedDocTool
          })

          // Open the platform URL
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

  const handleConfigureTool = () => {
    const url = getDependencyToolDocumentationUrl(selectedDepTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Manual dependency management doesn't have specific documentation. Consider setting up a process for tracking and updating dependencies.")
    }
  }

  const handleConfigureDocTool = () => {
    const url = getDocumentationToolUrl(selectedDocTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("This documentation tool requires manual setup. Please refer to the tool's official documentation.")
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
        documentationTool: selectedDocTool
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
      // Clear current project
      await clearCurrentProject()
      
      // Reset form state
      setProjectName("")
      setSelectedPlatform("github")
      setSelectedProjectType("web-app")
      setSelectedArchitecture("")
      setSelectedDepTool("dependabot")
      setSelectedDocTool("readme")
      setShowIaC(false)
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  // Auto-save when data changes
  useEffect(() => {
    if (isReady && (projectName || selectedPlatform || selectedProjectType || selectedArchitecture || selectedDepTool || selectedDocTool)) {
      const timeoutId = setTimeout(saveData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [projectName, selectedPlatform, selectedProjectType, selectedArchitecture, selectedDepTool, selectedDocTool, isReady])

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
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">Infrastructure as Code Templates</h4>
                
                <Tabs defaultValue={defaultIaCTool} onValueChange={setDefaultIaCTool} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="terraform">Terraform</TabsTrigger>
                    <TabsTrigger value="pulumi">Pulumi</TabsTrigger>
                    <TabsTrigger value="cdk">CDK</TabsTrigger>
                    <TabsTrigger value="cloudformation">CloudFormation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="terraform" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Terraform HCL configuration</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateTerraformCode(projectName, selectedPlatform))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generateTerraformCode(projectName, selectedPlatform)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="pulumi" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Pulumi TypeScript program</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatePulumiCode(projectName, platforms, selectedPlatform))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generatePulumiCode(projectName, platforms, selectedPlatform)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="cdk" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">AWS CDK TypeScript</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateCDKCode(projectName, selectedPlatform, platforms))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generateCDKCode(projectName, selectedPlatform, platforms)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="cloudformation" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">AWS CloudFormation template</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateCloudFormationCode(projectName))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generateCloudFormationCode(projectName)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dependencies Management Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{dependencyTools.find(t => t.id === selectedDepTool)?.emoji}</span>
              <span>Dependencies Management</span>
            </CardTitle>
            <CardDescription>
              Manage your project dependencies and automate updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="dep-tool-select" className="text-sm font-medium">
                Dependency Tool
              </label>
              <Select value={selectedDepTool} onValueChange={setSelectedDepTool}>
                <SelectTrigger id="dep-tool-select">
                  <SelectValue placeholder="Select a dependency tool" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDependencyTools(selectedPlatform).map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      <div className="flex items-center space-x-2">
                        <span>{tool.emoji}</span>
                        <span>{tool.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Tool Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
                <span>{dependencyTools.find(t => t.id === selectedDepTool)?.emoji}</span>
                <span>{dependencyTools.find(t => t.id === selectedDepTool)?.name}</span>
              </h4>
              <p className="text-xs text-muted-foreground mb-1">
                {dependencyTools.find(t => t.id === selectedDepTool)?.description}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Best for:</strong> {dependencyTools.find(t => t.id === selectedDepTool)?.bestFor}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="flex items-center space-x-2"
                disabled={!projectName.trim()}
                onClick={handleConfigureTool}
              >
                <span>{dependencyTools.find(t => t.id === selectedDepTool)?.emoji}</span>
                <span>Configure Tool</span>
                <ExternalLink className="h-4 w-4" />
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
                    onClick={() => copyToClipboard(generateDependencyADR(projectName, selectedDepTool, dependencyTools))}
                  >
                    Copy ADR
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Document your dependencies management decision for future reference
                </p>
              </div>
            )}

            {/* Vendor Entry Section */}
            {projectName.trim() && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
                  {!isDependencyToolNativeToPlatform(selectedPlatform, selectedDepTool) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generateDependencyVendorComparison(projectName, selectedDepTool, dependencyTools))}
                    >
                      Copy Vendor Row
                    </Button>
                  )}
                </div>
                {isDependencyToolNativeToPlatform(selectedPlatform, selectedDepTool) ? (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      ✅ <strong>{dependencyTools.find(t => t.id === selectedDepTool)?.name}</strong> is already included with {platforms.find(p => p.id === selectedPlatform)?.name}. No separate vendor evaluation needed.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Vendor entry for <strong>{dependencyTools.find(t => t.id === selectedDepTool)?.name}</strong> ready for your evaluation spreadsheet
                  </p>
                )}
              </div>
            )}

            {/* Configuration as Code Section */}
            {showIaC && projectName.trim() && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">Configuration as Code Templates</h4>
                
                <Tabs defaultValue={defaultIaCTool} onValueChange={setDefaultIaCTool} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="terraform">Terraform</TabsTrigger>
                    <TabsTrigger value="pulumi">Pulumi</TabsTrigger>
                    <TabsTrigger value="cdk">CDK</TabsTrigger>
                    <TabsTrigger value="cloudformation">CloudFormation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="terraform" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Terraform HCL configuration</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateTerraformCode(projectName, selectedPlatform))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generateTerraformCode(projectName, selectedPlatform)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="pulumi" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Pulumi TypeScript program</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generatePulumiCode(projectName, platforms, selectedPlatform))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generatePulumiCode(projectName, platforms, selectedPlatform)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="cdk" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">AWS CDK TypeScript</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateCDKCode(projectName, selectedPlatform, platforms))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generateCDKCode(projectName, selectedPlatform, platforms)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                  
                  <TabsContent value="cloudformation" className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">AWS CloudFormation template</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(generateCloudFormationCode(projectName))}
                      >
                        Copy Code
                      </Button>
                    </div>
                    <ScrollArea className="h-64 w-full rounded-lg border bg-muted">
                      <pre className="p-3 text-xs">
                        <code>{generateCloudFormationCode(projectName)}</code>
                      </pre>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentation Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{documentationTools.find(t => t.id === selectedDocTool)?.emoji}</span>
              <span>Documentation</span>
            </CardTitle>
            <CardDescription>
              Create and maintain project documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="doc-tool-select" className="text-sm font-medium">
                Documentation Tool
              </label>
              <Select value={selectedDocTool} onValueChange={setSelectedDocTool}>
                <SelectTrigger id="doc-tool-select">
                  <SelectValue placeholder="Select a documentation tool" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDocumentationTools(selectedPlatform).map((tool) => (
                    <SelectItem key={tool.id} value={tool.id}>
                      <div className="flex items-center space-x-2">
                        <span>{tool.emoji}</span>
                        <span>{tool.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Tool Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
                <span>{documentationTools.find(t => t.id === selectedDocTool)?.emoji}</span>
                <span>{documentationTools.find(t => t.id === selectedDocTool)?.name}</span>
              </h4>
              <p className="text-xs text-muted-foreground mb-1">
                {documentationTools.find(t => t.id === selectedDocTool)?.description}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Best for:</strong> {documentationTools.find(t => t.id === selectedDocTool)?.bestFor}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                className="flex items-center space-x-2"
                disabled={!projectName.trim()}
                onClick={handleConfigureDocTool}
              >
                <span>{documentationTools.find(t => t.id === selectedDocTool)?.emoji}</span>
                <span>Setup Documentation</span>
                <ExternalLink className="h-4 w-4" />
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
                    onClick={() => copyToClipboard(generateDocumentationADR(projectName, selectedDocTool, documentationTools))}
                  >
                    Copy ADR
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Document your documentation platform decision for future reference
                </p>
              </div>
            )}

            {/* Vendor Entry Section */}
            {projectName.trim() && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
                  {!isDocumentationToolNativeToPlatform(selectedPlatform, selectedDocTool) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generateDocumentationVendorComparison(projectName, selectedDocTool, documentationTools))}
                    >
                      Copy Vendor Row
                    </Button>
                  )}
                </div>
                {isDocumentationToolNativeToPlatform(selectedPlatform, selectedDocTool) ? (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      ✅ <strong>{documentationTools.find(t => t.id === selectedDocTool)?.name}</strong> is already included with {platforms.find(p => p.id === selectedPlatform)?.name}. No separate vendor evaluation needed.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Vendor entry for <strong>{documentationTools.find(t => t.id === selectedDocTool)?.name}</strong> ready for your evaluation spreadsheet
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
