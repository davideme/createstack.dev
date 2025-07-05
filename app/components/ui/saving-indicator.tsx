interface SavingIndicatorProps {
  isSaving: boolean
}

export function SavingIndicator({ isSaving }: SavingIndicatorProps) {
  if (!isSaving) return null

  return (
    <div className="flex items-center space-x-1 ml-auto">
      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
      <span className="text-xs text-muted-foreground font-normal">Saving...</span>
    </div>
  )
}
