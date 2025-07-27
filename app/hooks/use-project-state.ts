import { useState, useEffect, useRef } from "react";
import { useDB, useCurrentProject } from "~/lib/db";

interface ProjectState {
  projectName: string;
  selectedPlatform: string;
  selectedProjectType: string;
  selectedArchitecture: string;
  selectedCloudPlatform: string;
  selectedDepTool: string;
  selectedDocTool: string;
  selectedCICDTool: string;
  selectedIssueTrackingTool: string;
  selectedFeatureFlagTool: string;
  selectedPersonas: string[];
  selectedIndustry: string;
  showIaC: boolean;
  defaultIaCTool: string;
  isSaving: boolean;
  completedCards: Record<string, boolean>;
}

interface UseProjectStateOptions {
  mode: 'gap-analysis' | 'stack-builder';
}

export function useProjectState({ mode }: UseProjectStateOptions) {
  // Define default values based on mode
  const getDefaultValue = (buildModeDefault: string, analyzeDefault: string = "") => {
    return mode === 'gap-analysis' ? analyzeDefault : buildModeDefault;
  };

  // State management
  const [projectName, setProjectName] = useState(getDefaultValue("My New Project"))
  const [selectedPlatform, setSelectedPlatform] = useState(getDefaultValue("github"))
  const [selectedProjectType, setSelectedProjectType] = useState(getDefaultValue("web-app"))
  const [selectedArchitecture, setSelectedArchitecture] = useState(getDefaultValue("jamstack"))
  const [selectedCloudPlatform, setSelectedCloudPlatform] = useState(getDefaultValue("aws"))
  const [selectedDepTool, setSelectedDepTool] = useState(getDefaultValue("dependabot"))
  const [selectedDocTool, setSelectedDocTool] = useState(getDefaultValue("readme"))
  const [selectedCICDTool, setSelectedCICDTool] = useState(getDefaultValue("github-actions"))
  const [selectedIssueTrackingTool, setSelectedIssueTrackingTool] = useState(getDefaultValue("github-issues"))
  const [selectedFeatureFlagTool, setSelectedFeatureFlagTool] = useState(getDefaultValue("configcat"))
  const [selectedPersonas, setSelectedPersonas] = useState<string[]>(
    mode === 'gap-analysis' ? [] : ["developer", "product-owner"]
  )
  const [selectedIndustry, setSelectedIndustry] = useState(getDefaultValue("none"))
  const [showIaC, setShowIaC] = useState(false)
  const [defaultIaCTool, setDefaultIaCTool] = useState("terraform")
  const [isSaving, setIsSaving] = useState(false)

  // Card completion state
  const [completedCards, setCompletedCards] = useState<Record<string, boolean>>({
    'code-hosting': false,
    'dependency-management': false,
    'documentation': false,
    'cicd': false,
    'issue-tracking': false,
    'feature-flags': false,
    'cloud-platform': false,
    'architecture-services': false
  })

  // Toggle card completion status
  const toggleCardCompletion = (cardId: string) => {
    setCompletedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  // Track if we're loading data from database to prevent auto-save loops
  const isLoadingFromDB = useRef(false)
  const { isReady, error } = useDB()
  const { currentProject, saveCurrentProject, clearCurrentProject } = useCurrentProject()

  // Load UI preferences from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedShowIaC = localStorage.getItem('createstack-showIaC')
      if (savedShowIaC) {
        setShowIaC(JSON.parse(savedShowIaC))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDefaultIaCTool = localStorage.getItem('createstack-defaultIaCTool')
      if (savedDefaultIaCTool) {
        setDefaultIaCTool(JSON.parse(savedDefaultIaCTool))
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('createstack-showIaC', JSON.stringify(showIaC))
    }
  }, [showIaC])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('createstack-defaultIaCTool', JSON.stringify(defaultIaCTool))
    }
  }, [defaultIaCTool])

  // Load current project data when available
  useEffect(() => {
    if (currentProject) {
      isLoadingFromDB.current = true
      setProjectName(currentProject.name)
      setSelectedPlatform(currentProject.platform)
      setSelectedProjectType(currentProject.projectType || "web-app")
      setSelectedArchitecture(currentProject.architecture || "")
      setSelectedCloudPlatform(currentProject.cloudPlatform || "aws")
      setSelectedDepTool(currentProject.dependencyTool)
      setSelectedDocTool(currentProject.documentationTool)
      setSelectedCICDTool(currentProject.cicdTool || "github-actions")
      setSelectedIssueTrackingTool(currentProject.issueTrackingTool || "github-issues")
      setSelectedFeatureFlagTool(currentProject.featureFlagTool || "configcat")
      setSelectedPersonas(currentProject.teamPersonas || ["developer", "product-owner"])
      setSelectedIndustry(currentProject.industry || "none")
      // Reset loading flag after a short delay to allow state updates to complete
      setTimeout(() => {
        isLoadingFromDB.current = false
      }, 100)
    }
  }, [currentProject])

  const saveData = async () => {
    if (!isReady || !projectName.trim()) return

    setIsSaving(true)
    try {
      await saveCurrentProject({
        name: projectName.trim(),
        platform: selectedPlatform,
        projectType: selectedProjectType,
        architecture: selectedArchitecture,
        cloudPlatform: selectedCloudPlatform,
        dependencyTool: selectedDepTool,
        documentationTool: selectedDocTool,
        cicdTool: selectedCICDTool,
        issueTrackingTool: selectedIssueTrackingTool,
        featureFlagTool: selectedFeatureFlagTool,
        teamPersonas: selectedPersonas,
        industry: selectedIndustry
      })
    } catch (error) {
      console.error('Failed to save data:', error)
    } finally {
      setTimeout(() => setIsSaving(false), 500)
    }
  }

  const clearSavedData = async () => {
    if (!isReady) return
    await clearCurrentProject()
  }

  // Auto-save when data changes
  useEffect(() => {
    if (isReady && projectName.trim() && !isLoadingFromDB.current) {
      const timeoutId = setTimeout(saveData, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [projectName, selectedPlatform, selectedProjectType, selectedArchitecture, selectedCloudPlatform, selectedDepTool, selectedDocTool, selectedCICDTool, selectedIssueTrackingTool, selectedFeatureFlagTool, selectedPersonas, selectedIndustry, isReady])

  return {
    // State
    projectName,
    selectedPlatform,
    selectedProjectType,
    selectedArchitecture,
    selectedCloudPlatform,
    selectedDepTool,
    selectedDocTool,
    selectedCICDTool,
    selectedIssueTrackingTool,
    selectedFeatureFlagTool,
    selectedPersonas,
    selectedIndustry,
    showIaC,
    defaultIaCTool,
    isSaving,
    completedCards,
    isReady,
    error,
    
    // Setters
    setProjectName,
    setSelectedPlatform,
    setSelectedProjectType,
    setSelectedArchitecture,
    setSelectedCloudPlatform,
    setSelectedDepTool,
    setSelectedDocTool,
    setSelectedCICDTool,
    setSelectedIssueTrackingTool,
    setSelectedFeatureFlagTool,
    setSelectedPersonas,
    setSelectedIndustry,
    setShowIaC,
    setDefaultIaCTool,
    
    // Actions
    toggleCardCompletion,
    saveData,
    clearSavedData
  };
}
