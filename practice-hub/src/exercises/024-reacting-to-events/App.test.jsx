import { describe, test, expect, afterEach } from 'bun:test';
import { render, screen, cleanup, fireEvent } from '../../test-utils.js';
import userEvent from '@testing-library/user-event';

import App, { user as userData } from './App';

describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  test('contains empty strings as values for user.email & user.password initially, user.loggedIn is false initially', () => {
    render(<App />);
    expect(userData.email).toBe('');
    expect(userData.password).toBe('');
  });

  test('contains false as an initial value for user.loggedIn', () => {
    render(<App />);
    expect(userData.loggedIn).toBe(false);
  });
});

describe('Login button', () => {
  afterEach(() => {
    cleanup();
  });

  test('changes user.email and user.password to non-empty strings when clicked', async () => {
    render(<App />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(userData.email).not.toBe('');
    expect(userData.password).not.toBe('');
  });

  test('changes user.loggedIn to true when clicked', async () => {
    render(<App />);
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);
    expect(userData.loggedIn).toBe(true);
  });
});
