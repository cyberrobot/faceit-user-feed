import { describe } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import StoreProvider from './StoreProvider';
import Counter from './Counter';
import { expect, it } from 'vitest';

describe('Counter', () => {
  it('updates the displayed count when the button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <StoreProvider>
        <Counter />
      </StoreProvider>,
    );

    await user.click(screen.getByRole('button', { name: /count is/i }));

    expect(screen.getByRole('button', { name: /count is/i }).textContent).toBe(
      'Count is: 1',
    );
  });
});
