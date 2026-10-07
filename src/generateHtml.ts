import { FONT_OPTIONS } from './defaultConfig'
import type { Background, LandingPageConfig } from './types'

// Monta o HTML completo (com CSS puro embutido) da landing page.
// É uma função "pura": mesma entrada, mesma saída, sem efeitos colaterais.
// A preview mostra esse HTML num <iframe> e o download salva esse mesmo texto num arquivo.
export function generateHtml(config: LandingPageConfig): string {
  const { header, body, footer } = config

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(header.title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: system-ui, sans-serif;
    }
    .container { max-width: 720px; margin: 0 auto; }
    header {
      padding: 96px 24px;
      text-align: center;
      color: ${safeColor(header.textColor, '#1f2937')};
      font-family: ${safeFont(header.font)};
      background: ${backgroundCss(header.background)};
    }
    header h1 { margin: 0 0 16px; font-size: 48px; line-height: 1.1; }
    header p { margin: 0; font-size: 20px; white-space: pre-line; }
    main {
      flex: 1;
      padding: 64px 24px;
      background: ${backgroundCss(body.background)};
      color: ${contrastTextColor(body.background.color)};
    }
    main h2 { margin: 0 0 16px; font-size: 32px; }
    main p { margin: 0; font-size: 18px; line-height: 1.6; white-space: pre-line; }
    footer {
      padding: 32px 24px;
      text-align: center;
      font-size: 14px;
      background: ${backgroundCss(footer.background)};
      color: ${contrastTextColor(footer.background.color)};
    }
    footer .container { white-space: pre-line; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      ${header.title ? `<h1>${escapeHtml(header.title)}</h1>` : ''}
      ${header.text ? `<p>${escapeHtml(header.text)}</p>` : ''}
    </div>
  </header>
  <main>
    <div class="container">
      ${body.title ? `<h2>${escapeHtml(body.title)}</h2>` : ''}
      ${body.text ? `<p>${escapeHtml(body.text)}</p>` : ''}
    </div>
  </main>
  <footer>
    <div class="container">${escapeHtml(footer.text)}</div>
  </footer>
</body>
</html>
`
}

// Fundo em camadas: a imagem (se houver) por cima, a cor por baixo.
// Se a imagem não existir ou não carregar, aparece a cor.
function backgroundCss(background: Background): string {
  const color = safeColor(background.color, '#ffffff')
  return background.image ? `${imageLayer(background.image)}, ${color}` : color
}

function imageLayer(url: string): string {
  return `url("${escapeCssString(url)}") center / cover no-repeat`
}

// Escolhe texto escuro ou claro conforme a cor de fundo, para manter a leitura.
// Usa a fórmula de luminância relativa (WCAG): 0 = preto, 1 = branco.
function contrastTextColor(backgroundColor: string): string {
  const hex = safeColor(backgroundColor, '#ffffff').slice(1)
  const [r, g, b] = [0, 2, 4].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.179 ? '#111827' : '#ffffff'
}

// --- Segurança ---------------------------------------------------------------
// Tudo que o cliente digita vai parar dentro do HTML/CSS. Sem "escapar", um texto como
// "<b>oi</b>" viraria HTML de verdade, e um texto com "</style>" quebraria a página.

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

// Para valores dentro de uma string CSS: url("...")
function escapeCssString(text: string): string {
  return text
    .replaceAll('\\', '\\\\')
    .replaceAll('"', '\\"')
    .replaceAll('\n', '\\a ')
    .replaceAll('<', '\\3c ')
}

// Só aceita cores no formato #rrggbb (o que o <input type="color"> produz)
function safeColor(color: string, fallback: string): string {
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback
}

// Só aceita fontes da nossa lista
function safeFont(font: string): string {
  return FONT_OPTIONS.some((option) => option.value === font) ? font : FONT_OPTIONS[0].value
}
