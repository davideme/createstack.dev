import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink } from "lucide-react"
import { CompletableCard } from "~/components/ui/completable-card"
import { useCompletableInputs } from "~/hooks/use-completable-inputs"
import { issueTrackingTools, getAvailableIssueTrackingTools, getIssueTrackingToolDocumentationUrl, isIssueTrackingToolNativeToPlatform } from "~/data/issue-tracking-tools"
import { generateIssueTrackingADR } from "~/utils/adr-generators"
import { generateIssueTrackingVendorComparison } from "~/utils/vendor-utils"
import { platforms } from "~/data/platforms"
import { getPersonasByIds } from "~/data/personas"

interface IssueTrackingCardProps {
  projectName: string
  selectedPlatform: string
  selectedIssueTrackingTool: string
  selectedPersonas: string[]
  onIssueTrackingToolChange: (toolId: string) => void
  onCopyToClipboard: (text: string) => void
  isCompleted?: boolean
  onToggleCompletion?: () => void
}

export function IssueTrackingCard({
  projectName,
  selectedPlatform,
  selectedIssueTrackingTool,
  selectedPersonas,
  onIssueTrackingToolChange,
  onCopyToClipboard,
  isCompleted = false,
  onToggleCompletion
}: IssueTrackingCardProps) {
  const handleConfigureIssueTrackingTool = () => {
    const url = getIssueTrackingToolDocumentationUrl(selectedIssueTrackingTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Please check the tool's documentation for setup instructions.")
    }
  }

  const selectedTool = issueTrackingTools.find(t => t.id === selectedIssueTrackingTool)
  const { selectProps, buttonProps } = useCompletableInputs({ 
    isCompleted, 
    baseDisabled: !projectName.trim() 
  })

  return (
    <CompletableCard
      title="Issue & Project Tracking"
      description="Track bugs, features, and project progress"
      emoji={selectedTool?.emoji}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      borderColorClass="border-l-blue-400"
    >
        <div className="space-y-2">
          <label htmlFor="issue-tracking-tool-select" className="text-sm font-medium">
            Issue Tracking Tool
          </label>
          <Select value={selectedIssueTrackingTool} onValueChange={onIssueTrackingToolChange} {...selectProps}>
            <SelectTrigger id="issue-tracking-tool-select" className={selectProps.className}>
              <SelectValue placeholder="Select an issue tracking tool" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableIssueTrackingTools(selectedPlatform, selectedPersonas).map((tool) => (
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
          <p className="text-xs text-muted-foreground mb-1">
            <strong>Best for:</strong> {selectedTool?.bestFor}
          </p>
          {selectedTool?.targetPersonas && selectedTool.targetPersonas.length > 0 && (
            <p className="text-xs text-muted-foreground">
              <strong>Target personas:</strong> {getPersonasByIds(selectedTool.targetPersonas).map(p => p.name).join(", ")}
            </p>
          )}
          {/* MCP Integration Info */}
          {(selectedIssueTrackingTool === 'github-issues' || selectedIssueTrackingTool === 'gitlab-issues') && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700 font-medium">
                🤖 MCP Integration Available
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedIssueTrackingTool === 'github-issues' 
                  ? 'Use the official GitHub MCP tool for automated issue management and AI assistance. '
                  : 'Use the official GitLab MCP tool for automated issue management and AI assistance. '
                }
                <a 
                  href={selectedIssueTrackingTool === 'github-issues' 
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
            onClick={handleConfigureIssueTrackingTool}
          >
            <span>{selectedTool?.emoji}</span>
            <span>Setup Tool</span>
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
                onClick={() => onCopyToClipboard(generateIssueTrackingADR(projectName, selectedIssueTrackingTool, issueTrackingTools))}
              >
                Copy ADR
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Document your issue tracking tool decision for future reference
            </p>
          </div>
        )}

        {/* Vendor Entry Section */}
        {projectName.trim() && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
              {!isIssueTrackingToolNativeToPlatform(selectedPlatform, selectedIssueTrackingTool) && (
                <Button
                  size="sm"
                  variant="outline"
                  {...buttonProps}
                  onClick={() => onCopyToClipboard(generateIssueTrackingVendorComparison(projectName, selectedIssueTrackingTool, issueTrackingTools))}
                >
                  Copy Vendor Row
                </Button>
              )}
            </div>
            {isIssueTrackingToolNativeToPlatform(selectedPlatform, selectedIssueTrackingTool) ? (
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
