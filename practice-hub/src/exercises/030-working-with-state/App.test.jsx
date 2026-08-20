import { describe, test, expect, afterEach } from 'bun:test';
import React from 'react';

import App from './App';
import { render, screen, fireEvent, cleanup } from '../../test-utils.js';

describe('App component', () => {
    afterEach(() => {
      cleanup();
    });
    test('should display the original price value', () => {
        render(<App />);
        const paragraph = screen.getByTestId('price');
        expect(paragraph.textContent).toContain('100');
    });
    test('should update & output the price state when the button is clicked', () => {
        render(<App />);
        
        const button = screen.getByRole('button');
        const paragraph = screen.getByTestId('price');
        
        expect(paragraph.textContent).toContain('100');
        fireEvent.click(button);
        expect(paragraph.textContent).not.toContain('100');
    });
});
