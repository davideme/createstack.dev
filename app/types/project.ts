export interface Platform {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  url: string;
}

export interface TeamPersona {
  id: string;
  name: string;
  emoji: string;
  description: string;
  primaryFocus: string;
  commonTools: string[];
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
  targetPersonas: string[]; // Array of persona IDs
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
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
  targetPersonas: string[]; // Array of persona IDs
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface CICDTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  platform: string;
  bestFor: string;
  pricing: string;
  features: string[];
  targetPersonas: string[]; // Array of persona IDs
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface IssueTrackingTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  platform: string;
  bestFor: string;
  pricing: string;
  features: string[];
  url: string;
  targetPersonas: string[]; // Array of persona IDs
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface CloudPlatformProduct {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  supportedArchitectures: string[];
  category: 'compute' | 'database' | 'storage' | 'networking' | 'ai-ml' | 'analytics' | 'serverless' | 'container' | 'messaging' | 'security';
  pricing: string;
  features: string[];
  url?: string;
}

export interface CloudPlatform {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bestFor: string;
  pricing: string;
  features: string[];
  url: string;
  targetPersonas: string[]; // Array of persona IDs
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
  supportedArchitectures: string[]; // Array of architecture IDs
  iacSupport: string[]; // Array of IaC tool IDs
  regions: string[];
  complianceCertifications: string[];
  products?: CloudPlatformProduct[]; // Optional products for platforms with multiple services
}

export interface FeatureFlagTool {
  id: string;
  name: string;
  emoji: string;
  description: string;
  platform: string;
  bestFor: string;
  pricing: string;
  features: string[];
  url: string;
  targetPersonas: string[]; // Array of persona IDs
  complexityLevel: 'beginner' | 'intermediate' | 'advanced';
}
