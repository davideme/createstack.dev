import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Badge } from "~/components/ui/badge";
import { MermaidDiagram } from "~/components/ui/mermaid-diagram";
import { CardCompletionToggle } from "~/components/ui/card-completion-toggle";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useState } from "react";

import { platforms } from "~/data/platforms";
import { projectTypes, getArchitecturesForProjectType, getArchitecture } from "~/data/project-types";
import { teamPersonas } from "~/data/personas";
import { industries } from "~/data/industries";
import { generateADR, generateArchitectureADR } from "~/utils/adr-generators";
import { generateVendorComparison } from "~/utils/vendor";
import { generateArchitectureDiagram } from "~/utils/architecture-diagrams";

interface ProjectSetupCardProps {
  projectName: string;
  selectedPlatform: string;
  selectedProjectType: string;
  selectedArchitecture: string;
  selectedPersonas: string[];
  selectedIndustry: string;
  completedCards: Record<string, boolean>;
  mode: 'gap-analysis' | 'stack-builder';
  onProjectNameChange: (name: string) => void;
  onPlatformChange: (platform: string) => void;
  onProjectTypeChange: (type: string) => void;
  onArchitectureChange: (arch: string) => void;
  onPersonasChange: (personas: string[]) => void;
  onIndustryChange: (industry: string) => void;
  onToggleCardCompletion: (cardId: string) => void;
  onCopyToClipboard: (text: string) => void;
  onCreateRepository: () => void;
  onClearData: () => void;
}

