/**
 * Example usage of PracticeTab component
 * This demonstrates how to integrate the component with existing Redux actions
 * and navigation logic while preserving the cursor pointer functionality
 */

import React from 'react';
import { PracticeTab, PracticeQuestion } from './practice-tab';

// Example Redux action (would be imported from your store)
const navigateToPracticeQuestion = (questionId: string, objectiveId?: string | number) => {
  return {
    type: 'NAVIGATE_TO_PRACTICE_QUESTION',
    payload: { questionId, objectiveId }
  };
};

// Example dispatch function (would come from useDispatch hook)
const dispatch = (action: any) => {
  console.log('Dispatching action:', action);
  // In real app: store.dispatch(action);
};

// Example practice questions data
const practiceQuestions: PracticeQuestion[] = [
  {
    id: '1',
    title: 'Introduction to Variables',
    description: 'Learn about different types of variables in programming languages',
    isCompleted: true,
    objectiveId: 45,
  },
  {
    id: '2',
    title: 'Control Flow Statements',
    description: 'Understanding if-else conditions, loops, and switch statements',
    isCompleted: false,
    objectiveId: 46,
  },
  {
    id: '3',
    title: 'Functions and Methods',
    description: 'Creating reusable code blocks with functions and methods',
    isCompleted: false,
    objectiveId: 47,
  },
  {
    id: '4',
    title: 'Data Structures Basics',
    description: 'Working with arrays, objects, and other fundamental data structures',
    isCompleted: true,
    objectiveId: 48,
  },
];

/**
 * Example component showing integration with My Learning page
 * URL: /student/my-learning/32/content/33?isPracticing=true&objectiveId=45
 */
export const MyLearningPracticeExample: React.FC = () => {
  const handleQuestionClick = (question: PracticeQuestion) => {
    // This preserves the existing navigation logic mentioned in the Linear issue
    // The Redux action dispatch or navigation method remains unchanged
    dispatch(navigateToPracticeQuestion(question.id, question.objectiveId));
    
    // Alternative: Direct navigation (if not using Redux)
    // window.location.href = `/student/practice/${question.id}?objectiveId=${question.objectiveId}`;
    
    // Or using React Router
    // navigate(`/student/practice/${question.id}?objectiveId=${question.objectiveId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Learning - Practice Tab</h1>
      
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <PracticeTab 
          questions={practiceQuestions}
          onQuestionClick={handleQuestionClick}
          className="space-y-3"
        />
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">✅ Issue Fixed:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Questions now show pointer cursor on hover</li>
          <li>• Visual feedback indicates clickable elements</li>
          <li>• Existing Redux actions/navigation logic preserved</li>
          <li>• Keyboard navigation support added</li>
          <li>• Accessibility improvements included</li>
        </ul>
      </div>
    </div>
  );
};

/**
 * Example showing how to add cursor pointer to existing components
 * (Quick fix for legacy components)
 */
export const LegacyQuestionItemFixed: React.FC = () => {
  const handleClick = () => {
    // Existing click logic
    dispatch(navigateToPracticeQuestion('legacy-1', 45));
  };

  return (
    <div 
      className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      <h3 className="font-semibold">Legacy Question Item</h3>
      <p className="text-sm text-muted-foreground">
        This shows how to quickly fix existing components by adding cursor-pointer class
      </p>
    </div>
  );
};