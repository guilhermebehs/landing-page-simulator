import { describe, expect, it } from 'vitest'
import { defaultConfig } from './defaultConfig'
import { generateHtml } from './generateHtml'
import type { LandingPageConfig } from './types'

// Transforma o texto em um documento de verdade, para testar com seletores CSS
// em vez de procurar pedaços de string
function parse(config: LandingPageConfig) {
  return new DOMParser().parseFromString(generateHtml(config), 'text/html')
}

function withConfig(changes: {
  header?: Partial<LandingPageConfig['header']>
  body?: Partial<LandingPageConfig['body']>
  footer?: Partial<LandingPageConfig['footer']>
}): LandingPageConfig {
  return {
    header: { ...defaultConfig.header, ...changes.header },
    body: { ...defaultConfig.body, ...changes.body },
    footer: { ...defaultConfig.footer, ...changes.footer },
  }
}

describe('generateHtml', () => {
  it('renders the texts of every section', () => {
    const doc = parse(defaultConfig)

    expect(doc.title).toBe(defaultConfig.header.title)
    expect(doc.querySelector('header h1')?.textContent).toBe(defaultConfig.header.title)
    expect(doc.querySelector('header p')?.textContent).toBe(defaultConfig.header.text)
    expect(doc.querySelector('main h2')?.textContent).toBe(defaultConfig.body.title)
    expect(doc.querySelector('main p')?.textContent).toBe(defaultConfig.body.text)
    expect(doc.querySelector('footer .container')?.textContent).toBe(defaultConfig.footer.text)
  })

  it('escapes HTML typed by the user', () => {
    const doc = parse(withConfig({ body: { title: '<b>oi</b>' } }))

    expect(doc.querySelector('main h2')?.textContent).toBe('<b>oi</b>')
    expect(doc.querySelector('main b')).toBeNull()
  })

  it('omits empty titles and texts', () => {
    const doc = parse(withConfig({ header: { text: '' }, body: { title: '' } }))

    expect(doc.querySelector('header p')).toBeNull()
    expect(doc.querySelector('main h2')).toBeNull()
  })

  it('applies the header color and font', () => {
    const html = generateHtml(withConfig({ header: { textColor: '#ff0000', font: 'Georgia, serif' } }))

    expect(html).toContain('color: #ff0000;')
    expect(html).toContain('font-family: Georgia, serif;')
  })

  it('uses only the background color when there is no image', () => {
    const html = generateHtml(defaultConfig)

    expect(html).not.toContain('url(')
    expect(html).toContain(`background: ${defaultConfig.body.background.color};`)
  })

  it('layers the background image on top of the color', () => {
    const html = generateHtml(
      withConfig({ footer: { background: { color: '#1f2937', image: 'https://example.com/bg.jpg' } } }),
    )

    expect(html).toContain('background: url("https://example.com/bg.jpg") center / cover no-repeat, #1f2937;')
  })

  it('applies the header background color and optional image', () => {
    const colorOnly = parse(withConfig({ header: { background: { color: '#abcdef' } } }))
    expect(colorOnly.querySelector('style')?.textContent).toMatch(/header \{[^}]*background: #abcdef;/)

    const withImage = parse(
      withConfig({ header: { background: { color: '#abcdef', image: 'https://example.com/top.jpg' } } }),
    )
    expect(withImage.querySelector('style')?.textContent).toMatch(
      /header \{[^}]*background: url\("https:\/\/example.com\/top.jpg"\) center \/ cover no-repeat, #abcdef;/,
    )
  })

  it('picks a readable text color for the background', () => {
    const dark = generateHtml(withConfig({ footer: { background: { color: '#000000' } } }))
    expect(dark).toMatch(/background: #000000;\s+color: #ffffff;/)

    const light = generateHtml(withConfig({ footer: { background: { color: '#ffffff' } } }))
    expect(light).toMatch(/background: #ffffff;\s+color: #111827;/)
  })

  it('cannot break out of the CSS through an image URL', () => {
    const html = generateHtml(
      withConfig({
        header: { background: { color: '#ffffff', image: 'x"); } </style><script>alert(1)</script>' } },
      }),
    )

    expect(html).not.toContain('<script>')
    expect(html.match(/<\/style>/g)).toHaveLength(1)
  })
})
