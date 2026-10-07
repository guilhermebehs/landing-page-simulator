import { useState } from 'react'
import { LandingPageForm } from './components/LandingPageForm'
import { defaultConfig } from './defaultConfig'
import type { LandingPageConfig } from './types'

function App() {
  // Estado único da aplicação. O formulário altera, e (em breve) a preview e o download leem.
  const [config, setConfig] = useState<LandingPageConfig>(defaultConfig)

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      <aside className="border-b border-gray-200 bg-white p-6 md:sticky md:top-0 md:h-screen md:w-96 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Landing Page Simulator</h1>
        <LandingPageForm config={config} onChange={setConfig} />
      </aside>

      <main className="flex flex-1 items-start justify-center p-8">
        {/* Temporário: mostra o estado atual até construirmos a preview */}
        <pre className="w-full max-w-2xl overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
          {JSON.stringify(config, null, 2)}
        </pre>
      </main>
    </div>
  )
}

export default App
