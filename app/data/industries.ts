export interface Industry {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const industries: Industry[] = [
  {
    id: "none",
    name: "No Industry / Skip",
    emoji: "⏭️",
    description: "Skip industry selection - get general recommendations"
  },
  {
    id: "fintech",
    name: "Fintech",
    emoji: "💰",
    description: "Financial technology, banking, payments, and financial services"
  },
  {
    id: "hr-talent",
    name: "HR & Talent",
    emoji: "👥",
    description: "Human resources, talent management, and workforce solutions"
  },
  {
    id: "sales-productivity",
    name: "Sales & Productivity",
    emoji: "📈",
    description: "Sales automation, CRM, and productivity tools"
  },
  {
    id: "ai-developer-tools",
    name: "AI & Developer Tools",
    emoji: "🤖",
    description: "Artificial intelligence, machine learning, and developer tooling"
  },
  {
    id: "healthcare-biotech",
    name: "Healthcare & Biotech",
    emoji: "🏥",
    description: "Healthcare technology, medical devices, and biotechnology"
  },
  {
    id: "consumer-lifestyle",
    name: "Consumer & Lifestyle",
    emoji: "🛍️",
    description: "Consumer products, lifestyle apps, and retail technology"
  },
  {
    id: "enterprise-ai-saas",
    name: "Enterprise AI & SaaS Solutions",
    emoji: "🏢",
    description: "Enterprise software, AI solutions, and business SaaS platforms"
  }
];

export function getIndustryById(industryId: string): Industry | undefined {
  return industries.find(industry => industry.id === industryId);
}
