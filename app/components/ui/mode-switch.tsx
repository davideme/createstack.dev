import * as React from "react"
import { Switch } from "~/components/ui/switch"
import { Search, Plus } from "lucide-react"
import { cn } from "~/lib/utils"

interface ModeSwitchProps {
  mode: 'gap-analysis' | 'stack-builder'
  onModeChange: (mode: 'gap-analysis' | 'stack-builder') => void
  className?: string
}

export function ModeSwitch({ mode, onModeChange, className }: ModeSwitchProps) {
  const isStackBuilder = mode === 'stack-builder'
  
  const handleToggle = (checked: boolean) => {
    onModeChange(checked ? 'stack-builder' : 'gap-analysis')
  }

  return (
    <div className={cn("flex items-center space-x-4 p-4 bg-muted/30 rounded-lg border", className)}>
      {/* Gap Analysis Label */}
      <div className="flex items-center space-x-2">
        <Search className={cn(
          "h-4 w-4 transition-colors",
          !isStackBuilder ? "text-blue-600" : "text-muted-foreground"
        )} />
        <div className="text-left">
          <span 
            className={cn(
              "text-sm font-medium cursor-pointer transition-colors",
              !isStackBuilder ? "text-blue-700" : "text-muted-foreground"
            )}
          >
            Analyze Existing
          </span>
          <p className={cn(
            "text-xs transition-colors",
            !isStackBuilder ? "text-blue-600" : "text-muted-foreground"
          )}>
            Find gaps & improve
          </p>
        </div>
      </div>

      {/* Switch */}
      <Switch
        id="mode-switch"
        checked={isStackBuilder}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-blue-600"
      />

      {/* Stack Builder Label */}
      <div className="flex items-center space-x-2">
        <Plus className={cn(
          "h-4 w-4 transition-colors",
          isStackBuilder ? "text-green-600" : "text-muted-foreground"
        )} />
        <div className="text-left">
          <span 
            className={cn(
              "text-sm font-medium cursor-pointer transition-colors",
              isStackBuilder ? "text-green-700" : "text-muted-foreground"
            )}
          >
            Build New Stack
          </span>
          <p className={cn(
            "text-xs transition-colors",
            isStackBuilder ? "text-green-600" : "text-muted-foreground"
          )}>
            Plan from scratch
          </p>
        </div>
      </div>
    </div>
  )
}
