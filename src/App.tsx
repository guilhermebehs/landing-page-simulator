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
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      <aside className="border-b border-gray-200 bg-white p-6 md:sticky md:top-0 md:h-screen md:w-96 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <h1 className="text-xl font-bold text-gray-900">Landing Page Simulator</h1>
        <p className="mt-2 mb-6 text-sm text-gray-600">
          Monte uma landing page preenchendo o formulário. A pré-visualização ao lado é atualizada
          na hora e, quando estiver pronta, baixe a página como um arquivo HTML com CSS puro para
          publicar onde quiser.
        </p>
        <LandingPageForm config={config} onChange={setConfig} />
      </aside>

      <main className="flex h-[640px] flex-1 flex-col gap-4 p-4 md:sticky md:top-0 md:h-screen md:p-8">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => downloadHtml(html, toFileName(config.header.title))}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
