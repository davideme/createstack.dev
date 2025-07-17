import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { Architecture, ArchitectureService } from "~/data/project-types";
import type { CloudPlatformProduct } from "~/types/project";
import { getServiceProductMapping } from "~/data/service-product-mappings";
import { getCloudPlatformProducts } from "~/data/cloud-platforms";
import { useState } from "react";

interface ArchitectureServicesCardProps {
  architecture: Architecture;
  cloudPlatform: 'aws' | 'azure' | 'gcp';
  onServiceSelectionChange?: (selections: Record<string, string>) => void;
}

export function ArchitectureServicesCard({ 
  architecture, 
  cloudPlatform, 
  onServiceSelectionChange 
}: ArchitectureServicesCardProps) {
  const [serviceSelections, setServiceSelections] = useState<Record<string, string>>({});
  
  // Get all products for the cloud platform as a flat array
  const cloudProductsGrouped = getCloudPlatformProducts(cloudPlatform);
  const cloudProducts: CloudPlatformProduct[] = Object.values(cloudProductsGrouped).flat();

  const handleServiceSelection = (serviceName: string, productId: string) => {
    const newSelections = { ...serviceSelections, [serviceName]: productId };
    setServiceSelections(newSelections);
    onServiceSelectionChange?.(newSelections);
  };

  const getServiceProduct = (service: ArchitectureService) => {
    const mapping = getServiceProductMapping(service.name, service.category, cloudPlatform);
    if (!mapping) return null;
    
    if (!mapping.isDirectEquivalent) {
      return {
        isDirectEquivalent: false,
        notes: mapping.notes || 'No direct cloud equivalent available'
      };
    }

    const product = cloudProducts.find((p: CloudPlatformProduct) => p.id === mapping.productId);
    return {
      isDirectEquivalent: true,
      product,
      mapping
    };
  };

  const requiredServices = architecture.services.filter(s => s.required);
  const optionalServices = architecture.services.filter(s => !s.required);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏗️ Architecture Services
          <Badge variant="outline" className="ml-auto">
            {architecture.name}
          </Badge>
        </CardTitle>
        <CardDescription>
          Infrastructure components needed for this architecture pattern
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Required Services */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Required Services ({requiredServices.length})
          </h4>
          <div className="space-y-3">
            {requiredServices.map((service) => {
              const serviceProduct = getServiceProduct(service);
              
              return (
                <div key={service.name} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm">{service.name}</h5>
                        <Badge variant="secondary" className="text-xs">
                          {service.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  
                  {serviceProduct?.isDirectEquivalent && serviceProduct.product ? (
                    <div className="pt-2">
                      <Select 
                        value={serviceSelections[service.name] || serviceProduct.product.id}
                        onValueChange={(value) => handleServiceSelection(service.name, value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={serviceProduct.product.id}>
                            <div className="flex items-center gap-2">
                              <span>{serviceProduct.product.emoji}</span>
                              <span>{serviceProduct.product.name}</span>
                              {serviceProduct.product.popularityRank === 1 && (
                                <span className="text-yellow-500">⭐</span>
                              )}
                            </div>
                          </SelectItem>
                          {/* Show alternative products of the same subcategory */}
                          {cloudProducts
                            .filter((p: CloudPlatformProduct) => 
                              p.id !== serviceProduct.product!.id && 
                              p.subcategory === serviceProduct.product!.subcategory
                            )
                            .sort((a: CloudPlatformProduct, b: CloudPlatformProduct) => (a.popularityRank || 999) - (b.popularityRank || 999))
                            .slice(0, 3) // Limit to 3 alternatives
                            .map((product: CloudPlatformProduct) => (
                              <SelectItem key={product.id} value={product.id}>
                                <div className="flex items-center gap-2">
                                  <span>{product.emoji}</span>
                                  <span>{product.name}</span>
                                  {product.popularityRank === 1 && (
                                    <span className="text-yellow-500">⭐</span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {serviceProduct.product && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {serviceProduct.product.description}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                        <span>⚠️</span>
                        <span>Custom implementation required</span>
                      </div>
                      {serviceProduct?.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {serviceProduct.notes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Services */}
        {optionalServices.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Optional Services ({optionalServices.length})
            </h4>
            <div className="space-y-3">
              {optionalServices.map((service) => {
                const serviceProduct = getServiceProduct(service);
                
                return (
                  <div key={service.name} className="border rounded-lg p-3 space-y-2 opacity-75">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm">{service.name}</h5>
                          <Badge variant="outline" className="text-xs">
                            {service.category}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{service.description}</p>
                      </div>
                    </div>
                    
                    {serviceProduct?.isDirectEquivalent && serviceProduct.product ? (
                      <div className="pt-2">
                        <Select 
                          value={serviceSelections[service.name] || ''}
                          onValueChange={(value) => handleServiceSelection(service.name, value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select service (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">
                              <span className="text-muted-foreground">Skip this service</span>
                            </SelectItem>
                            <SelectItem value={serviceProduct.product.id}>
                              <div className="flex items-center gap-2">
                                <span>{serviceProduct.product.emoji}</span>
                                <span>{serviceProduct.product.name}</span>
                                {serviceProduct.product.popularityRank === 1 && (
                                  <span className="text-yellow-500">⭐</span>
                                )}
                              </div>
                            </SelectItem>
                            {/* Show alternative products of the same subcategory */}
                            {cloudProducts
                              .filter((p: CloudPlatformProduct) => 
                                p.id !== serviceProduct.product!.id && 
                                p.subcategory === serviceProduct.product!.subcategory
                              )
                              .sort((a: CloudPlatformProduct, b: CloudPlatformProduct) => (a.popularityRank || 999) - (b.popularityRank || 999))
                              .slice(0, 3)
                              .map((product: CloudPlatformProduct) => (
                                <SelectItem key={product.id} value={product.id}>
                                  <div className="flex items-center gap-2">
                                    <span>{product.emoji}</span>
                                    <span>{product.name}</span>
                                    {product.popularityRank === 1 && (
                                      <span className="text-yellow-500">⭐</span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {serviceSelections[service.name] && serviceProduct.product && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {serviceProduct.product.description}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2">
                        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                          <span>⚠️</span>
                          <span>Custom implementation required</span>
                        </div>
                        {serviceProduct?.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {serviceProduct.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
