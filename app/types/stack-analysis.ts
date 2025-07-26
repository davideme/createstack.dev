/**
 * Type definitions for Stack Gap Analysis feature
 * Based on FEATURE_RECOMMENDATIONS.md requirements
 */

export interface ExistingStack {
  programming_languages?: string[]
  frameworks?: string[]
  databases?: string[]
  cloud_platforms?: string[]
  ci_cd?: string[]
  monitoring?: string[]
  security?: string[]
  communication?: string[]
  issue_tracking?: string[]
  documentation?: string[]
  dependency_management?: string[]
  feature_flags?: string[]
  testing?: string[]
  containerization?: string[]
  orchestration?: string[]
}

export interface StackCategory {
  id: keyof ExistingStack
  name: string
  description: string
  icon: string
  priority: 'critical' | 'important' | 'nice-to-have'
  required_for_compliance?: string[] // e.g., ['soc2', 'hipaa', 'pci']
}

export interface StackGapRecommendation {
  category: string
  tools: StackTool[]
  priority: 'critical' | 'important' | 'nice-to-have'
  rationale: string
  compliance_impact?: ComplianceImpact
  estimated_cost?: CostEstimate
}

export interface StackGapAnalysis {
  completeness_score: number // 0-100 percentage
  missing_categories: string[]
  recommended_additions: StackGapRecommendation[]
  compliance_gaps?: ComplianceGap[]
  team_size_considerations?: TeamSizeRecommendation[]
  industry_specific_gaps?: IndustryGap[]
}

export interface ComplianceGap {
  framework: 'soc2' | 'hipaa' | 'pci' | 'iso27001' | 'gdpr'
  missing_controls: string[]
  recommended_tools: StackTool[]
  audit_requirements: string[]
  estimated_cost: number
  implementation_timeline: string
}

export interface StackTool {
  id: string
  name: string
  category: string
  description: string
  pricing: string
  features: string[]
  best_for: string
  complexity_level: 'beginner' | 'intermediate' | 'advanced'
  popularity_score: number // 1-10
  compliance_certifications?: string[]
  integration_difficulty: 'easy' | 'medium' | 'hard'
  url?: string
}

export interface ComplianceImpact {
  frameworks_addressed: string[]
  security_improvements: string[]
  audit_benefits: string[]
}

export interface CostEstimate {
  monthly_cost_range: string
  setup_cost: string
  training_time: string
  maintenance_effort: 'low' | 'medium' | 'high'
}

export interface TeamSizeRecommendation {
  team_size_range: string
  specific_needs: string[]
  tooling_complexity_level: 'beginner' | 'intermediate' | 'advanced'
}

export interface IndustryGap {
  industry: string
  specific_requirements: string[]
  compliance_needs: string[]
  recommended_tools: StackTool[]
}

export interface StackAnalysisContext {
  team_size?: number
  industry?: string
  compliance_requirements?: string[]
  budget_range?: 'startup' | 'small' | 'medium' | 'enterprise'
  technical_expertise?: 'beginner' | 'intermediate' | 'advanced'
  priority_focus?: 'speed' | 'security' | 'cost' | 'compliance'
}

export interface StackAnalysisInput {
  existing_stack: ExistingStack
  context: StackAnalysisContext
  project_name?: string
  current_project_stage?: 'planning' | 'development' | 'production' | 'scaling'
}

export interface StackAnalysisResult {
  input: StackAnalysisInput
  analysis: StackGapAnalysis
  generated_at: Date
  recommendations_count: number
  priority_actions: StackGapRecommendation[]
}
