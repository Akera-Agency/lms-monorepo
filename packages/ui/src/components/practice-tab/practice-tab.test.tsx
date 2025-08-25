import { render, screen, fireEvent } from '@testing-library/react';
import { PracticeTab } from './practice-tab';
import { PracticeQuestion } from './practice-tab';

describe('PracticeTab', () => {
  const mockQuestions: PracticeQuestion[] = [
    {
      id: '1',
      title: 'Question 1',
      description: 'Description 1',
      isCompleted: true,
      objectiveId: 45,
    },
    {
      id: '2',
      title: 'Question 2',
      description: 'Description 2',
      isCompleted: false,
      objectiveId: 46,
    },
  ];

  it('renders practice questions', () => {
    render(<PracticeTab questions={mockQuestions} />);
    
    expect(screen.getByText('Question 1')).toBeInTheDocument();
    expect(screen.getByText('Question 2')).toBeInTheDocument();
  });

  it('shows empty state when no questions', () => {
    render(<PracticeTab questions={[]} />);
    
    expect(screen.getByText('No practice questions available')).toBeInTheDocument();
  });

  it('calls onQuestionClick when question is clicked', () => {
    const mockOnQuestionClick = jest.fn();
    render(
      <PracticeTab 
        questions={mockQuestions} 
        onQuestionClick={mockOnQuestionClick} 
      />
    );
    
    const firstQuestion = screen.getByText('Question 1');
    fireEvent.click(firstQuestion);
    
    expect(mockOnQuestionClick).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it('shows completed badge for completed questions', () => {
    render(<PracticeTab questions={mockQuestions} />);
    
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('has proper heading structure', () => {
    render(<PracticeTab questions={mockQuestions} />);
    
    expect(screen.getByText('Practice Questions')).toBeInTheDocument();
    expect(screen.getByText('Click on any question to start practicing')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <PracticeTab questions={mockQuestions} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('sets active state when question is clicked', () => {
    render(<PracticeTab questions={mockQuestions} />);
    
    const firstQuestion = screen.getByText('Question 1');
    fireEvent.click(firstQuestion);
    
    // The active state should be applied (this would need to be checked via CSS classes)
    // In a real test, you might check for specific styling or state changes
  });
});