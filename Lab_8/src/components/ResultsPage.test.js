import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResultsPage from './ResultsPage';

describe('ResultsPage Component', () => {
  const mockQuiz = {
    calculateScore: () => 8,
    getTotalQuestions: () => 10,
    getPercentageScore: () => 80,
    getDuration: () => 125,
    questions: [
      { id: 1, category: 'React' },
      { id: 2, category: 'React' },
      { id: 3, category: 'JavaScript' },
      { id: 4, category: 'JavaScript' },
      { id: 5, category: 'JavaScript' }
    ],
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
      expect(screen.getByText('8')).toBeInTheDocument(); // correct
      expect(screen.getByText('2')).toBeInTheDocument(); // incorrect
    });

    test('should render grade', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText('B')).toBeInTheDocument();
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
      expect(screen.getByText('A')).toBeInTheDocument();
    });

    test('should show B grade for 80-89%', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText('B')).toBeInTheDocument();
    });

    test('should show C grade for 70-79%', () => {
      const cGradeQuiz = {
        ...mockQuiz,
        calculateScore: () => 7,
        getPercentageScore: () => 70
      };
      render(<ResultsPage quiz={cGradeQuiz} {...mockHandlers} />);
      expect(screen.getByText('C')).toBeInTheDocument();
    });

    test('should show F grade for below 60%', () => {
      const failingQuiz = {
        ...mockQuiz,
        calculateScore: () => 5,
        getPercentageScore: () => 50
      };
      render(<ResultsPage quiz={failingQuiz} {...mockHandlers} />);
      expect(screen.getByText('F')).toBeInTheDocument();
    });
  });

  describe('Category Breakdown', () => {
    test('should render category breakdown section', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Category Breakdown/i)).toBeInTheDocument();
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
      expect(screen.getByText(/Correct:/i)).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    test('should calculate incorrect answers', () => {
      render(<ResultsPage quiz={mockQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Incorrect:/i)).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
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
      expect(screen.getByText(/Excellent work!/i)).toBeInTheDocument();
    });

    test('should show good message for 70-79%', () => {
      const goodQuiz = {
        ...mockQuiz,
        calculateScore: () => 7,
        getPercentageScore: () => 70
      };
      render(<ResultsPage quiz={goodQuiz} {...mockHandlers} />);
      expect(screen.getByText(/Good job!/i)).toBeInTheDocument();
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
      expect(screen.getByText('F')).toBeInTheDocument();
    });

    test('should handle perfect score', () => {
      const perfectQuiz = {
        ...mockQuiz,
        calculateScore: () => 10,
        getPercentageScore: () => 100
      };
      render(<ResultsPage quiz={perfectQuiz} {...mockHandlers} />);
      expect(screen.getByText('100%')).toBeInTheDocument();
      expect(screen.getByText('A')).toBeInTheDocument();
    });
  });
});
