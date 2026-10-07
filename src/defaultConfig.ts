import type { LandingPageConfig } from './types'

// Fontes "web-safe": já vêm instaladas em praticamente todo computador,
// então o HTML baixado funciona sem depender de fontes externas.
// `value` é o que vai no CSS (`font-family`); `label` é o que aparece no select.
export const FONT_OPTIONS = [
  { label: 'System UI', value: 'system-ui, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
  { label: 'Courier New', value: "'Courier New', Courier, monospace" },
]

// Valores iniciais do formulário
export const defaultConfig: LandingPageConfig = {
  header: {
    title: 'Minha Empresa',
    text: 'O melhor serviço da cidade',
    textColor: '#1f2937',
    font: FONT_OPTIONS[1].value,
  },
  body: {
    title: 'Sobre nós',
    text: 'Conte aqui a história do seu negócio e o que ele oferece.',
    background: { color: '#ffffff' },
  },
  footer: {
    text: '© 2026 Minha Empresa',
    background: { color: '#1f2937' },
  },
}
