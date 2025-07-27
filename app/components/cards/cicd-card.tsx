import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink } from "lucide-react"
import { CompletableCard } from "~/components/ui/completable-card"
import { useCompletableInputs } from "~/hooks/use-completable-inputs"
import { cicdTools, getAvailableCICDTools, getCICDToolDocumentationUrl, isCICDToolNativeToPlatform } from "~/data/ci-cd-tools"
import { generateCICDADR } from "~/utils/adr-generators"
import { generateCICDVendorComparison } from "~/utils/vendor-utils"
import { platforms } from "~/data/platforms"

interface CICDCardProps {
  projectName: string
  selectedPlatform: string
  selectedCICDTool: string
  onCICDToolChange: (toolId: string) => void
  onCopyToClipboard: (text: string) => void
  isCompleted?: boolean
  onToggleCompletion?: () => void
}

export function CICDCard({
  projectName,
  selectedPlatform,
  selectedCICDTool,
  onCICDToolChange,
  onCopyToClipboard,
  isCompleted = false,
  onToggleCompletion
}: CICDCardProps) {
  const handleConfigureCICDTool = () => {
    const url = getCICDToolDocumentationUrl(selectedCICDTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Please check the tool's documentation for setup instructions.")
    }
  }

  const selectedTool = cicdTools.find(t => t.id === selectedCICDTool)
  const { selectProps, buttonProps } = useCompletableInputs({ 
    isCompleted, 
    baseDisabled: !projectName.trim() 
  })

  return (
    <CompletableCard
      title="Continuous Integration"
      description="Automate build, test, and deployment processes"
      emoji={selectedTool?.emoji}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      borderColorClass="border-l-orange-400"
    >
        <div className="space-y-2">
          <label htmlFor="cicd-tool-select" className="text-sm font-medium">
            CI/CD Platform
          </label>
          <Select value={selectedCICDTool} onValueChange={onCICDToolChange} {...selectProps}>
            <SelectTrigger id="cicd-tool-select" className={selectProps.className}>
              <SelectValue placeholder="Select a CI/CD platform" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableCICDTools(selectedPlatform).map((tool) => (
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
          {(selectedCICDTool === 'github-actions' || selectedCICDTool === 'gitlab-ci') && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700 font-medium">
                🤖 MCP Integration Available
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedCICDTool === 'github-actions' 
                  ? 'Use the official GitHub MCP tool for automated workflow management and AI assistance. '
                  : 'Use the official GitLab MCP tool for automated CI/CD pipeline management and AI assistance. '
                }
                <a 
                  href={selectedCICDTool === 'github-actions' 
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
            {...buttonProps}
            onClick={handleConfigureCICDTool}
          >
            <span>{selectedTool?.emoji}</span>
            <span>Setup CI/CD</span>
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
                {...buttonProps}
                onClick={() => onCopyToClipboard(generateCICDADR(projectName, selectedCICDTool, cicdTools))}
              >
                Copy ADR
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Document your CI/CD platform decision for future reference
            </p>
          </div>
        )}

        {/* Vendor Entry Section */}
        {projectName.trim() && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
              {!isCICDToolNativeToPlatform(selectedPlatform, selectedCICDTool) && (
                <Button
                  size="sm"
                  variant="outline"
                  {...buttonProps}
                  onClick={() => onCopyToClipboard(generateCICDVendorComparison(projectName, selectedCICDTool, cicdTools))}
                >
                  Copy Vendor Row
                </Button>
              )}
            </div>
            {isCICDToolNativeToPlatform(selectedPlatform, selectedCICDTool) ? (
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
    </CompletableCard>
  )
}
