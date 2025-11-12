import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  test('renders home page initially', () => {
    render(<App />);
    const titleElement = screen.getByText(/Welcome to the React Quiz/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('renders Start Quiz button', () => {
    render(<App />);
    const buttonElement = screen.getByRole('button', { name: /Start Quiz/i });
    expect(buttonElement).toBeInTheDocument();
  });
});
