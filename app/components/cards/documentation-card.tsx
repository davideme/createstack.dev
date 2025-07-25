import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink } from "lucide-react"
import { documentationTools, getAvailableDocumentationTools, getDocumentationToolUrl, isDocumentationToolNativeToPlatform } from "~/data/documentation-tools"
import { generateDocumentationADR } from "~/utils/adr-generators"
import { generateDocumentationVendorComparison } from "~/utils/vendor-utils"
import { platforms } from "~/data/platforms"

interface DocumentationCardProps {
  projectName: string
  selectedPlatform: string
  selectedDocTool: string
  onDocToolChange: (toolId: string) => void
  onCopyToClipboard: (text: string) => void
}

export function DocumentationCard({
  projectName,
  selectedPlatform,
  selectedDocTool,
  onDocToolChange,
  onCopyToClipboard
}: DocumentationCardProps) {
  const handleConfigureDocTool = () => {
    const url = getDocumentationToolUrl(selectedDocTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("This documentation tool requires manual setup. Please refer to the tool's official documentation.")
    }
  }

  const selectedTool = documentationTools.find(t => t.id === selectedDocTool)

  return (
    <Card className="border-l-4 border-l-blue-400">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-xl">{selectedTool?.emoji}</span>
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
          <Select value={selectedDocTool} onValueChange={onDocToolChange}>
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
            <span>{selectedTool?.emoji}</span>
            <span>{selectedTool?.name}</span>
          </h4>
          <p className="text-xs text-muted-foreground mb-1">
            {selectedTool?.description}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Best for:</strong> {selectedTool?.bestFor}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="flex items-center space-x-2"
            disabled={!projectName.trim()}
            onClick={handleConfigureDocTool}
          >
            <span>{selectedTool?.emoji}</span>
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
                onClick={() => onCopyToClipboard(generateDocumentationADR(projectName, selectedDocTool, documentationTools))}
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
                  onClick={() => onCopyToClipboard(generateDocumentationVendorComparison(projectName, selectedDocTool, documentationTools))}
                >
                  Copy Vendor Row
                </Button>
              )}
            </div>
            {isDocumentationToolNativeToPlatform(selectedPlatform, selectedDocTool) ? (
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
