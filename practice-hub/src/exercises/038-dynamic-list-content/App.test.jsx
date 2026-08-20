import { describe, test, expect, afterEach } from 'bun:test';
import React from 'react';

import App, { DUMMY_TODOS } from './App';
import { render, screen, cleanup } from '../../test-utils.js';

describe('App component', () => {
    afterEach(() => {
        cleanup();
    });
    test('should render one Todo component per todo in the list', () => {
        DUMMY_TODOS.push('New');
        render(
            <App />
        );
        const listItems = screen.getAllByRole('listitem');
        expect(listItems).toHaveLength(DUMMY_TODOS.length);
    });
    test('should output the todos text', () => {
        DUMMY_TODOS[0] = 'Changed';
        render(
            <App />
        );
        const listItems = screen.getAllByRole('listitem');
        expect(listItems[0].textContent).toBe('Changed');
        expect(listItems[1].textContent).toBe('Practice React');
        expect(listItems[2].textContent).toBe('Profit!');
    });
});

