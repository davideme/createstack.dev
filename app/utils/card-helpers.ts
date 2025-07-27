import { CompletableCard } from "~/components/ui/completable-card"
import { useCompletableInputs } from "~/hooks/use-completable-inputs"

interface CardRefactorHelpers {
  CompletableCard: typeof CompletableCard
  useCompletableInputs: typeof useCompletableInputs
}

/**
 * Helper exports for refactoring cards to use completable functionality
 * 
 * Usage example:
 * ```tsx
 * import { CompletableCard, useCompletableInputs } from "~/utils/card-helpers"
 * 
 * // In component:
 * const { selectProps, buttonProps } = useCompletableInputs({ 
 *   isCompleted, 
 *   baseDisabled: !projectName.trim() 
 * })
 * 
 * return (
 *   <CompletableCard
 *     title="My Card"
 *     description="Card description"
 *     emoji="🎯"
 *     isCompleted={isCompleted}
 *     onToggleCompletion={onToggleCompletion}
 *     borderColorClass="border-l-blue-400"
 *   >
 *     <Select {...selectProps}>...</Select>
 *     <Button {...buttonProps}>...</Button>
 *   </CompletableCard>
 * )
 * ```
 */
export { CompletableCard, useCompletableInputs }
