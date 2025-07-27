import { CompletableCard } from "~/components/ui/completable-card"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Badge } from "~/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { getAvailableCloudPlatforms, getCloudPlatformById, hasMultipleProducts, getCloudPlatformProductsBySubcategory } from "~/data/cloud-platforms"
import { generateADR } from "~/utils/adr-generators"
import { generateVendorComparison } from "~/utils/vendor-utils"
import { useCompletableInputs } from "~/hooks/use-completable-inputs"

interface CloudPlatformCardProps {
  projectName: string
  selectedCloudPlatform: string
  selectedArchitecture: string
  selectedPersonas: string[]
  onCloudPlatformChange: (platform: string) => void
  onCopyToClipboard: (text: string) => void
  isCompleted?: boolean
  onToggleCompletion?: () => void
}

export function CloudPlatformCard({
  projectName,
  selectedCloudPlatform,
  selectedArchitecture,
  selectedPersonas,
  onCloudPlatformChange,
  onCopyToClipboard,
  isCompleted = false,
  onToggleCompletion
}: CloudPlatformCardProps) {
  const availablePlatforms = getAvailableCloudPlatforms(selectedArchitecture, selectedPersonas)
  const selectedPlatform = getCloudPlatformById(selectedCloudPlatform)
  const { selectProps, buttonProps } = useCompletableInputs({ 
    isCompleted, 
    baseDisabled: !projectName.trim() 
  })

  return (
    <CompletableCard 
      title="Cloud Platform"
      description="Choose a cloud platform that supports your architecture and team needs"
      emoji={selectedPlatform?.emoji || '☁️'}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      borderColorClass="border-l-purple-400"
    >
        <div className="space-y-2">
          <label htmlFor="cloud-platform-select" className="text-sm font-medium">
            Platform
          </label>
          <Select {...selectProps} value={selectedCloudPlatform} onValueChange={onCloudPlatformChange}>
            <SelectTrigger id="cloud-platform-select" className={selectProps.className}>
              <SelectValue placeholder="Select a cloud platform" />
            </SelectTrigger>
            <SelectContent>
              {availablePlatforms.map((platform) => (
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

        {selectedPlatform && (
          <>
            {/* Platform Info */}
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
                <span>{selectedPlatform.emoji}</span>
                <span>{selectedPlatform.name}</span>
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {selectedPlatform.description}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Best for:</strong> {selectedPlatform.bestFor}
              </p>
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Pricing:</strong> {selectedPlatform.pricing}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedPlatform.features.slice(0, 4).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {selectedPlatform.features.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{selectedPlatform.features.length - 4} more
                  </Badge>
                )}
              </div>
            </div>

            {/* Architecture Compatibility */}
            {selectedArchitecture && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">
                  ✅ Architecture Compatibility
                </h4>
                <p className="text-xs text-blue-700">
                  This platform supports your selected architecture pattern and provides the necessary services.
                </p>
              </div>
            )}

            {/* Available Services */}
            {hasMultipleProducts(selectedCloudPlatform) && selectedArchitecture && (
              (() => {
                const productsBySubcategory = getCloudPlatformProductsBySubcategory(selectedCloudPlatform, selectedArchitecture);
                const productCount = Object.values(productsBySubcategory).flatMap(subcats => Object.values(subcats)).flat().length;
                const categoryCount = Object.keys(productsBySubcategory).length;
                
                return productCount > 0 ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="text-sm font-medium mb-1">
                      🛠️ Available Services
                    </h4>
                    <p className="text-xs text-amber-700">
                      {productCount} recommended services across {categoryCount} categories are available for your architecture pattern. 
                      See the dedicated services card below for detailed recommendations.
                    </p>
                  </div>
                ) : null;
              })()
            )}

            {/* Infrastructure as Code Support */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-medium mb-1">
                🏗️ Infrastructure as Code Support
              </h4>
              <p className="text-xs text-green-700 mb-2">
                Supported IaC tools:
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedPlatform.iacSupport.map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tool.charAt(0).toUpperCase() + tool.slice(1)}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Persona Alignment */}
            {selectedPersonas.length > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="text-sm font-medium mb-1">
                  👥 Team Alignment
                </h4>
                <p className="text-xs text-purple-700">
                  This platform aligns with your team personas and provides tools relevant to your roles.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                {...buttonProps}
                className="flex items-center space-x-2"
                onClick={() => window.open(selectedPlatform.url, '_blank')}
              >
                <span>{selectedPlatform.emoji}</span>
                <span>Visit Platform</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>

            {/* ADR Section */}
            {projectName.trim() && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📝 Architecture Decision Record</h4>
                  <Button
                    {...buttonProps}
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyToClipboard(generateADR(projectName, selectedCloudPlatform, availablePlatforms))}
                  >
                    Copy ADR
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Document your cloud platform decision for future reference
                </p>
              </div>
            )}

            {/* Vendor Comparison Section */}
            {projectName.trim() && (
              <div className="space-y-2 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
                  <Button
                    {...buttonProps}
                    size="sm"
                    variant="outline"
                    onClick={() => onCopyToClipboard(generateVendorComparison(projectName, selectedCloudPlatform, availablePlatforms))}
                  >
                    Copy Vendor Row
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Vendor assessment template for finance approvals and procurement processes
                </p>
              </div>
            )}
          </>
        )}
    </CompletableCard>
  )
}
