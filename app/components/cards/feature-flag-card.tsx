import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink } from "lucide-react"
import { featureFlagTools, getAvailableFeatureFlagTools, getFeatureFlagToolDocumentationUrl, isFeatureFlagToolNativeToPlatform } from "~/data/feature-flag-tools"
import { generateFeatureFlagADR } from "~/utils/adr-generators"
import { generateFeatureFlagVendorComparison } from "~/utils/vendor-utils"
import { platforms } from "~/data/platforms"

interface FeatureFlagCardProps {
  projectName: string
  selectedPlatform: string
  selectedFeatureFlagTool: string
  onFeatureFlagToolChange: (toolId: string) => void
  onCopyToClipboard: (text: string) => void
}

export function FeatureFlagCard({
  projectName,
  selectedPlatform,
  selectedFeatureFlagTool,
  onFeatureFlagToolChange,
  onCopyToClipboard
}: FeatureFlagCardProps) {
  const handleConfigureFeatureFlagTool = () => {
    const url = getFeatureFlagToolDocumentationUrl(selectedFeatureFlagTool)
    if (url !== "#") {
      window.open(url, '_blank')
    } else {
      alert("Custom implementation requires building your own feature flag system. Consider using configuration files, database flags, or environment variables.")
    }
  }

  const selectedTool = featureFlagTools.find(t => t.id === selectedFeatureFlagTool)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-xl">{selectedTool?.emoji}</span>
          <span>Feature Flags</span>
        </CardTitle>
        <CardDescription>
          Manage feature rollouts, A/B testing, and experimentation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="feature-flag-tool-select" className="text-sm font-medium">
            Feature Flag Tool
          </label>
          <Select value={selectedFeatureFlagTool} onValueChange={onFeatureFlagToolChange}>
            <SelectTrigger id="feature-flag-tool-select">
              <SelectValue placeholder="Select a feature flag tool" />
            </SelectTrigger>
            <SelectContent>
              {getAvailableFeatureFlagTools(selectedPlatform).map((tool) => (
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
          <p className="text-xs text-muted-foreground">
            <strong>Pricing:</strong> {selectedTool?.pricing}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="flex items-center space-x-2"
            disabled={!projectName.trim()}
            onClick={handleConfigureFeatureFlagTool}
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
                onClick={() => onCopyToClipboard(generateFeatureFlagADR(projectName, selectedFeatureFlagTool, featureFlagTools))}
              >
                Copy ADR
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Document your feature flag tool decision for future reference
            </p>
          </div>
        )}

        {/* Vendor Entry Section */}
        {projectName.trim() && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
              {!isFeatureFlagToolNativeToPlatform(selectedPlatform, selectedFeatureFlagTool) && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopyToClipboard(generateFeatureFlagVendorComparison(projectName, selectedFeatureFlagTool, featureFlagTools))}
                >
                  Copy Vendor Row
                </Button>
              )}
            </div>
            {isFeatureFlagToolNativeToPlatform(selectedPlatform, selectedFeatureFlagTool) ? (
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
