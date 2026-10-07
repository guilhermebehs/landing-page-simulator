import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the form sections', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Landing Page Simulator' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Header' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Body' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Footer' })).toBeInTheDocument()
  })

  // Teste de integração: confere que o App guarda o estado e devolve o valor novo ao formulário
  it('keeps what the user types in the form', async () => {
    const user = userEvent.setup()
    render(<App />)

    const header = within(screen.getByRole('group', { name: 'Header' }))
    const title = header.getByLabelText('Título')

    await user.clear(title)
    await user.type(title, 'Padaria do João')

    expect(title).toHaveValue('Padaria do João')
  })
})
