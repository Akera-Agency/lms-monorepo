# Practice Tab Components

This directory contains components specifically designed for practice question interfaces in learning applications.

## Components

### `QuestionItem`

A reusable clickable item component designed for practice questions with proper cursor styling and accessibility features.

**Key Features:**
- ✅ **Cursor Pointer**: Automatically applies `cursor-pointer` on hover
- ✅ **Keyboard Navigation**: Supports Enter and Space key interactions
- ✅ **Visual States**: Supports completed, active, and default states
- ✅ **Accessibility**: Proper ARIA attributes and focus management
- ✅ **Preserves Click Logic**: Maintains existing onClick behavior

### `PracticeTab`

A complete practice tab implementation that uses `QuestionItem` components to display a list of practice questions.

## Usage

```tsx
import { PracticeTab, PracticeQuestion } from '@ui/components/practice-tab';

const questions: PracticeQuestion[] = [
  {
    id: '1',
    title: 'Introduction to Variables',
    description: 'Learn about different types of variables',
    isCompleted: true,
    objectiveId: 45,
  },
  {
    id: '2',
    title: 'Control Flow Statements',
    description: 'Understanding if-else and loops',
    isCompleted: false,
    objectiveId: 46,
  },
];

function MyLearningPage() {
  const handleQuestionClick = (question: PracticeQuestion) => {
    // Preserve existing navigation logic
    // Example: dispatch Redux action or navigate to practice page
    dispatch(navigateToPracticeQuestion(question.id, question.objectiveId));
  };

  return (
    <PracticeTab 
      questions={questions}
      onQuestionClick={handleQuestionClick}
    />
  );
}
```

## Solving the Cursor Pointer Issue

This implementation addresses the Linear issue [KEY-935] by:

1. **Explicit Cursor Styling**: The `QuestionItem` component includes `cursor-pointer` in its base styles
2. **Visual Feedback**: Hover states provide clear indication of interactivity
3. **Preserved Logic**: The `onItemClick` prop allows existing Redux actions or navigation logic to remain unchanged
4. **Accessibility**: Proper keyboard navigation and ARIA attributes ensure the component is accessible

## CSS Classes Applied

The components automatically apply these cursor-related classes:

```css
.cursor-pointer     /* Applied to all clickable question items */
.hover:bg-muted/50  /* Visual hover feedback */
.focus:ring-2       /* Keyboard focus indicator */
```

## Integration Notes

- **No Breaking Changes**: Existing click handlers are preserved through the `onItemClick` prop
- **Redux Compatible**: Works with existing action dispatch patterns
- **URL Compatibility**: Supports the URL structure mentioned in the issue (`isPracticing=true&objectiveId=45`)
- **Responsive**: Works on mobile and desktop devices

## Example URL Integration

The component can be used in pages with URLs like:
```
/student/my-learning/32/content/33?isPracticing=true&objectiveId=45
```

The `objectiveId` from the URL can be passed to the `PracticeQuestion` objects and used in the click handler for navigation.