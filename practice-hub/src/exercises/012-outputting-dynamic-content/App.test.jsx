import { describe, test, expect, afterEach } from 'bun:test';
import { render, screen, cleanup } from '../../test-utils.js';

import App, { User, userData } from './App';

describe('App component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders User component', () => {
    render(<App />);
    const userElement = screen.getByTestId('user');
    expect(userElement).toBeInTheDocument();
  });
});

describe('User component', () => {
  test('outputs userData firstName and lastName', () => {
    const testFirstName = 'Test First Name';
    const testLastName = 'Test Last Name';
    userData.firstName = testFirstName;
    userData.lastName = testLastName;
    render(<User />);
    const firstNameElements = screen.getAllByText(testFirstName, { exact: false });
    expect(firstNameElements.length).not.toBe(0)
    const lastNameElements = screen.getAllByText(testLastName, { exact: false });
    expect(lastNameElements.length).not.toBe(0)
  });

  test('outputs userData title', () => {
    const testTitle = 'Test Title';
    userData.title = testTitle;
    render(<User />);
    const titleElements = screen.getAllByText(testTitle, { exact: false });
    expect(titleElements.length).not.toBe(0)
  });

});
