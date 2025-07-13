import { Button } from "~/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { ScrollArea } from "~/components/ui/scroll-area"
import { generateTerraformCode, generatePulumiCode, generateCloudFormationCode, generateCDKCode } from "~/utils/code-generators"
import { platforms } from "~/data/platforms"

interface InfrastructureAsCodeProps {
  projectName: string
  selectedPlatform: string
  defaultIaCTool: string
  onDefaultIaCToolChange: (tool: string) => void
  onCopyToClipboard: (text: string) => void
}

export function InfrastructureAsCode({
  projectName,
  selectedPlatform,
  defaultIaCTool,
  onDefaultIaCToolChange,
  onCopyToClipboard
}: InfrastructureAsCodeProps) {
  return (
    <div className="space-y-4 border-t pt-4">
      <h4 className="text-sm font-medium">Infrastructure as Code Templates</h4>
      
      <Tabs defaultValue={defaultIaCTool} onValueChange={onDefaultIaCToolChange} className="w-full">
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
              onClick={() => onCopyToClipboard(generateTerraformCode(projectName, selectedPlatform))}
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
              onClick={() => onCopyToClipboard(generatePulumiCode(projectName, platforms, selectedPlatform))}
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
              onClick={() => onCopyToClipboard(generateCDKCode(projectName, selectedPlatform, platforms))}
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
              onClick={() => onCopyToClipboard(generateCloudFormationCode(projectName))}
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
  )
}
