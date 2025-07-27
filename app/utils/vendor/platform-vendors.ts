import type { VendorDetails } from "~/types/project";

export const getVendorDetails = (platformId: string): VendorDetails => {
  const details = {
    github: {
      vendorName: "GitHub",
      company: "Microsoft Corporation",
      productService: "Cloud-based code repository and development platform",
      pricingModel: "Freemium: Free tier available, Pro ($4/user/month), Team ($4/user/month), Enterprise ($21/user/month)",
      contractTerms: "Monthly/Annual subscriptions, Enterprise custom agreements, 30-day free trial",
      supportSLA: "24/7 for Enterprise, Business hours for Pro/Team, Community for Free",
      compliance: "SOC 2, ISO 27001, PCI DSS, GDPR, Privacy Shield",
      dataResidency: "Primary: United States, Available: European Union",
      businessStability: "Acquired by Microsoft (2018), Stable revenue, 100M+ users",
      marketPosition: "Market leader in code hosting, Strong developer mindshare",
      integrationCapability: "Extensive API, 10,000+ marketplace integrations, Webhooks",
      scalability: "Handles enterprise scale, Unlimited repositories, Auto-scaling infrastructure",
      securityCertifications: "SOC 2 Type II, ISO 27001, Regular security audits",
      references: "Microsoft, Netflix, Spotify, Shopify (public case studies available)"
    },
    gitlab: {
      vendorName: "GitLab",
      company: "GitLab Inc.",
      productService: "Complete DevOps platform with source code management",
      pricingModel: "Freemium: Free tier available, Premium ($19/user/month), Ultimate ($99/user/month)",
      contractTerms: "Monthly/Annual subscriptions, Custom enterprise terms, Self-hosted licensing",
      supportSLA: "24/7 for Ultimate, Business hours for Premium, Community for Free",
      compliance: "SOC 2, ISO 27001, FedRAMP, GDPR, Cloud Security Alliance STAR",
      dataResidency: "Multiple global regions, Self-hosted deployment option",
      businessStability: "Public company (NASDAQ: GTLB), Growing revenue, 30M+ users",
      marketPosition: "Strong competitor in DevOps space, Enterprise focus",
      integrationCapability: "REST/GraphQL APIs, Built-in DevOps tools, Third-party integrations",
      scalability: "Enterprise-grade scaling, Self-hosted options, Performance monitoring",
      securityCertifications: "SOC 2 Type II, ISO 27001, FedRAMP ATO",
      references: "CERN, Goldman Sachs, Ticketmaster (case studies available)"
    },
    bitbucket: {
      vendorName: "Bitbucket",
      company: "Atlassian Corporation",
      productService: "Code repository with integrated CI/CD and project management",
      pricingModel: "Freemium: Free (5 users), Standard ($3/user/month), Premium ($6/user/month)",
      contractTerms: "Monthly/Annual subscriptions, Data Center perpetual licensing",
      supportSLA: "24/7 for Premium, Business hours for Standard, Community for Free",
      compliance: "SOC 2, ISO 27001, GDPR, Privacy Shield",
      dataResidency: "United States, European Union, Australia",
      businessStability: "Part of Atlassian (NASDAQ: TEAM), Stable revenue, 10M+ users",
      marketPosition: "Strong in enterprise with Atlassian ecosystem integration",
      integrationCapability: "REST API, Native Atlassian suite integration, Marketplace apps",
      scalability: "Enterprise scaling with Data Center, Performance monitoring",
      securityCertifications: "SOC 2 Type II, ISO 27001, Regular assessments",
      references: "NASA, Mercedes-Benz, Visa (Atlassian customer references)"
    },
    azure: {
      vendorName: "Azure DevOps",
      company: "Microsoft Corporation",
      productService: "Cloud development services including source control and CI/CD",
      pricingModel: "Freemium: Basic (Free), Basic + Test Plans ($52/user/month), Visual Studio subscriptions",
      contractTerms: "Monthly/Annual, Enterprise agreements, Government contracts available",
      supportSLA: "24/7 for paid plans, Enterprise support available, Community for Basic",
      compliance: "SOC 1/2/3, ISO 27001/27017/27018, FedRAMP High, HIPAA, GDPR",
      dataResidency: "Global Azure regions, Government cloud options",
      businessStability: "Microsoft Corporation, Fortune 500, Extensive cloud revenue",
      marketPosition: "Strong in enterprise Microsoft environments, Growing cloud market",
      integrationCapability: "Azure ecosystem native, REST APIs, Visual Studio integration",
      scalability: "Global Azure infrastructure, Auto-scaling, Enterprise SLAs",
      securityCertifications: "90+ compliance offerings, Continuous security monitoring",
      references: "Progressive Insurance, H&R Block, GE Healthcare"
    },
    codecommit: {
      vendorName: "AWS CodeCommit",
      company: "Amazon Web Services",
      productService: "Managed Git repository service",
      pricingModel: "Pay-per-use: Free tier (5 users), $1/active user/month beyond free tier",
      contractTerms: "Pay-as-you-go, Enterprise discount programs, Government agreements",
      supportSLA: "Varies by AWS Support plan (Basic to Enterprise)",
      compliance: "SOC 1/2/3, PCI DSS, ISO 27001, FedRAMP, HIPAA eligible, GDPR",
      dataResidency: "All AWS regions globally, Government cloud available",
      businessStability: "Amazon.com Inc., Fortune 500, Leading cloud provider",
      marketPosition: "Part of largest cloud platform, Strong enterprise adoption",
      integrationCapability: "Native AWS services integration, SDK/CLI, REST API",
      scalability: "AWS global infrastructure, Auto-scaling, Enterprise support",
      securityCertifications: "Comprehensive AWS compliance framework, Regular audits",
      references: "Netflix, Airbnb, Samsung (AWS customer case studies)"
    },
    sourcehut: {
      vendorName: "SourceHut",
      company: "SourceHut",
      productService: "Minimalist software development platform",
      pricingModel: "Free software model, $2-$20/month tiers, Pay-what-you-want",
      contractTerms: "Simple subscription, Open source software, Transparent pricing",
      supportSLA: "Community-driven support, Simple issue tracker",
      compliance: "Simple compliance model, Open source transparency",
      dataResidency: "Self-hosted option available, Minimal data collection",
      businessStability: "Indie project, Sustainable funding model, Growing community",
      marketPosition: "Alternative for developers seeking simplicity",
      integrationCapability: "Git standard protocols, Email-based workflows, APIs",
      scalability: "Lightweight design, Efficient resource usage",
      securityCertifications: "Security through simplicity, Open source auditability",
      references: "Open source developers, Privacy-focused projects"
    }
  };

  return details[platformId as keyof typeof details] || {
    vendorName: "Unknown Platform",
    company: "Unknown",
    productService: "Code repository platform",
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

export const getComplianceDetails = (platformId: string): string => {
  const complianceDetails = {
    github: `• SOC 2 Type II certified
• ISO 27001:2013 certified
• PCI DSS Level 1 compliant
• GDPR compliant with EU data residency options
• Privacy Shield certified (legacy)
• Regular third-party security audits
• Penetration testing and vulnerability assessments
• Bug bounty program for continuous security improvement`,
    gitlab: `• SOC 2 Type II certified
• ISO 27001:2013 certified
• Cloud Security Alliance STAR certified
• FedRAMP ATO (Authority to Operate)
• GDPR compliant with global data residency
• Regular compliance audits and assessments
• Security-first development practices
• Enterprise-grade security controls`,
    bitbucket: `• SOC 2 Type II certified
• ISO 27001:2013 certified
• GDPR compliant with data protection
• Privacy Shield certified
• Data residency: US, EU, Australia
• Atlassian Trust Center for compliance documentation
• Regular security assessments and penetration testing
• Compliance integration with other Atlassian tools`,
    azure: `• SOC 1/2/3 certified
• ISO 27001, 27017, 27018 certified
• FedRAMP High authorization
• HIPAA/HITECH compliant (with BAA)
• GDPR compliant with EU data residency
• Government cloud options (Azure Government)
• Extensive compliance portfolio (90+ certifications)
• Built-in compliance tools and reporting`,
    codecommit: `• SOC 1/2/3 certified
• ISO 27001, 27017, 27018 certified
• FedRAMP High and Moderate authorized
• PCI DSS Level 1 certified
• HIPAA eligible with BAA
• GDPR compliant with EU regions
• Government cloud (AWS GovCloud)
• Comprehensive AWS compliance framework`,
    sourcehut: `• Open source transparency
• Minimal data collection policies
• Simple privacy model
• Self-hosting options for full control
• Community-driven security reviews
• No tracking or analytics by default
• Transparent infrastructure and operations
• Focus on user privacy and data ownership`
  };

  return complianceDetails[platformId as keyof typeof complianceDetails] || 
    "Compliance details not available. Please check vendor documentation.";
};

export const generateVendorComparison = (
  projectName: string,
  platformId: string,
  platforms: any[]
): string => {
  const platform = platforms.find(p => p.id === platformId);
  const vendor = getVendorDetails(platformId);
  
  if (!platform || !vendor) {
    return "Platform or vendor details not found.";
  }

  return `Project: ${projectName}
Tool Category: Code Repository Platform
Selected Tool: ${platform.name}

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

Best For: ${platform.bestFor}`;
};
