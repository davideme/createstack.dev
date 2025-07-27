import type { VendorDetails, DocumentationTool } from "~/types/project";

export const getDocumentationVendorDetails = (toolId: string): VendorDetails => {
  const details = {
    gitbook: {
      vendorName: "GitBook",
      company: "GitBook SAS",
      productService: "Modern documentation platform with Git integration",
      pricingModel: "Freemium: Free tier (personal), Plus ($5/editor/month), Pro ($12.50/editor/month), Enterprise (custom)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise custom agreements, 14-day free trial",
      supportSLA: "Email support for paid plans, Priority support for Enterprise",
      compliance: "GDPR compliant, SOC 2 Type II certified",
      dataResidency: "Primary: United States, European Union options available",
      businessStability: "Well-funded startup, Growing user base, Established market presence",
      marketPosition: "Strong in developer documentation space, Modern UI focus",
      integrationCapability: "Git sync, REST API, Webhooks, Third-party integrations",
      scalability: "Cloud-native scaling, CDN distribution, Performance optimized",
      securityCertifications: "SOC 2 Type II, Regular security assessments",
      references: "Stripe, Algolia, Linear (public documentation examples)"
    },
    notion: {
      vendorName: "Notion",
      company: "Notion Labs Inc.",
      productService: "All-in-one workspace for notes, docs, and collaboration",
      pricingModel: "Freemium: Free (personal), Plus ($8/user/month), Business ($15/user/month), Enterprise ($25/user/month)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise agreements, Free trial available",
      supportSLA: "Email support for paid plans, Priority for Business/Enterprise",
      compliance: "SOC 2 Type II, GDPR, CCPA compliant",
      dataResidency: "United States, European Union options",
      businessStability: "Unicorn startup ($10B+ valuation), Rapidly growing user base",
      marketPosition: "Leader in productivity/collaboration space, Strong brand recognition",
      integrationCapability: "Public API, Extensive third-party integrations, Embedding capabilities",
      scalability: "Cloud infrastructure, Real-time collaboration at scale",
      securityCertifications: "SOC 2 Type II, ISO 27001 in progress",
      references: "Pixar, McDonald's, Netflix (publicly disclosed customers)"
    },
    confluence: {
      vendorName: "Confluence",
      company: "Atlassian Corporation",
      productService: "Team workspace and knowledge management platform",
      pricingModel: "Standard ($5/user/month), Premium ($10/user/month), Enterprise (custom), Data Center (perpetual)",
      contractTerms: "Monthly/Annual subscriptions, Data Center licensing, Enterprise agreements",
      supportSLA: "24/7 for Premium+, Business hours for Standard, SLA guarantees for Enterprise",
      compliance: "SOC 2, ISO 27001, FedRAMP, GDPR, HIPAA-eligible",
      dataResidency: "Multiple global regions, Data Center for on-premises",
      businessStability: "Public company (NASDAQ: TEAM), Stable revenue, 250,000+ customers",
      marketPosition: "Market leader in enterprise collaboration, Strong ecosystem",
      integrationCapability: "REST API, Atlassian Marketplace, Deep Jira integration",
      scalability: "Enterprise-grade, Data Center scaling, Performance monitoring",
      securityCertifications: "SOC 2 Type II, ISO 27001, FedRAMP ATO",
      references: "NASA, Spotify, Visa (case studies available)"
    },
    readme: {
      vendorName: "ReadMe",
      company: "ReadMe Inc.",
      productService: "Developer documentation platform with API reference tools",
      pricingModel: "Free tier, Team ($99/month), Business ($399/month), Enterprise (custom)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise agreements",
      supportSLA: "Email support, Priority support for paid plans",
      compliance: "SOC 2 compliant, GDPR compliant",
      dataResidency: "United States, European options available",
      businessStability: "Growing SaaS company, Developer-focused",
      marketPosition: "Strong in API documentation space",
      integrationCapability: "API sync, OpenAPI integration, Developer tools",
      scalability: "Cloud-based, CDN distribution",
      securityCertifications: "SOC 2, Regular security reviews",
      references: "Developer-focused companies, API providers"
    },
    docusaurus: {
      vendorName: "Meta (Facebook)",
      company: "Meta Platforms Inc.",
      productService: "Open source static site generator for documentation",
      pricingModel: "Free (open source)",
      contractTerms: "MIT License",
      supportSLA: "Community support",
      compliance: "Depends on deployment",
      dataResidency: "Self-hosted, full control",
      businessStability: "Backed by Meta, strong community",
      marketPosition: "Popular open source documentation tool",
      integrationCapability: "React-based, extensive plugin ecosystem",
      scalability: "Static site generation, CDN-friendly",
      securityCertifications: "Depends on deployment",
      references: "Meta, Jest, Prettier, React Native"
    }
  };
  
  return details[toolId as keyof typeof details] || {
    vendorName: "Unknown Vendor",
    company: "Not specified",
    productService: "Documentation platform",
    pricingModel: "Contact vendor for pricing",
    contractTerms: "Standard subscription terms",
    supportSLA: "Standard support",
    compliance: "Standard compliance",
    dataResidency: "Contact vendor",
    businessStability: "Established vendor",
    marketPosition: "Market participant",
    integrationCapability: "Standard integrations",
    scalability: "Standard scaling",
    securityCertifications: "Standard security",
    references: "Contact vendor for references"
  };
};

export const generateDocumentationVendorComparison = (
  projectName: string,
  selectedDocTool: string,
  documentationTools: DocumentationTool[]
): string => {
  const repoName = projectName.trim() || "my-project";
  const tool = documentationTools.find(t => t.id === selectedDocTool);
  const currentDate = new Date().toISOString().split('T')[0];
  
  if (!tool) {
    return `Tool ${selectedDocTool} not found in documentation tools list.`;
  }
  
  const vendorDetails = getDocumentationVendorDetails(selectedDocTool);
  
  return `Project: ${projectName}
Tool Category: Documentation Platform
Selected Tool: ${tool.name}

Vendor Assessment:
• Vendor: ${vendorDetails.vendorName}
• Company: ${vendorDetails.company}
• Product/Service: ${vendorDetails.productService}
• Pricing Model: ${vendorDetails.pricingModel}
• Contract Terms: ${vendorDetails.contractTerms}
• Support SLA: ${vendorDetails.supportSLA}
• Compliance: ${vendorDetails.compliance}
• Data Residency: ${vendorDetails.dataResidency}
• Business Stability: ${vendorDetails.businessStability}
• Market Position: ${vendorDetails.marketPosition}
• Integration Capability: ${vendorDetails.integrationCapability}
• Scalability: ${vendorDetails.scalability}
• Security Certifications: ${vendorDetails.securityCertifications}
• References: ${vendorDetails.references}

Best For: ${tool.bestFor}
Date: ${currentDate}`;
};
