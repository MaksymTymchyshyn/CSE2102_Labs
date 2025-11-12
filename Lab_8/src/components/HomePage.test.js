import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage Component', () => {
  const mockOnStart = jest.fn();

  beforeEach(() => {
    mockOnStart.mockClear();
  });

  describe('Rendering', () => {
    test('should render welcome title', () => {
      render(<HomePage onStart={mockOnStart} />);
      expect(screen.getByText(/Welcome to the React Quiz/i)).toBeInTheDocument();
    });

    test('should render subtitle', () => {
      render(<HomePage onStart={mockOnStart} />);
      expect(screen.getByText(/Test Your Knowledge!/i)).toBeInTheDocument();
    });

    test('should render Start Quiz button', () => {
      render(<HomePage onStart={mockOnStart} />);
      const button = screen.getByRole('button', { name: /Start Quiz/i });
      expect(button).toBeInTheDocument();
    });

    test('should render info cards', () => {
      render(<HomePage onStart={mockOnStart} />);
      expect(screen.getByText(/12 multiple-choice questions/i)).toBeInTheDocument();
      expect(screen.getByText(/Quiz Information/i)).toBeInTheDocument();
    });

    test('should render all topic categories', () => {
      render(<HomePage onStart={mockOnStart} />);
      expect(screen.getByText('Web Development')).toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.getByText('Programming Concepts')).toBeInTheDocument();
      expect(screen.getByText('Data Structures')).toBeInTheDocument();
      expect(screen.getByText('Algorithms')).toBeInTheDocument();
      expect(screen.getByText('Design Patterns')).toBeInTheDocument();
    });

    test('should render instructions section', () => {
      render(<HomePage onStart={mockOnStart} />);
      expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
      expect(screen.getByText(/Click the "Start Quiz" button below/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    test('should call onStart when button clicked', () => {
      render(<HomePage onStart={mockOnStart} />);
      const button = screen.getByRole('button', { name: /Start Quiz/i });
      fireEvent.click(button);
      expect(mockOnStart).toHaveBeenCalledTimes(1);
    });

    test('should not call onStart if button not clicked', () => {
      render(<HomePage onStart={mockOnStart} />);
      expect(mockOnStart).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    test('should apply correct CSS classes', () => {
      const { container } = render(<HomePage onStart={mockOnStart} />);
      expect(container.querySelector('.home-page')).toBeInTheDocument();
      expect(container.querySelector('.home-container')).toBeInTheDocument();
      expect(container.querySelector('.info-card')).toBeInTheDocument();
    });
  });
});
