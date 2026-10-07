import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import * as download from './download'
import { generateHtml } from './generateHtml'
import { defaultConfig } from './defaultConfig'

describe('App', () => {
  it('renders the form sections', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Landing Page Simulator' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Header' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Body' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Footer' })).toBeInTheDocument()
  })

  it('describes what the app does', () => {
    render(<App />)

    expect(screen.getByText(/monte uma landing page/i)).toBeInTheDocument()
  })

  it('renders the preview', () => {
    render(<App />)

    expect(screen.getByTitle('Preview da landing page')).toBeInTheDocument()
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

  // O caminho completo: formulário → estado no App → preview
  it('updates the preview when the form changes', async () => {
    const user = userEvent.setup()
    render(<App />)

    const body = within(screen.getByRole('group', { name: 'Body' }))
    const title = body.getByLabelText('Título')

    await user.clear(title)
    await user.type(title, 'Nosso cardápio')

    const preview = screen.getByTitle('Preview da landing page')
    expect(preview.getAttribute('srcdoc')).toContain('<h2>Nosso cardápio</h2>')
  })

  it('downloads the same HTML shown in the preview, named after the header title', async () => {
    const user = userEvent.setup()
    // Espiamos a função de download para não disparar um download de verdade no teste
    const downloadHtml = vi.spyOn(download, 'downloadHtml').mockImplementation(() => {})
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Baixar HTML' }))

    const preview = screen.getByTitle('Preview da landing page')
    expect(downloadHtml).toHaveBeenCalledWith(generateHtml(defaultConfig), 'minha-empresa.html')
    expect(preview.getAttribute('srcdoc')).toBe(generateHtml(defaultConfig))

    downloadHtml.mockRestore()
  })
})
