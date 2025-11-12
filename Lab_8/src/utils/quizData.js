/**
 * Quiz Questions Data
 * Contains all quiz questions organized by category
 */

export const quizQuestions = [
  {
    id: 1,
    text: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Home Tool Markup Language',
      'Hyperlinks and Text Markup Language'
    ],
    correctAnswerIndex: 0,
    category: 'Web Development'
  },
  {
    id: 2,
    text: 'Which programming language is known as the "language of the web"?',
    options: ['Python', 'Java', 'JavaScript', 'C++'],
    correctAnswerIndex: 2,
    category: 'Web Development'
  },
  {
    id: 3,
    text: 'What does CSS stand for?',
    options: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style Sheets',
      'Colorful Style Sheets'
    ],
    correctAnswerIndex: 1,
    category: 'Web Development'
  },
  {
    id: 4,
    text: 'Which of the following is NOT a JavaScript framework?',
    options: ['React', 'Angular', 'Vue', 'Django'],
    correctAnswerIndex: 3,
    category: 'Web Development'
  },
  {
    id: 5,
    text: 'What is the purpose of the "useState" hook in React?',
    options: [
      'To manage component state',
      'To fetch data from APIs',
      'To handle routing',
      'To style components'
    ],
    correctAnswerIndex: 0,
    category: 'React'
  },
  {
    id: 6,
    text: 'In Object-Oriented Programming, what is encapsulation?',
    options: [
      'Hiding implementation details',
      'Multiple inheritance',
      'Method overloading',
      'Interface implementation'
    ],
    correctAnswerIndex: 0,
    category: 'Programming Concepts'
  },
  {
    id: 7,
    text: 'Which data structure uses LIFO (Last In First Out)?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswerIndex: 1,
    category: 'Data Structures'
  },
  {
    id: 8,
    text: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswerIndex: 1,
    category: 'Algorithms'
  },
  {
    id: 9,
    text: 'Which HTTP method is used to update a resource?',
    options: ['GET', 'POST', 'PUT', 'DELETE'],
    correctAnswerIndex: 2,
    category: 'Web Development'
  },
  {
    id: 10,
    text: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Advanced Programming Interface',
      'Application Protocol Interface',
      'Automated Programming Interface'
    ],
    correctAnswerIndex: 0,
    category: 'Programming Concepts'
  },
  {
    id: 11,
    text: 'Which design pattern ensures a class has only one instance?',
    options: ['Factory', 'Singleton', 'Observer', 'Strategy'],
    correctAnswerIndex: 1,
    category: 'Design Patterns'
  },
  {
    id: 12,
    text: 'In React, what is the virtual DOM?',
    options: [
      'A lightweight copy of the real DOM',
      'A database for storing components',
      'A styling framework',
      'A testing library'
    ],
    correctAnswerIndex: 0,
    category: 'React'
  }
];

export default quizQuestions;
