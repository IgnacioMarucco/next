import { describe, test, expect, afterEach } from 'bun:test';
import React from 'react';

import App from './App';
import { render, screen, fireEvent } from '../../test-utils.js';

describe('App component', () => {
    test('should not add any CSS class to the paragraph if the button was not clicked', () => {
        
        render(
            <App />
        );
        const texts = screen.getAllByText('Style me', {exact: false});
        expect(texts[0].className).toBe('');
    });
    test('should set the "active" CSS class on the paragraph if the button was clicked', () => {
        
        render(
            <App />
        );
        const texts = screen.getAllByText('Style me', {exact: false});
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(texts[0].className).toBe('active')
    });
 
});
