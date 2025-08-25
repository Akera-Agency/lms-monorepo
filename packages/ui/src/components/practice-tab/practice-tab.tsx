import { useState } from "react";
import { QuestionItem } from "../question-item";
import { Badge } from "../badge";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface PracticeQuestion {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
  objectiveId?: string | number;
}

interface PracticeTabProps {
  questions: PracticeQuestion[];
  onQuestionClick?: (question: PracticeQuestion) => void;
  className?: string;
}

const PracticeTab = ({ questions, onQuestionClick, className }: PracticeTabProps) => {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const handleQuestionClick = (question: PracticeQuestion) => {
    setActiveQuestionId(question.id);
    
    // Preserve existing navigation logic - call the provided handler
    // This would typically dispatch Redux actions or handle navigation
    onQuestionClick?.(question);
  };

  const renderQuestionIcon = (question: PracticeQuestion) => {
    if (question.isCompleted) {
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    }
    return <Circle className="w-5 h-5 text-muted-foreground" />;
  };

  const renderQuestionBadge = (question: PracticeQuestion) => {
    if (question.isCompleted) {
      return <Badge variant="success" className="text-xs">Completed</Badge>;
    }
    return null;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-primary-text">Practice Questions</h2>
        <p className="text-sm text-secondary-text">
          Click on any question to start practicing
        </p>
      </div>
      
      {questions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-secondary-text">No practice questions available</p>
        </div>
      ) : (
        <div className="space-y-2">
          {questions.map((question) => (
            <QuestionItem
              key={question.id}
              title={question.title}
              description={question.description}
              isCompleted={question.isCompleted}
              isActive={activeQuestionId === question.id}
              onItemClick={() => handleQuestionClick(question)}
              rightContent={
                <div className="flex items-center gap-2">
                  {renderQuestionBadge(question)}
                  {renderQuestionIcon(question)}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              }
              className="group"
              aria-label={`Practice question: ${question.title}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { PracticeTab };
export type { PracticeQuestion, PracticeTabProps };