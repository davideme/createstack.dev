import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Button } from "~/components/ui/button"
import { Lock, Unlock } from "lucide-react"

interface CompletableCardProps {
  children: React.ReactNode
  title: string
  description: string
  emoji?: string
  isCompleted?: boolean
  onToggleCompletion?: () => void
  className?: string
  borderColorClass?: string
}

export function CompletableCard({
  children,
  title,
  description,
  emoji,
  isCompleted = false,
  onToggleCompletion,
  className = "",
  borderColorClass = "border-l-blue-400"
}: CompletableCardProps) {
  return (
    <Card className={`border-l-4 ${borderColorClass} ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              {emoji && <span className="text-xl">{emoji}</span>}
              <span>{title}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {onToggleCompletion && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCompletion}
              className={`flex items-center gap-2 ${
                isCompleted ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-500 hover:text-gray-700'
              }`}
              title={isCompleted ? "Unlock for editing" : "Lock when satisfied"}
            >
              {isCompleted ? (
                <>
                  <Lock className="h-4 w-4" />
                  <span>Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4" />
                  <span>Unlocked</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  )
}
