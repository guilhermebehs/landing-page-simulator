import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadHtml, toFileName } from './download'

describe('toFileName', () => {
  it('turns the title into a safe file name', () => {
    expect(toFileName('Padaria do João!')).toBe('padaria-do-joao.html')
    expect(toFileName('  Café & Cia  ')).toBe('cafe-cia.html')
  })

  it('falls back to a default name when the title has no usable characters', () => {
    expect(toFileName('')).toBe('landing-page.html')
    expect(toFileName('!!!')).toBe('landing-page.html')
  })
})

describe('downloadHtml', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('downloads the HTML as a file with the given name', async () => {
    vi.useFakeTimers()
    // O jsdom não implementa URLs de Blob nem downloads, então substituímos por "dublês"
    const createObjectURL = vi.fn((_blob: Blob) => 'blob:fake-url')
    const revokeObjectURL = vi.fn()
    vi.stubGlobal('URL', { ...URL, createObjectURL, revokeObjectURL })
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    downloadHtml('<h1>Oi</h1>', 'pagina.html')

    const blob = createObjectURL.mock.calls[0][0]
    expect(blob.type).toBe('text/html;charset=utf-8')
    expect(await blob.text()).toBe('<h1>Oi</h1>')

    const link = click.mock.contexts[0] as HTMLAnchorElement
    expect(link.download).toBe('pagina.html')
    expect(link.getAttribute('href')).toBe('blob:fake-url')

    vi.runAllTimers()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:fake-url')

    vi.unstubAllGlobals()
  })
})
