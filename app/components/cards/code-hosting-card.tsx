import { CompletableCard } from "~/components/ui/completable-card";
import { Button } from "~/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { ExternalLink } from "lucide-react";
import { useCompletableInputs } from "~/hooks/use-completable-inputs";

import { platforms } from "~/data/platforms";
import { generateADR } from "~/utils/adr-generators";
import { generateVendorComparison } from "~/utils/vendor-utils";

interface CodeHostingCardProps {
  projectName: string;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onCopyToClipboard: (text: string) => void;
  onCreateRepository: () => void;
  isCompleted?: boolean;
  onToggleCompletion?: () => void;
}

export function CodeHostingCard({
  projectName,
  selectedPlatform,
  onPlatformChange,
  onCopyToClipboard,
  onCreateRepository,
  isCompleted = false,
  onToggleCompletion
}: CodeHostingCardProps) {
  const { selectProps, buttonProps } = useCompletableInputs({ 
    isCompleted, 
    baseDisabled: !projectName.trim() 
  });

  return (
    <CompletableCard 
      title="Code Hosting"
      description="Choose development tools considering budget, compliance requirements, and team productivity"
      emoji={platforms.find(p => p.id === selectedPlatform)?.emoji || "🔧"}
      isCompleted={isCompleted}
      onToggleCompletion={onToggleCompletion}
      borderColorClass="border-l-green-400"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="platform-select" className="text-sm font-medium">
            Platform
          </label>
          <Select value={selectedPlatform} onValueChange={onPlatformChange} {...selectProps}>
            <SelectTrigger id="platform-select" className={selectProps.className}>
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
            onClick={onCreateRepository}
            {...buttonProps}
          >
            <span>{platforms.find(p => p.id === selectedPlatform)?.emoji}</span>
            <span>Create Repository</span>
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
                onClick={() => onCopyToClipboard(generateADR(projectName, selectedPlatform, platforms))}
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
                onClick={() => onCopyToClipboard(generateVendorComparison(projectName, selectedPlatform, platforms))}
              >
                Copy Vendor Row
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Vendor assessment template for finance approvals and procurement processes
            </p>
          </div>
        )}
      </div>
    </CompletableCard>
  );
}
