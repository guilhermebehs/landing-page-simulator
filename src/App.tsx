import { useState } from 'react'
import { LandingPageForm } from './components/LandingPageForm'
import { Preview } from './components/Preview'
import { defaultConfig } from './defaultConfig'
import type { LandingPageConfig } from './types'

function App() {
  // Estado único da aplicação. O formulário altera, a preview (e em breve o download) leem.
  const [config, setConfig] = useState<LandingPageConfig>(defaultConfig)

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 md:flex-row">
      <aside className="border-b border-gray-200 bg-white p-6 md:sticky md:top-0 md:h-screen md:w-96 md:shrink-0 md:overflow-y-auto md:border-r md:border-b-0">
        <h1 className="mb-6 text-xl font-bold text-gray-900">Landing Page Simulator</h1>
        <LandingPageForm config={config} onChange={setConfig} />
      </aside>

      <main className="h-[600px] flex-1 p-4 md:sticky md:top-0 md:h-screen md:p-8">
        <Preview config={config} />
      </main>
    </div>
  )
}

export default App
