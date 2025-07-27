import type { VendorDetails } from "~/types/project";

export const getDependencyVendorDetails = (toolId: string): VendorDetails => {
  const details = {
    dependabot: {
      vendorName: "Dependabot",
      company: "Microsoft Corporation (GitHub)",
      productService: "Automated Dependency Updates",
      pricingModel: "Free with GitHub",
      contractTerms: "GitHub Terms of Service",
      supportSLA: "Community + GitHub Support",
      compliance: "SOC 2, ISO 27001, GDPR",
      dataResidency: "Global (GitHub infrastructure)",
      businessStability: "High (Microsoft-backed)",
      marketPosition: "Leading (GitHub integration)",
      integrationCapability: "Excellent (native GitHub)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "github.com/dependabot"
    },
    renovate: {
      vendorName: "Renovate",
      company: "Mend.io (formerly WhiteSource)",
      productService: "Universal Dependency Updates",
      pricingModel: "Free (self-hosted) / SaaS plans",
      contractTerms: "OSS license / Commercial terms",
      supportSLA: "Community / Commercial support",
      compliance: "SOC 2, GDPR compliant",
      dataResidency: "Configurable / EU/US options",
      businessStability: "High (Mend.io backing)",
      marketPosition: "Strong (multi-platform)",
      integrationCapability: "Excellent (60+ platforms)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "renovatebot.com"
    },
    snyk: {
      vendorName: "Snyk",
      company: "Snyk Ltd",
      productService: "Security-focused Dependency Scanning",
      pricingModel: "Freemium / Pro from $25/month",
      contractTerms: "Standard SaaS / Enterprise",
      supportSLA: "Tiered support (Free/Pro/Enterprise)",
      compliance: "SOC 2, ISO 27001, GDPR",
      dataResidency: "Multi-region options",
      businessStability: "High (well-funded startup)",
      marketPosition: "Leading (security focus)",
      integrationCapability: "Excellent (CI/CD + IDEs)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "snyk.io"
    },
    whitesource: {
      vendorName: "Mend",
      company: "Mend.io (formerly WhiteSource)",
      productService: "Enterprise Dependency Management",
      pricingModel: "Enterprise pricing (contact sales)",
      contractTerms: "Enterprise license agreements",
      supportSLA: "Enterprise support included",
      compliance: "SOC 2, ISO 27001, GDPR, HIPAA",
      dataResidency: "Multi-region / on-premise",
      businessStability: "High (established enterprise)",
      marketPosition: "Leading (enterprise segment)",
      integrationCapability: "Excellent (200+ languages)",
      scalability: "Enterprise-grade",
      securityCertifications: "SOC 2, ISO 27001, FedRAMP",
      references: "mend.io"
    },
    "gitlab-deps": {
      vendorName: "GitLab Dependency Scanning",
      company: "GitLab Inc",
      productService: "Integrated Dependency Scanning",
      pricingModel: "Free tier / Premium from $19/user",
      contractTerms: "GitLab Terms of Service",
      supportSLA: "Tiered support (Free/Premium/Ultimate)",
      compliance: "SOC 2, ISO 27001, GDPR",
      dataResidency: "Global / GitLab.com or self-hosted",
      businessStability: "High (public company)",
      marketPosition: "Strong (DevOps platform)",
      integrationCapability: "Excellent (GitLab native)",
      scalability: "Excellent",
      securityCertifications: "SOC 2, ISO 27001",
      references: "gitlab.com"
    },
    manual: {
      vendorName: "Manual Process",
      company: "Internal Team",
      productService: "Manual Dependency Management",
      pricingModel: "Developer time costs",
      contractTerms: "Internal process",
      supportSLA: "Internal team capacity",
      compliance: "Depends on internal practices",
      dataResidency: "Internal control",
      businessStability: "Depends on team availability",
      marketPosition: "Traditional approach",
      integrationCapability: "Manual integration required",
      scalability: "Limited by team capacity",
      securityCertifications: "Depends on team practices",
      references: "Internal team experience"
    }
  };

  return details[toolId as keyof typeof details] || {
    vendorName: "Unknown Tool",
    company: "Unknown",
    productService: "Dependency Management",
    pricingModel: "Unknown",
    contractTerms: "Per terms of service",
    supportSLA: "Standard support",
    compliance: "Check vendor documentation",
    dataResidency: "Check vendor documentation",
    businessStability: "Check vendor documentation",
    marketPosition: "Check vendor documentation",
    integrationCapability: "Check vendor documentation",
    scalability: "Check vendor documentation",
    securityCertifications: "Check vendor documentation",
    references: "Check vendor documentation"
  };
};

export const generateDependencyVendorComparison = (
  projectName: string,
  toolId: string,
  dependencyTools: any[]
): string => {
  const tool = dependencyTools.find(t => t.id === toolId);
  const vendor = getDependencyVendorDetails(toolId);
  
  if (!tool || !vendor) {
    return "Tool or vendor details not found.";
  }

  return `Project: ${projectName}
Tool Category: Dependency Management
Selected Tool: ${tool.name}

Vendor Assessment:
• Vendor: ${vendor.vendorName}
• Company: ${vendor.company}
• Product/Service: ${vendor.productService}
• Pricing Model: ${vendor.pricingModel}
• Contract Terms: ${vendor.contractTerms}
• Support SLA: ${vendor.supportSLA}
• Compliance: ${vendor.compliance}
• Data Residency: ${vendor.dataResidency}
• Business Stability: ${vendor.businessStability}
• Market Position: ${vendor.marketPosition}
• Integration Capability: ${vendor.integrationCapability}
• Scalability: ${vendor.scalability}
• Security Certifications: ${vendor.securityCertifications}
• References: ${vendor.references}

Best For: ${tool.bestFor}`;
};
