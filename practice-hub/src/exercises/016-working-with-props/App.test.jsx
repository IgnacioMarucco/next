import { describe, test, expect, afterEach } from 'bun:test';
import { cleanup, render, screen } from '../../test-utils.js';

import App, { CourseGoal } from './App';

describe('App component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders successfully', () => {
    render(<App />);
    const appElement = screen.getByTestId('app');
    expect(appElement).toBeInTheDocument();
  });

  test('renders CourseGoal component at least twice', () => {
    render(<App />);
    const courseGoalElements = screen.getAllByRole('listitem');
    expect(courseGoalElements.length).toBeGreaterThanOrEqual(2);
  });

  test('sets title and description prop on CourseGoal component', () => {
    render(<App />);
    const titleElements = screen.getAllByText('Learn React', { exact: false });
    const descriptionElements = screen.getAllByText('In-depth', { exact: false });
    expect(titleElements.length).not.toBe(0)
    expect(descriptionElements.length).not.toBe(0)
  });
});

describe('CourseGoal component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders successfully', () => {
    render(<CourseGoal />);
    const listItemElement = screen.getByRole('listitem');
    expect(listItemElement).toBeInTheDocument();
  });

  test('receives title and description props and outputs both values', () => {
    render(<CourseGoal title="Test Title" description="Test Description" />);
    const titleElements = screen.getAllByText('Test Title', { exact: false });
    const descriptionElements = screen.getAllByText('Test Description', { exact: false });
    expect(titleElements.length).not.toBe(0)
    expect(descriptionElements.length).not.toBe(0)
  });
});
