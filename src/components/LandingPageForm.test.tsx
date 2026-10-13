import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { defaultConfig } from '../defaultConfig'
import type { LandingPageConfig } from '../types'
import { LandingPageForm } from './LandingPageForm'

// `vi.fn()` cria uma função "espiã": registra cada chamada para conferirmos depois
function renderForm(config: LandingPageConfig = defaultConfig) {
  const onChange = vi.fn()
  render(<LandingPageForm config={config} onChange={onChange} />)
  return { onChange }
}

type SectionName = 'Cabeçalho' | 'Corpo' | 'Rodapé'

// Cada seção é uma aba. Abrimos a aba e devolvemos o painel dela;
// `within` limita a busca ao painel, já que "Título" existe tanto no Cabeçalho quanto no Corpo.
function openTab(name: SectionName) {
  fireEvent.click(screen.getByRole('tab', { name }))
  return within(screen.getByRole('tabpanel', { name }))
}

describe('LandingPageForm', () => {
  it('shows one section at a time, starting with the header', () => {
    renderForm()

    expect(screen.getByRole('tab', { name: 'Cabeçalho' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
    expect(screen.getByRole('tabpanel', { name: 'Cabeçalho' })).toBeVisible()

    openTab('Rodapé')

    expect(screen.getAllByRole('tabpanel')).toHaveLength(1)
    expect(screen.getByRole('tabpanel', { name: 'Rodapé' })).toBeVisible()
  })

  it('shows the current config values', () => {
    renderForm()

    expect(openTab('Cabeçalho').getByLabelText('Título')).toHaveValue(defaultConfig.header.title)
    expect(openTab('Corpo').getByLabelText('Texto')).toHaveValue(defaultConfig.body.text)
    expect(openTab('Rodapé').getByLabelText('Texto')).toHaveValue(defaultConfig.footer.text)
  })

  it('updates the header title', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm()

    await user.type(openTab('Cabeçalho').getByLabelText('Título'), '!')

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, title: `${defaultConfig.header.title}!` },
    })
  })

  it('updates the optional header logo URL', () => {
    const { onChange } = renderForm()

    fireEvent.change(openTab('Cabeçalho').getByLabelText('URL do logo (opcional)'), {
      target: { value: 'https://example.com/logo.png' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, logoUrl: 'https://example.com/logo.png' },
    })
  })

  it('updates a social URL while keeping the other social fields', () => {
    const { onChange } = renderForm()

    fireEvent.change(openTab('Rodapé').getByLabelText('Instagram (URL opcional)'), {
      target: { value: 'https://instagram.com/minhaempresa' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      footer: {
        ...defaultConfig.footer,
        socialLinks: { ...defaultConfig.footer.socialLinks, instagram: 'https://instagram.com/minhaempresa' },
      },
    })
  })

  it('updates the header text color', () => {
    const { onChange } = renderForm()

    // O user-event não sabe "digitar" num color picker, então disparamos o evento direto
    fireEvent.change(openTab('Cabeçalho').getByLabelText('Cor do texto'), {
      target: { value: '#ff0000' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, textColor: '#ff0000' },
    })
  })

  it('updates the header font', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm()

    await user.selectOptions(openTab('Cabeçalho').getByLabelText('Fonte'), 'Georgia')

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, font: 'Georgia, serif' },
    })
  })

  it('starts with no background images, since they are optional', () => {
    renderForm()

    for (const section of ['Cabeçalho', 'Corpo', 'Rodapé'] as const) {
      expect(openTab(section).getByLabelText('URL da imagem de fundo (opcional)')).toHaveValue('')
    }
  })

  it('updates the body background color', () => {
    const { onChange } = renderForm()

    fireEvent.change(openTab('Corpo').getByLabelText('Cor de fundo'), {
      target: { value: '#00ff00' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      body: { ...defaultConfig.body, background: { color: '#00ff00' } },
    })
  })

  it('adds a background image on top of the footer color', () => {
    const { onChange } = renderForm()

    fireEvent.change(openTab('Rodapé').getByLabelText('URL da imagem de fundo (opcional)'), {
      target: { value: 'https://example.com/bg.jpg' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      footer: {
        ...defaultConfig.footer,
        background: { color: defaultConfig.footer.background.color, image: 'https://example.com/bg.jpg' },
      },
    })
  })

  it('updates the header background color', () => {
    const { onChange } = renderForm()

    fireEvent.change(openTab('Cabeçalho').getByLabelText('Cor de fundo'), {
      target: { value: '#123456' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, background: { color: '#123456' } },
    })
  })

  it('removes the header image when the field is cleared', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm({
      ...defaultConfig,
      header: {
        ...defaultConfig.header,
        background: { ...defaultConfig.header.background, image: 'https://example.com/bg.jpg' },
      },
    })

    await user.clear(openTab('Cabeçalho').getByLabelText('URL da imagem de fundo (opcional)'))

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: {
        ...defaultConfig.header,
        background: { ...defaultConfig.header.background, image: undefined },
      },
    })
  })
})