export function ProjectSetupCard({
  projectName,
  selectedPlatform,
  selectedProjectType,
  selectedArchitecture,
  selectedPersonas,
  selectedIndustry,
  completedCards,
  mode,
  onProjectNameChange,
  onPlatformChange,
  onProjectTypeChange,
  onArchitectureChange,
  onPersonasChange,
  onIndustryChange,
  onToggleCardCompletion,
  onCopyToClipboard,
  onCreateRepository,
  onClearData
}: ProjectSetupCardProps) {
  const [showPersonas, setShowPersonas] = useState(false);
  const [showArchitectureDiagram, setShowArchitectureDiagram] = useState(false);

  // Get available architectures for selected project type
  const availableArchitectures = getArchitecturesForProjectType(selectedProjectType);

  // Mode configuration
  const modeConfig = {
    'gap-analysis': {
      theme: {
        primary: 'blue',
        accent: 'indigo', 
        cardBorder: 'border-blue-200',
        completedBg: 'bg-blue-50'
      },
      labels: {
        projectSetupTitle: "Current Project Details",
        projectSetupDesc: "Enter your existing technologies below to see what's missing from your stack",
        projectNameLabel: "Project/Product Name",
        projectNamePlaceholder: "Enter your current project name...",
        actionButton: "Analyze Stack Gaps",
        modeDescription: "Analyze & Improve"
      }
    },
    'stack-builder': {
      theme: {
        primary: 'green',
        accent: 'blue', 
        cardBorder: 'border-green-200',
        completedBg: 'bg-green-50'
      },
      labels: {
        projectSetupTitle: "Project Setup",
        projectSetupDesc: "Define your project name and team composition to get personalized tool recommendations",
        projectNameLabel: "Project Name",
        projectNamePlaceholder: "Enter your project name...",
        actionButton: "Create Repository",
        modeDescription: "Build & Deploy"
      }
    }
  };

  const currentContent = modeConfig[mode];

  const handlePersonaToggle = (personaId: string) => {
    const isSelected = selectedPersonas.includes(personaId);
    if (isSelected) {
      onPersonasChange(selectedPersonas.filter(p => p !== personaId));
    } else {
      onPersonasChange([...selectedPersonas, personaId]);
    }
  };

  return (
    <Card className={`border-l-4 ${mode === 'gap-analysis' ? 'border-l-blue-400' : 'border-l-green-400'} ${completedCards['project-setup'] ? 'bg-gray-50 border-green-200' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📝</span>
            <span>{currentContent.labels.projectSetupTitle}</span>
            <CardCompletionToggle
              cardId="project-setup"
              isCompleted={completedCards['project-setup'] || false}
              onToggle={onToggleCardCompletion}
            />
          </div>
        </CardTitle>
        <CardDescription>
          {currentContent.labels.projectSetupDesc}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Name */}
        <div className="space-y-2">
          <label htmlFor="project-name" className="text-sm font-medium">
            {currentContent.labels.projectNameLabel}
          </label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder={currentContent.labels.projectNamePlaceholder}
            disabled={completedCards['project-setup']}
          />
        </div>

        {/* Project Type */}
        <div className="space-y-2">
          <label htmlFor="project-type" className="text-sm font-medium">
            Project Type
          </label>
          <Select value={selectedProjectType} onValueChange={onProjectTypeChange} disabled={completedCards['project-setup']}>
            <SelectTrigger id="project-type">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center space-x-2">
                    <span>{type.emoji}</span>
                    <span>{type.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Project Type Info */}
        <div className="p-3 bg-muted rounded-lg">
          <h4 className="text-sm font-medium mb-1 flex items-center space-x-2">
            <span>{projectTypes.find(p => p.id === selectedProjectType)?.emoji}</span>
            <span>{projectTypes.find(p => p.id === selectedProjectType)?.name}</span>
          </h4>
          <p className="text-xs text-muted-foreground mb-2">
            {projectTypes.find(p => p.id === selectedProjectType)?.description}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            <strong>Best for:</strong> {projectTypes.find(p => p.id === selectedProjectType)?.bestFor}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Common stacks:</strong> {projectTypes.find(p => p.id === selectedProjectType)?.commonStacks?.join(", ")}
          </p>
        </div>

        {/* Architecture Selection */}
        {availableArchitectures.length > 0 && (
          <div className="space-y-2">
            <label htmlFor="architecture" className="text-sm font-medium">
              Architecture Pattern
            </label>
            <Select value={selectedArchitecture} onValueChange={onArchitectureChange} disabled={completedCards['project-setup']}>
              <SelectTrigger id="architecture">
                <SelectValue placeholder="Select architecture pattern" />
              </SelectTrigger>
              <SelectContent>
                {availableArchitectures.map((arch) => (
                  <SelectItem key={arch.id} value={arch.id}>
                    {arch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Architecture Info */}
        {selectedArchitecture && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium mb-1">
              {getArchitecture(selectedProjectType, selectedArchitecture)?.name}
            </h4>
            <p className="text-xs text-blue-700 mb-2">
              {getArchitecture(selectedProjectType, selectedArchitecture)?.description}
            </p>
            <p className="text-xs text-blue-700 mb-2">
              <strong>Best for:</strong> {getArchitecture(selectedProjectType, selectedArchitecture)?.bestFor}
            </p>
            <p className="text-xs text-blue-700">
              <strong>Examples:</strong> {getArchitecture(selectedProjectType, selectedArchitecture)?.examples?.join(", ")}
            </p>
          </div>
        )}

        {/* Team Personas */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Team Composition</label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPersonas(!showPersonas)}
              disabled={completedCards['project-setup']}
            >
              {showPersonas ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
          {showPersonas && (
            <div className="grid grid-cols-2 gap-2">
              {teamPersonas.map((persona) => (
                <label key={persona.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedPersonas.includes(persona.id)}
                    onChange={() => handlePersonaToggle(persona.id)}
                    disabled={completedCards['project-setup']}
                    className="rounded"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{persona.name}</div>
                    <div className="text-xs text-gray-500">{persona.primaryFocus}</div>
                  </div>
                </label>
              ))}
            </div>
          )}
          {selectedPersonas.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedPersonas.map((personaId) => {
                const persona = teamPersonas.find(p => p.id === personaId);
                return persona ? (
                  <Badge key={personaId} variant="secondary" className="text-xs">
                    {persona.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Industry Selection */}
        <div className="space-y-2">
          <label htmlFor="industry" className="text-sm font-medium">
            Industry
          </label>
          <Select value={selectedIndustry} onValueChange={onIndustryChange} disabled={completedCards['project-setup']}>
            <SelectTrigger id="industry">
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry.id} value={industry.id}>
                  <div className="flex items-center space-x-2">
                    <span>{industry.emoji}</span>
                    <span>{industry.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          {mode === 'stack-builder' && (
            <Button onClick={onCreateRepository} className="flex-1" disabled={!projectName.trim()}>
              <ExternalLink className="w-4 h-4 mr-2" />
              {currentContent.labels.actionButton}
            </Button>
          )}
          <Button variant="outline" onClick={onClearData} size="sm">
            Clear Data
          </Button>
        </div>

        {/* Architecture Diagram */}
        {selectedArchitecture && projectName.trim() && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">🏗️ Architecture Diagram</h4>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowArchitectureDiagram(!showArchitectureDiagram)}
                >
                  {showArchitectureDiagram ? "Hide" : "Show"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const arch = getArchitecture(selectedProjectType, selectedArchitecture);
                    if (arch) {
                      const diagram = generateArchitectureDiagram(arch);
                      onCopyToClipboard(diagram.mermaidCode);
                    }
                  }}
                >
                  Copy Mermaid
                </Button>
              </div>
            </div>
            {showArchitectureDiagram && (
              <div className="border rounded-lg p-4 bg-white">
                <MermaidDiagram
                  id={`arch-${selectedArchitecture}`}
                  diagram={(() => {
                    const arch = getArchitecture(selectedProjectType, selectedArchitecture);
                    return arch ? generateArchitectureDiagram(arch).mermaidCode : "";
                  })()}
                />
              </div>
            )}
          </div>
        )}

        {/* ADR Section */}
        {projectName.trim() && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">📝 Architecture Decision Record</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopyToClipboard(generateADR(projectName, selectedPlatform, platforms))}
              >
                Copy ADR
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Document your project decisions for future reference
            </p>
          </div>
        )}

        {/* Vendor Comparison Section */}
        {projectName.trim() && (
          <div className="space-y-2 border-t pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">📊 Vendor Entry</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onCopyToClipboard(generateVendorComparison(projectName, selectedPlatform, platforms))}
              >
                Copy Vendor Row
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Vendor assessment template for finance approvals and procurement processes
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
