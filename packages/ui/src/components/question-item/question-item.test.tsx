import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionItem } from './question-item';

describe('QuestionItem', () => {
  const defaultProps = {
    title: 'Test Question',
    description: 'Test description',
  };

  it('renders with title and description', () => {
    render(<QuestionItem {...defaultProps} />);
    
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('has cursor-pointer class', () => {
    render(<QuestionItem {...defaultProps} />);
    
    const questionItem = screen.getByRole('button');
    expect(questionItem).toHaveClass('cursor-pointer');
  });

  it('calls onItemClick when clicked', () => {
    const mockOnItemClick = jest.fn();
    render(<QuestionItem {...defaultProps} onItemClick={mockOnItemClick} />);
    
    const questionItem = screen.getByRole('button');
    fireEvent.click(questionItem);
    
    expect(mockOnItemClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<QuestionItem {...defaultProps} onClick={mockOnClick} />);
    
    const questionItem = screen.getByRole('button');
    fireEvent.click(questionItem);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation', () => {
    const mockOnItemClick = jest.fn();
    render(<QuestionItem {...defaultProps} onItemClick={mockOnItemClick} />);
    
    const questionItem = screen.getByRole('button');
    
    // Test Enter key
    fireEvent.keyDown(questionItem, { key: 'Enter' });
    expect(mockOnItemClick).toHaveBeenCalledTimes(1);
    
    // Test Space key
    fireEvent.keyDown(questionItem, { key: ' ' });
    expect(mockOnItemClick).toHaveBeenCalledTimes(2);
  });

  it('shows completed state', () => {
    render(<QuestionItem {...defaultProps} isCompleted />);
    
    const questionItem = screen.getByRole('button');
    expect(questionItem).toHaveClass('bg-success/5', 'border-success/20');
  });

  it('shows active state', () => {
    render(<QuestionItem {...defaultProps} isActive />);
    
    const questionItem = screen.getByRole('button');
    expect(questionItem).toHaveClass('bg-primary/5', 'border-primary/20');
  });

  it('renders right content', () => {
    const rightContent = <span>Right Content</span>;
    render(<QuestionItem {...defaultProps} rightContent={rightContent} />);
    
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<QuestionItem {...defaultProps} />);
    
    const questionItem = screen.getByRole('button');
    expect(questionItem).toHaveAttribute('tabIndex', '0');
  });
});