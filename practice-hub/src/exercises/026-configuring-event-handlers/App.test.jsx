import { describe, test, expect, afterEach } from 'bun:test';
import { render, screen, cleanup, fireEvent } from '../../test-utils.js';

import App, { user as userData } from './App';

describe('App', () => {
  afterEach(() => {
    cleanup();
  });

  test('contains an empty string as a value for user.name initially', () => {
    render(<App />);
    expect(userData.name).toBe('');
  });
});

describe('Create User button', () => {
  afterEach(() => {
    cleanup();
  });

  test('changes user.name to the value passed to the event handler function', async () => {
    render(<App />);
    const createUserButton = screen.getByRole('button');
    fireEvent.click(createUserButton);
    expect(userData.name).not.toBe('');
  });
});
