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

// Cada seção é um <fieldset> com <legend>, que o Testing Library enxerga como um "group".
// `within` limita a busca à seção, já que "Título" existe tanto no Header quanto no Body.
function getSection(name: 'Header' | 'Body' | 'Footer') {
  return within(screen.getByRole('group', { name }))
}

describe('LandingPageForm', () => {
  it('shows the current config values', () => {
    renderForm()

    expect(getSection('Header').getByLabelText('Título')).toHaveValue(defaultConfig.header.title)
    expect(getSection('Body').getByLabelText('Texto')).toHaveValue(defaultConfig.body.text)
    expect(getSection('Footer').getByLabelText('Texto')).toHaveValue(defaultConfig.footer.text)
  })

  it('updates the header title', async () => {
    const user = userEvent.setup()
    const { onChange } = renderForm()

    await user.type(getSection('Header').getByLabelText('Título'), '!')

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, title: `${defaultConfig.header.title}!` },
    })
  })

  it('updates the header text color', () => {
    const { onChange } = renderForm()

    // O user-event não sabe "digitar" num color picker, então disparamos o evento direto
    fireEvent.change(getSection('Header').getByLabelText('Cor do texto'), {
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

    await user.selectOptions(getSection('Header').getByLabelText('Fonte'), 'Georgia')

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: { ...defaultConfig.header, font: 'Georgia, serif' },
    })
  })

  it('starts with no background images, since they are optional', () => {
    renderForm()

    for (const section of ['Header', 'Body', 'Footer'] as const) {
      expect(getSection(section).getByLabelText('URL da imagem de fundo (opcional)')).toHaveValue('')
    }
  })

  it('updates the body background color', () => {
    const { onChange } = renderForm()

    fireEvent.change(getSection('Body').getByLabelText('Cor de fundo'), {
      target: { value: '#00ff00' },
    })

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      body: { ...defaultConfig.body, background: { color: '#00ff00' } },
    })
  })

  it('adds a background image on top of the footer color', () => {
    const { onChange } = renderForm()

    fireEvent.change(getSection('Footer').getByLabelText('URL da imagem de fundo (opcional)'), {
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

    fireEvent.change(getSection('Header').getByLabelText('Cor de fundo'), {
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

    await user.clear(getSection('Header').getByLabelText('URL da imagem de fundo (opcional)'))

    expect(onChange).toHaveBeenCalledWith({
      ...defaultConfig,
      header: {
        ...defaultConfig.header,
        background: { ...defaultConfig.header.background, image: undefined },
      },
    })
  })
})
