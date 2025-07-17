import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { ExternalLink } from "lucide-react"
import type { CloudPlatformProduct } from "~/types/project"
import { getArchitecture } from "~/data/project-types"

interface CloudPlatformProductsCardProps {
  platformName: string;
  platformEmoji: string;
  products: Record<string, CloudPlatformProduct[]>;
  architecture?: string;
  projectType?: string;
}

const categoryDisplayNames = {
  compute: "💻 Compute",
  database: "🗃️ Database", 
  storage: "📦 Storage",
  networking: "🌐 Networking",
  "ai-ml": "🤖 AI/ML",
  analytics: "📊 Analytics",
  serverless: "⚡ Serverless",
  container: "🐳 Container",
  messaging: "📨 Messaging",
  security: "🔒 Security"
}

export function CloudPlatformProductsCard({ 
  platformName, 
  platformEmoji, 
  products, 
  architecture,
  projectType = ""
}: CloudPlatformProductsCardProps) {
  const categoryKeys = Object.keys(products) as Array<keyof typeof categoryDisplayNames>;
  
  if (categoryKeys.length === 0) {
    return null;
  }

  // Get architecture name for better display
  const architectureInfo = projectType && architecture ? 
    getArchitecture(projectType, architecture) : null;
  const architectureName = architectureInfo?.name || architecture;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span className="text-xl">{platformEmoji}</span>
          <span>{platformName} Services</span>
        </CardTitle>
        <CardDescription>
          Recommended {platformName} services for your {architectureName ? `${architectureName} ` : ''}architecture pattern
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {categoryKeys.map((category) => (
          <div key={category} className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {categoryDisplayNames[category]}
            </h4>
            <div className="grid gap-4">
              {products[category].map((product) => (
                <div 
                  key={product.id} 
                  className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{product.emoji}</span>
                      <h5 className="font-medium">{product.name}</h5>
                    </div>
                    {product.url && (
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(product.url, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {product.description}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs">
                      <strong>Best for:</strong> {product.bestFor}
                    </p>
                    <p className="text-xs">
                      <strong>Pricing:</strong> {product.pricing}
                    </p>
                  </div>
                  
                  {product.features.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium mb-1">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.features.slice(0, 4).map((feature, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs px-2 py-0"
                          >
                            {feature}
                          </Badge>
                        ))}
                        {product.features.length > 4 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{product.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {product.supportedArchitectures.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium mb-1">Supported Architectures:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.supportedArchitectures.slice(0, 3).map((arch, index) => (
                          <Badge 
                            key={index} 
                            variant={arch === architecture ? "default" : "outline"}
                            className="text-xs px-2 py-0"
                          >
                            {arch}
                          </Badge>
                        ))}
                        {product.supportedArchitectures.length > 3 && (
                          <Badge variant="outline" className="text-xs px-2 py-0">
                            +{product.supportedArchitectures.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
