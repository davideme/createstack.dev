import { Lock, Unlock } from "lucide-react";

interface CardCompletionToggleProps {
  cardId: string;
  isCompleted: boolean;
  onToggle: (cardId: string) => void;
}

export function CardCompletionToggle({ cardId, isCompleted, onToggle }: CardCompletionToggleProps) {
  return (
    <button
      onClick={() => onToggle(cardId)}
      className={`p-1 rounded transition-colors ${
        isCompleted 
          ? 'text-green-600 hover:text-green-700 hover:bg-green-50' 
          : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
      }`}
      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {isCompleted ? (
        <Lock className="h-4 w-4" />
      ) : (
        <Unlock className="h-4 w-4" />
      )}
    </button>
  );
}
