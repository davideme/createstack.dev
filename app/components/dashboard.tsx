import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ScrollArea } from "~/components/ui/scroll-area"
import { AppLayout } from "~/components/shared/app-layout"
import { ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { useDB, db } from "~/lib/db"

// Data imports
import { platforms } from "~/data/platforms"
import { dependencyTools, getAvailableDependencyTools, getDependencyToolDocumentationUrl, isDependencyToolNativeToPlatform } from "~/data/dependency-tools"
import { documentationTools, getAvailableDocumentationTools, getDocumentationToolUrl, isDocumentationToolNativeToPlatform } from "~/data/documentation-tools"

// Utility imports
import { generateTerraformCode, generatePulumiCode, generateCloudFormationCode, generateCDKCode } from "~/utils/code-generators"
import { generateADR, generateDependencyADR, generateDocumentationADR } from "~/utils/adr-generators"
import { generateVendorComparison, generateDependencyVendorComparison, generateDocumentationVendorComparison } from "~/utils/vendor-utils"

export default function Dashboard() {
  const [projectName, setProjectName] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("github")
  const [showIaC, setShowIaC] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedDepTool, setSelectedDepTool] = useState("dependabot")
  const [selectedDocTool, setSelectedDocTool] = useState("readme")
  const { isReady, error } = useDB()

  // Load saved data on component mount
  useEffect(() => {
    if (!isReady) return;

    const loadPreferences = async () => {
      try {
        const savedProjectName = await db.getPreference('currentProjectName')
        const savedPlatform = await db.getPreference('selectedPlatform')
        const savedDepTool = await db.getPreference('selectedDepTool')
        const savedDocTool = await db.getPreference('selectedDocTool')
        const savedTime = await db.getPreference('lastSaved')
        
        if (savedProjectName) {
          setProjectName(savedProjectName)
        }
        
        if (savedPlatform) {
          setSelectedPlatform(savedPlatform)
        }

        if (savedDepTool) {
          setSelectedDepTool(savedDepTool)
        }

        if (savedDocTool) {
          setSelectedDocTool(savedDocTool)
        }
        
        if (savedTime) {
          setLastSaved(new Date(savedTime))
        }
      } catch (error) {
        console.error('Failed to load preferences:', error)
      }
    }

    loadPreferences()
  }, [isReady])

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

  const handleCreateRepository = async () => {
    if (projectName.trim()) {
      const platform = platforms.find(p => p.id === selectedPlatform)
      if (platform) {
        try {
          // Save current preferences
          await db.setPreference('currentProjectName', projectName.trim())
          await db.setPreference('selectedPlatform', selectedPlatform)
          await db.setPreference('lastSaved', new Date().toISOString())
          setLastSaved(new Date())

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
    if (!isReady) return

    setIsSaving(true)
    try {
      await db.setPreference('currentProjectName', projectName)
      await db.setPreference('selectedPlatform', selectedPlatform)
      await db.setPreference('selectedDepTool', selectedDepTool)
      await db.setPreference('selectedDocTool', selectedDocTool)
      await db.setPreference('lastSaved', new Date().toISOString())
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save data:', error)
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }

  const clearSavedData = async () => {
    if (!isReady) return

    try {
      // Clear individual preferences
      await db.setPreference('currentProjectName', '')
      await db.setPreference('selectedPlatform', 'github')
      await db.setPreference('selectedDepTool', 'dependabot')
      await db.setPreference('selectedDocTool', 'readme')
      await db.setPreference('lastSaved', '')
      
      setProjectName("")
      setSelectedPlatform("github")
      setSelectedDepTool("dependabot")
      setSelectedDocTool("readme")
      setLastSaved(null)
      setShowIaC(false)
    } catch (error) {
      console.error('Failed to clear data:', error)
    }
  }

  // Auto-save when data changes
  useEffect(() => {
    if (isReady && (projectName || selectedPlatform !== "github" || selectedDepTool !== "dependabot" || selectedDocTool !== "readme")) {
      const timeoutId = setTimeout(saveData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [projectName, selectedPlatform, selectedDepTool, selectedDocTool, isReady])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Content copied to clipboard!")
    })
  }

  const clearSavedDataAction = (
    <Button 
      variant="default"
      onClick={clearSavedData}
      className="flex items-center space-x-2"
      disabled={!isReady}
    >
      <span>+</span>
      <span>New Project</span>
    </Button>
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
      title="Project" 
      description="Welcome back! Here's what's happening."
      headerActions={clearSavedDataAction}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Code Hosting Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
              <span>Code Hosting</span>
              {isSaving && (
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-muted-foreground font-normal">Saving...</span>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              Create a new repository for your project on your preferred platform
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
                  Single vendor entry ready for your evaluation spreadsheet
                </p>
              </div>
            )}

            {/* Infrastructure as Code Section */}
            {showIaC && projectName.trim() && (
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium">Infrastructure as Code Templates</h4>
                
                <Tabs defaultValue="terraform" className="w-full">
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
              {isSaving && (
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-muted-foreground font-normal">Saving...</span>
                </div>
              )}
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
                
                <Tabs defaultValue="terraform" className="w-full">
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
              {isSaving && (
                <div className="flex items-center space-x-1 ml-auto">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                  <span className="text-xs text-muted-foreground font-normal">Saving...</span>
                </div>
              )}
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
