import { useState } from 'react'
import { LandingPageForm } from './components/LandingPageForm'
import { Preview } from './components/Preview'
import { defaultConfig } from './defaultConfig'
import { downloadHtml, toFileName } from './download'
import { generateHtml } from './generateHtml'
import type { LandingPageConfig } from './types'

function App() {
  // Estado único da aplicação. O formulário altera; a preview e o download leem.
  const [config, setConfig] = useState<LandingPageConfig>(defaultConfig)

  // Recalculado a cada render (ou seja, a cada mudança no config).
  // O mesmo HTML vai para a preview e para o arquivo baixado.
  const html = generateHtml(config)

  return (
    <div className="app-shell flex min-h-screen flex-col md:flex-row">
      <aside className="editor-panel border-b p-6 md:sticky md:top-0 md:h-screen md:w-[350px] md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">✳</span>
          <h1 className="brand-title">Landing Page Simulator</h1>
        </div>
        <div className="editor-intro">
          <span className="eyebrow">✦ Seu espaço de criação</span>
          <p className="mt-2 mb-6 text-sm">
          Monte uma landing page preenchendo o formulário. A pré-visualização ao lado é atualizada
          na hora e, quando estiver pronta, baixe a página como um arquivo HTML com CSS puro para
          publicar onde quiser.
          </p>
        </div>
        <LandingPageForm config={config} onChange={setConfig} />
      </aside>

      <main className="preview-panel flex h-[640px] flex-1 flex-col gap-4 p-4 md:sticky md:top-0 md:h-screen md:p-8">
        <div className="preview-toolbar flex items-center justify-between">
          <p className="preview-caption">Pré-visualização <span>· atualizada em tempo real</span></p>
          <button
            type="button"
            onClick={() => downloadHtml(html, toFileName(config.header.title))}
            className="download-button rounded-md px-4 py-2 text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Baixar HTML
          </button>
        </div>
        <div className="min-h-0 flex-1">
          <Preview html={html} />
        </div>
      </main>
    </div>
  )
}

export default App
