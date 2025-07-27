import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink } from "lucide-react"
import { CompletableCard } from "~/components/ui/completable-card"
import { useCompletableInputs } from "~/hooks/use-completable-inputs"
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
  isCompleted?: boolean
  onToggleCompletion?: () => void
}

export function DocumentationCard({
  projectName,
  selectedPlatform,
  selectedDocTool,
  onDocToolChange,
  onCopyToClipboard,
  isCompleted = false,
  onToggleCompletion
}: DocumentationCardProps) {
  const handleConfigureDocTool = () => {
    const url = getDocumentationToolUrl(selectedDocTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Please check the tool's documentation for setup instructions.")
    }
  }

  const selectedTool = documentationTools.find(t => t.id === selectedDocTool)
  const { selectProps, buttonProps } = useCompletableInputs({ 
    isCompleted, 
    baseDisabled: !projectName.trim() 
  })

  return (
    <CompletableCard
      title="Documentation"
      description="Create and maintain project documentation"
      emoji={selectedTool?.emoji}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      borderColorClass="border-l-blue-400"
    >
        <div className="space-y-2">
          <label htmlFor="doc-tool-select" className="text-sm font-medium">
            Documentation Tool
          </label>
          <Select value={selectedDocTool} onValueChange={onDocToolChange} {...selectProps}>
            <SelectTrigger id="doc-tool-select" className={selectProps.className}>
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
          {/* MCP Integration Info */}
          {(selectedDocTool === 'github-wiki' || selectedDocTool === 'readme' || selectedDocTool === 'gitlab-wiki' || selectedDocTool === 'notion') && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-xs text-blue-700 font-medium">
                🤖 MCP Integration Available
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {selectedDocTool === 'github-wiki' || selectedDocTool === 'readme' 
                  ? 'Use the official GitHub MCP tool for automated documentation management and AI assistance. '
                  : selectedDocTool === 'gitlab-wiki'
                  ? 'Use the official GitLab MCP tool for automated documentation management and AI assistance. '
                  : 'Use the official Notion MCP tool for AI-powered documentation and content management. '
                }
                <a 
                  href={
                    selectedDocTool === 'github-wiki' || selectedDocTool === 'readme'
                      ? 'https://github.com/modelcontextprotocol/servers/tree/main/src/github'
                      : selectedDocTool === 'gitlab-wiki'
                      ? 'https://github.com/modelcontextprotocol/servers/tree/main/src/gitlab'
                      : 'https://github.com/modelcontextprotocol/servers/tree/main/src/notion'
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
                {...buttonProps}
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
                  {...buttonProps}
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
    </CompletableCard>
  )
}
