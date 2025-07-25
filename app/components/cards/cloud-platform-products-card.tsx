import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { ExternalLink, Star } from "lucide-react"
import { useState, useMemo } from "react"
import type { CloudPlatformProduct } from "~/types/project"
import { getArchitecture } from "~/data/project-types"
import { getCloudPlatformProductsBySubcategory } from "~/data/cloud-platforms"

interface CloudPlatformProductsCardProps {
  platformName: string;
  platformEmoji: string;
  platformId: string;
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

const subcategoryDisplayNames: Record<string, string> = {
  "virtual-machines": "Virtual Machines",
  "web-apps": "Web Applications",
  "serverless-containers": "Serverless Containers",
  "functions": "Functions",
  "relational": "Relational Databases",
  "nosql": "NoSQL Databases",
  "object-storage": "Object Storage",
  "orchestration": "Container Orchestration",
  "containers": "Container Services",
  "api-management": "API Management",
  "data-warehouse": "Data Warehouse",
  "other": "Other"
}

export function CloudPlatformProductsCard({ 
  platformName, 
  platformEmoji, 
  platformId,
  architecture,
  projectType = ""
}: CloudPlatformProductsCardProps) {
  // Get products grouped by category and subcategory
  const productsBySubcategory = useMemo(() => 
    getCloudPlatformProductsBySubcategory(platformId, architecture), 
    [platformId, architecture]
  );

  // State to track selected products for each subcategory
  const [selectedProducts, setSelectedProducts] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    Object.entries(productsBySubcategory).forEach(([category, subcategories]) => {
      Object.entries(subcategories).forEach(([subcategory, products]) => {
        const key = `${category}-${subcategory}`;
        // Default to the most popular (first) product
        if (products.length > 0) {
          initial[key] = products[0].id;
        }
      });
    });
    return initial;
  });

  const categoryKeys = Object.keys(productsBySubcategory) as Array<keyof typeof categoryDisplayNames>;
  
  if (categoryKeys.length === 0) {
    return null;
  }

  // Get architecture name for better display
  const architectureInfo = projectType && architecture ? 
    getArchitecture(projectType, architecture) : null;
  const architectureName = architectureInfo?.name || architecture;

  const handleProductSelection = (categorySubcategory: string, productId: string) => {
    setSelectedProducts(prev => ({
      ...prev,
      [categorySubcategory]: productId
    }));
  };

  const getSelectedProduct = (category: string, subcategory: string, products: CloudPlatformProduct[]): CloudPlatformProduct => {
    const key = `${category}-${subcategory}`;
    const selectedId = selectedProducts[key];
    return products.find(p => p.id === selectedId) || products[0];
  };

  return (
    <Card className="border-l-4 border-l-pink-400">
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
          <div key={category} className="space-y-4">
            <h4 className="text-sm font-semibold text-muted-foreground">
              {categoryDisplayNames[category]}
            </h4>
            
            {Object.entries(productsBySubcategory[category]).map(([subcategory, products]) => {
              const hasMultipleOptions = products.length > 1;
              const selectedProduct = getSelectedProduct(category, subcategory, products);
              const key = `${category}-${subcategory}`;
              
              return (
                <div key={subcategory} className="space-y-3">
                  {/* Subcategory header with selection dropdown if multiple options */}
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-muted-foreground">
                      {subcategoryDisplayNames[subcategory] || subcategory}
                    </h5>
                    {hasMultipleOptions && (
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Choose:</span>
                        <Select
                          value={selectedProducts[key]}
                          onValueChange={(value) => handleProductSelection(key, value)}
                        >
                          <SelectTrigger className="w-48 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                <div className="flex items-center space-x-2">
                                  <span>{product.emoji}</span>
                                  <span>{product.name}</span>
                                  {product.popularityRank === 1 && (
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                  
                  {/* Selected product details */}
                  <div className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{selectedProduct.emoji}</span>
                        <h6 className="font-medium flex items-center space-x-1">
                          <span>{selectedProduct.name}</span>
                          {selectedProduct.popularityRank === 1 && (
                            <span title="Most Popular">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </span>
                          )}
                        </h6>
                      </div>
                      {selectedProduct.url && (
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => window.open(selectedProduct.url, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {selectedProduct.description}
                    </p>
                    
                    <div className="space-y-2">
                      <p className="text-xs">
                        <strong>Best for:</strong> {selectedProduct.bestFor}
                      </p>
                      <p className="text-xs">
                        <strong>Pricing:</strong> {selectedProduct.pricing}
                      </p>
                    </div>
                    
                    {selectedProduct.features.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-1">Key Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedProduct.features.slice(0, 4).map((feature, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs px-2 py-0"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {selectedProduct.features.length > 4 && (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              +{selectedProduct.features.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {selectedProduct.supportedArchitectures.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium mb-1">Supported Architectures:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedProduct.supportedArchitectures.slice(0, 3).map((arch, index) => (
                            <Badge 
                              key={index} 
                              variant={arch === architecture ? "default" : "outline"}
                              className="text-xs px-2 py-0"
                            >
                              {arch}
                            </Badge>
                          ))}
                          {selectedProduct.supportedArchitectures.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0">
                              +{selectedProduct.supportedArchitectures.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Show alternative options count */}
                    {hasMultipleOptions && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-blue-600">
                          💡 {products.length - 1} alternative option{products.length > 2 ? 's' : ''} available - use the dropdown above to compare
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
