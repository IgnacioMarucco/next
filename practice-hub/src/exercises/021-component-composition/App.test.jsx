import { describe, test, expect, afterEach } from 'bun:test';
import { render, screen, cleanup } from '../../test-utils.js';

import Card from './Card';

describe('Card', () => {
  afterEach(() => {
    cleanup();
  });

  test('should accept and output a name prop', () => {
    render(<Card name="Testing name prop" />);
    expect(screen.getAllByText('Testing name prop', { exact: false }).length).not.toBe(0);
  });

  test('should accept and output children', () => {
    render(<Card>Test Text</Card>);
    expect(screen.getAllByText('Test Text', { exact: false }).length).not.toBe(0)
  });

  test('should persist the JSX code passed as children', () => {
    render(
      <Card>
        <button>Test Text</button>
      </Card>
    );
    const paragraph = screen.getByRole('button');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent('Test Text');
  });
});
