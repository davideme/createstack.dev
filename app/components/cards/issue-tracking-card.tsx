import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink } from "lucide-react"
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
}

export function IssueTrackingCard({
  projectName,
  selectedPlatform,
  selectedIssueTrackingTool,
  selectedPersonas,
  onIssueTrackingToolChange,
  onCopyToClipboard
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

  return (
    <Card className="border-l-4 border-l-blue-400">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-xl">{selectedTool?.emoji}</span>
          <span>Issue & Project Tracking</span>
        </CardTitle>
        <CardDescription>
          Track bugs, features, and project progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="issue-tracking-tool-select" className="text-sm font-medium">
            Issue Tracking Tool
          </label>
          <Select value={selectedIssueTrackingTool} onValueChange={onIssueTrackingToolChange}>
            <SelectTrigger id="issue-tracking-tool-select">
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
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="flex items-center space-x-2"
            disabled={!projectName.trim()}
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
      </CardContent>
    </Card>
  )
}
