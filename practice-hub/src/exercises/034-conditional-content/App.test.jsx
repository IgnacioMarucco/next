import { describe, test, expect, afterEach } from 'bun:test';

import App from './App';
import { render, screen, fireEvent, cleanup } from '../../test-utils.js';

describe('App component', () => {
    afterEach(() => {
        cleanup();
    });
    test('should not display the warning if the button was not clicked', () => {
        render(<App />);
        const alert = screen.queryByTestId('alert');
        expect(alert).not.toBeInTheDocument();
    });
    test('should display the warning after the button was clicked', () => {
        render(<App />);
        let alert = screen.queryByTestId('alert');
        expect(alert).not.toBeInTheDocument();
        const button = screen.getByRole('button');
        fireEvent.click(button);
        alert = screen.queryByTestId('alert');
        expect(alert).toBeInTheDocument();
    });
    test('should not display the warning after dismissing it', () => {
        render(<App />);
        let alert = screen.queryByTestId('alert');
        expect(alert).not.toBeInTheDocument();
        const button = screen.getByRole('button');
        fireEvent.click(button);
        alert = screen.queryByTestId('alert');
        expect(alert).toBeInTheDocument();
        const proceedBtn = screen.getAllByRole('button')[0];
        fireEvent.click(proceedBtn);
        alert = screen.queryByTestId('alert');
        expect(alert).not.toBeInTheDocument();
    });
});
