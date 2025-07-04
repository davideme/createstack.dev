export interface Platform {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  url: string;
}

export interface DependencyTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  platform: string;
  bestFor: string;
  pricing: string;
  features: string[];
}

export interface VendorDetails {
  vendorName: string;
  company: string;
  productService: string;
  pricingModel: string;
  contractTerms: string;
  supportSLA: string;
  compliance: string;
  dataResidency: string;
  businessStability: string;
  marketPosition: string;
  integrationCapability: string;
  scalability: string;
  securityCertifications: string;
  references: string;
}

export interface DocumentationTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  platform: string;
  bestFor: string;
  pricing: string;
  features: string[];
  url: string;
}
