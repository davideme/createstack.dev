import { useMemo } from "react"

interface UseCompletableInputsOptions {
  isCompleted: boolean
  baseDisabled?: boolean
}

interface UseCompletableInputsReturn {
  selectProps: {
    disabled: boolean
    className?: string
  }
  buttonProps: {
    disabled: boolean
  }
  inputProps: {
    disabled: boolean
    className?: string
  }
}

/**
 * Hook to manage disabled state for inputs in completable cards
 */
export function useCompletableInputs({ 
  isCompleted, 
  baseDisabled = false 
}: UseCompletableInputsOptions): UseCompletableInputsReturn {
  return useMemo(() => ({
    selectProps: {
      disabled: baseDisabled || isCompleted,
      className: isCompleted ? "opacity-50 cursor-not-allowed" : ""
    },
    buttonProps: {
      disabled: baseDisabled || isCompleted
    },
    inputProps: {
      disabled: baseDisabled || isCompleted,
      className: isCompleted ? "opacity-50 cursor-not-allowed" : ""
    }
  }), [isCompleted, baseDisabled])
}
