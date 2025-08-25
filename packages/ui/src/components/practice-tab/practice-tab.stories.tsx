import type { Meta, StoryObj } from '@storybook/react';
import { PracticeTab } from './practice-tab';
import { PracticeQuestion } from './practice-tab';

const meta: Meta<typeof PracticeTab> = {
  title: 'Components/PracticeTab',
  component: PracticeTab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onQuestionClick: { action: 'question clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleQuestions: PracticeQuestion[] = [
  {
    id: '1',
    title: 'Introduction to Variables',
    description: 'Learn about different types of variables in programming',
    isCompleted: true,
    objectiveId: 45,
  },
  {
    id: '2',
    title: 'Control Flow Statements',
    description: 'Understanding if-else, loops, and conditional statements',
    isCompleted: false,
    objectiveId: 46,
  },
  {
    id: '3',
    title: 'Functions and Methods',
    description: 'Creating reusable code blocks with functions',
    isCompleted: false,
    objectiveId: 47,
  },
  {
    id: '4',
    title: 'Data Structures',
    description: 'Arrays, objects, and other data structures',
    isCompleted: true,
    objectiveId: 48,
  },
];

export const Default: Story = {
  args: {
    questions: sampleQuestions,
    onQuestionClick: (question) => {
      console.log('Clicked question:', question);
      // This would typically dispatch a Redux action or handle navigation
      // Example: dispatch(navigateToPracticeQuestion(question.id, question.objectiveId));
    },
  },
};

export const EmptyState: Story = {
  args: {
    questions: [],
  },
};

export const WithCustomClassName: Story = {
  args: {
    questions: sampleQuestions,
    className: 'max-w-md',
  },
};

export const AllCompleted: Story = {
  args: {
    questions: sampleQuestions.map(q => ({ ...q, isCompleted: true })),
  },
};

export const NoneCompleted: Story = {
  args: {
    questions: sampleQuestions.map(q => ({ ...q, isCompleted: false })),
  },
};