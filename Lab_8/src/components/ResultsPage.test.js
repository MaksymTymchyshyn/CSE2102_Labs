import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultsPage from './ResultsPage';
import { Question } from '../models/Question';

describe('ResultsPage Component', () => {
  const mockQuestions = [
    new Question(1, 'What is React?', ['A', 'B', 'C', 'D'], 0, 'React'),
    new Question(2, 'What is JSX?', ['A', 'B', 'C', 'D'], 1, 'React'),
    new Question(3, 'What is JS?', ['A', 'B', 'C', 'D'], 0, 'JavaScript'),
    new Question(4, 'What is closure?', ['A', 'B', 'C', 'D'], 2, 'JavaScript'),
    new Question(5, 'What is promise?', ['A', 'B', 'C', 'D'], 1, 'JavaScript')
  ];

  const mockQuiz = {
    calculateScore: () => 8,
    getTotalQuestions: () => 10,
    getPercentageScore: () => 80,
    getDuration: () => 125,
    questions: mockQuestions,
    isQuestionAnswered: (id) => true,
    getUserAnswer: () => 0,
    getDetailedResults: () => []
  };

  const mockHandlers = {
    onRestart: jest.fn(),
    onViewDetails: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render quiz complete title', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Quiz Complete!/i)).toBeInTheDocument();
    });

    test('should render score percentage', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    test('should render performance message', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Great job!/i)).toBeInTheDocument();
    });

    test('should render correct/incorrect counts', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getAllByText('8').length).toBeGreaterThan(0); // correct
      expect(screen.getAllByText('2').length).toBeGreaterThan(0); // incorrect
    });

    test('should render grade', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getAllByText('B').length).toBeGreaterThan(0);
    });

    test('should render time taken', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/2 minutes 5 seconds/i)).toBeInTheDocument();
    });
  });

  describe('Grade Display', () => {
    test('should show A grade for 90%+', () => {
      const perfectQuiz = {
        ...mockQuiz,
        calculateScore: () => 10,
        getPercentageScore: () => 100
      };
      render(<ResultsPage quiz={perfectQuiz} {...mockHandlers} />);
      expect(screen.getAllByText('A').length).toBeGreaterThan(0);
    });

    test('should show B grade for 80-89%', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getAllByText('B').length).toBeGreaterThan(0);
    });

    test('should show C grade for 70-79%', () => {
      const cGradeQuiz = {
        ...mockQuiz,
        calculateScore: () => 7,
        getPercentageScore: () => 70
      };
      render(<ResultsPage quiz={cGradeQuiz} {...mockHandlers} />);
      expect(screen.getAllByText('C').length).toBeGreaterThan(0);
    });

    test('should show F grade for below 60%', () => {
      const failingQuiz = {
        ...mockQuiz,
        calculateScore: () => 5,
        getPercentageScore: () => 50
      };
      render(<ResultsPage quiz={failingQuiz} {...mockHandlers} />);
      expect(screen.getAllByText('F').length).toBeGreaterThan(0);
    });
  });

  describe('Category Breakdown', () => {
    test('should render category breakdown section', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Performance by Category/i)).toBeInTheDocument();
    });

    test('should display categories with scores', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    test('should render Take Quiz Again button', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByRole('button', { name: /Take Quiz Again/i })).toBeInTheDocument();
    });

    test('should render View Detailed Results button', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByRole('button', { name: /View Detailed Results/i })).toBeInTheDocument();
    });

    test('should call onRestart when Take Quiz Again clicked', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      const restartButton = screen.getByRole('button', { name: /Take Quiz Again/i });
      fireEvent.click(restartButton);
      expect(mockHandlers.onRestart).toHaveBeenCalledTimes(1);
    });

    test('should call onViewDetails when View Detailed Results clicked', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      const detailsButton = screen.getByRole('button', { name: /View Detailed Results/i });
      fireEvent.click(detailsButton);
      expect(mockHandlers.onViewDetails).toHaveBeenCalledTimes(1);
    });
  });

  describe('Trophy Animation', () => {
    test('should render trophy icon', () => {
      const { container } = render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(container.querySelector('.trophy')).toBeInTheDocument();
    });
  });

  describe('Stats Display', () => {
    test('should render all stat cards', () => {
      const { container } = render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      const statCards = container.querySelectorAll('.stat-card');
      expect(statCards.length).toBeGreaterThanOrEqual(4);
    });

    test('should show correct answer count', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getAllByText(/Correct/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText('8').length).toBeGreaterThan(0);
    });

    test('should calculate incorrect answers', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getAllByText(/Incorrect/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    });
  });

  describe('Time Formatting', () => {
    test('should format seconds only', () => {
      const quickQuiz = {
        ...mockQuiz,
        getDuration: () => 45
      };
      render(<ResultsPage quiz={quickQuiz} {...mockHandlers} />);
      expect(screen.getByText(/45 seconds/i)).toBeInTheDocument();
    });

    test('should format minutes and seconds', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/2 minutes 5 seconds/i)).toBeInTheDocument();
    });
  });

  describe('Performance Messages', () => {
    test('should show excellent message for 90%+', () => {
      const excellentQuiz = {
        ...mockQuiz,
        calculateScore: () => 9,
        getPercentageScore: () => 90
      };
      render(<ResultsPage quiz={excellentQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Outstanding/i)).toBeInTheDocument();
    });

    test('should show good message for 70-79%', () => {
      const goodQuiz = {
        ...mockQuiz,
        calculateScore: () => 7,
        getPercentageScore: () => 70
      };
      render(<ResultsPage quiz={goodQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Good work/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero score', () => {
      const zeroQuiz = {
        ...mockQuiz,
        calculateScore: () => 0,
        getPercentageScore: () => 0
      };
      render(<ResultsPage quiz={zeroQuiz} {...mockHandlers} />);
      expect(screen.getByText('0%')).toBeInTheDocument();
      expect(screen.getAllByText('F').length).toBeGreaterThan(0);
    });

    test('should handle perfect score', () => {
      const perfectQuiz = {
        ...mockQuiz,
        calculateScore: () => 10,
        getPercentageScore: () => 100
      };
      render(<ResultsPage quiz={perfectQuiz} {...mockHandlers} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getAllByText('A').length).toBeGreaterThan(0);
    });
  });
});
