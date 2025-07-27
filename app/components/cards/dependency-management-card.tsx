import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink, Lock, Unlock } from "lucide-react"
import { dependencyTools, getAvailableDependencyTools, getDependencyToolDocumentationUrl, isDependencyToolNativeToPlatform } from "~/data/dependency-tools"
import { generateDependencyADR } from "~/utils/adr-generators"
import { generateDependencyVendorComparison } from "~/utils/vendor-utils"
import { platforms } from "~/data/platforms"

interface DependencyManagementCardProps {
  projectName: string
  selectedPlatform: string
  selectedDepTool: string
  onDepToolChange: (toolId: string) => void
  onCopyToClipboard: (text: string) => void
  isCompleted?: boolean
  onToggleCompletion?: () => void
}

export function DependencyManagementCard({
  projectName,
  selectedPlatform,
  selectedDepTool,
  onDepToolChange,
  onCopyToClipboard,
  isCompleted = false,
  onToggleCompletion
}: DependencyManagementCardProps) {
  const handleConfigureTool = () => {
    const url = getDependencyToolDocumentationUrl(selectedDepTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Manual dependency management doesn't have specific documentation. Consider setting up a process for tracking and updating dependencies.")
    }
  }

  const selectedTool = dependencyTools.find(t => t.id === selectedDepTool)

  return (
    <Card className={`border-l-4 border-l-green-400 ${isCompleted ? 'bg-gray-50 border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-xl">{selectedTool?.emoji}</span>
          <span>Dependencies Management</span>
          {onToggleCompletion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCompletion}
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
          <Select value={selectedDepTool} onValueChange={onDepToolChange} disabled={isCompleted}>
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
            <span>{selectedTool?.emoji}</span>
            <span>{selectedTool?.name}</span>
          </h4>
          <p className="text-xs text-muted-foreground mb-1">
            {selectedTool?.description}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Best for:</strong> {selectedTool?.bestFor}
          </p>
          {/* MCP Integration Info */}
          {(selectedDepTool === 'dependabot' || selectedDepTool === 'gitlab-deps') && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700 font-medium">
                🤖 MCP Integration Available
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedDepTool === 'dependabot' 
                  ? 'Use the official GitHub MCP tool for automated dependency management and security monitoring. '
                  : 'Use the official GitLab MCP tool for automated dependency scanning and vulnerability management. '
                }
                <a 
                  href={selectedDepTool === 'dependabot' 
                    ? 'https://github.com/modelcontextprotocol/servers/tree/main/src/github'
                    : 'https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab'
                  } 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  View MCP Tool →
                </a>
              </p>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="flex items-center space-x-2"
            disabled={!projectName.trim() || isCompleted}
            onClick={handleConfigureTool}
          >
            <span>{selectedTool?.emoji}</span>
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
                disabled={isCompleted}
                onClick={() => onCopyToClipboard(generateDependencyADR(projectName, selectedDepTool, dependencyTools))}
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
                  disabled={isCompleted}
                  onClick={() => onCopyToClipboard(generateDependencyVendorComparison(projectName, selectedDepTool, dependencyTools))}
                >
                  Copy Vendor Row
                </Button>
              )}
            </div>
            {isDependencyToolNativeToPlatform(selectedPlatform, selectedDepTool) ? (
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700">
                  ✅ <strong>{selectedTool?.name}</strong> is already included with {platforms.find(p => p.id === selectedPlatform)?.name}. No separate vendor evaluation needed.
                </p>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                Vendor entry for <strong>{selectedTool?.name}</strong> ready for your evaluation spreadsheet
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
