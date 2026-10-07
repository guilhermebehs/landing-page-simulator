import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the page heading', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Get started' }),
    ).toBeInTheDocument()
  })

  it('increments the counter when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    const button = screen.getByRole('button', { name: /count is/i })
    expect(button).toHaveTextContent('Count is 0')

    await user.click(button)
    await user.click(button)

    expect(button).toHaveTextContent('Count is 2')
  })
})
