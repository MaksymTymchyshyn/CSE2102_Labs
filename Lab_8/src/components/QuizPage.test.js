import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizPage from './QuizPage';

describe('QuizPage Component', () => {
  const mockQuestion = {
    id: 1,
    text: 'What is React?',
    options: ['A library', 'A framework', 'A language', 'A tool']
  };

  const mockQuiz = {
    getCurrentQuestion: () => mockQuestion,
    getTotalQuestions: () => 10,
    currentQuestionIndex: 0,
    isQuestionAnswered: () => false,
    getUserAnswer: () => undefined,
    userAnswers: new Map()
  };

  const mockHandlers = {
    onAnswer: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    onSubmit: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render question text', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText('What is React?')).toBeInTheDocument();
    });

    test('should render all options', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/A library/i)).toBeInTheDocument();
      expect(screen.getByText(/A framework/i)).toBeInTheDocument();
      expect(screen.getByText(/A language/i)).toBeInTheDocument();
      expect(screen.getByText(/A tool/i)).toBeInTheDocument();
    });

    test('should render question counter', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Question 1 of 10/i)).toBeInTheDocument();
    });

    test('should render progress bar', () => {
      const { container } = render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      const progressBar = container.querySelector('.progress-fill');
      expect(progressBar).toBeInTheDocument();
    });

    test('should render option letters (A, B, C, D)', () => {
      const { container } = render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      expect(container.textContent).toContain('A');
      expect(container.textContent).toContain('B');
      expect(container.textContent).toContain('C');
      expect(container.textContent).toContain('D');
    });
  });

  describe('Option Selection', () => {
    test('should call onAnswer when option clicked', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      const firstOption = screen.getByText(/A library/i).closest('.option-button');
      fireEvent.click(firstOption);
      expect(mockHandlers.onAnswer).toHaveBeenCalledWith(0);
    });

    test('should highlight selected option', () => {
      const quizWithAnswer = {
        ...mockQuiz,
        isQuestionAnswered: () => true,
        getUserAnswer: () => 1,
        userAnswers: new Map([[1, 1]])
      };
      const { container } = render(<QuizPage quiz={quizWithAnswer} {...mockHandlers} />);
      const options = container.querySelectorAll('.option-button');
      expect(options[1].classList.contains('selected')).toBe(true);
    });
  });

  describe('Navigation', () => {
    test('should render Next button', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
    });

    test('should call onNext when Next clicked', () => {
      const quizWithAnswer = {
        ...mockQuiz,
        isQuestionAnswered: () => true,
        userAnswers: new Map([[1, 0]])
      };
      render(<QuizPage quiz={quizWithAnswer} {...mockHandlers} />);
      const nextButton = screen.getByRole('button', { name: /Next/i });
      fireEvent.click(nextButton);
      expect(mockHandlers.onNext).toHaveBeenCalledTimes(1);
    });

    test('should disable Next button if question not answered', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      const nextButton = screen.getByRole('button', { name: /Next/i });
      expect(nextButton).toBeDisabled();
    });

    test('should show Previous button when not on first question', () => {
      const quizNotFirst = {
        ...mockQuiz,
        currentQuestionIndex: 3,
        userAnswers: new Map()
      };
      render(<QuizPage quiz={quizNotFirst} {...mockHandlers} />);
      expect(screen.getByRole('button', { name: /Previous/i })).toBeInTheDocument();
    });

    test('should call onPrevious when Previous clicked', () => {
      const quizNotFirst = {
        ...mockQuiz,
        currentQuestionIndex: 3,
        userAnswers: new Map()
      };
      render(<QuizPage quiz={quizNotFirst} {...mockHandlers} />);
      const prevButton = screen.getByRole('button', { name: /Previous/i });
      fireEvent.click(prevButton);
      expect(mockHandlers.onPrevious).toHaveBeenCalledTimes(1);
    });

    test('should not show Previous button on first question', () => {
      render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.queryByRole('button', { name: /Previous/i })).not.toBeInTheDocument();
    });
  });

  describe('Quiz Completion', () => {
    test('should show Submit button on last question', () => {
      const lastQuiz = {
        ...mockQuiz,
        currentQuestionIndex: 9,
        isQuestionAnswered: () => true,
        userAnswers: new Map([[1, 0]])
      };
      render(<QuizPage quiz={lastQuiz} {...mockHandlers} />);
      expect(screen.getByRole('button', { name: /Submit Quiz/i })).toBeInTheDocument();
    });

    test('should call onSubmit when Submit clicked', () => {
      const lastQuiz = {
        ...mockQuiz,
        currentQuestionIndex: 9,
        isQuestionAnswered: () => true,
        userAnswers: new Map([[1, 0]])
      };
      render(<QuizPage quiz={lastQuiz} {...mockHandlers} />);
      const submitButton = screen.getByRole('button', { name: /Submit Quiz/i });
      fireEvent.click(submitButton);
      expect(mockHandlers.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Progress Calculation', () => {
    test('should calculate correct progress percentage', () => {
      const { container } = render(<QuizPage quiz={mockQuiz} {...mockHandlers} />);
      const progressFill = container.querySelector('.progress-fill');
      expect(progressFill.style.width).toBe('10%');
    });

    test('should show 50% progress at middle question', () => {
      const middleQuiz = {
        ...mockQuiz,
        currentQuestionIndex: 4,
        userAnswers: new Map()
      };
      const { container } = render(<QuizPage quiz={middleQuiz} {...mockHandlers} />);
      const progressFill = container.querySelector('.progress-fill');
      expect(progressFill.style.width).toBe('50%');
    });
  });

  describe('Edge Cases', () => {
    test('should handle null question', () => {
      const emptyQuiz = {
        ...mockQuiz,
        getCurrentQuestion: () => null,
        userAnswers: new Map()
      };
      const { container } = render(<QuizPage quiz={emptyQuiz} {...mockHandlers} />);
      expect(container.textContent).toContain('Loading');
    });

    test('should handle question with no options', () => {
      const noOptionsQuestion = {
        ...mockQuestion,
        options: []
      };
      const quizNoOptions = {
        ...mockQuiz,
        getCurrentQuestion: () => noOptionsQuestion,
        userAnswers: new Map()
      };
      render(<QuizPage quiz={quizNoOptions} {...mockHandlers} />);
      const options = screen.queryAllByRole('button', { name: /^[A-D]/ });
      expect(options.length).toBe(0);
    });
  });
});
