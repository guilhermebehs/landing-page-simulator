import { generateHtml } from '../generateHtml'
import type { LandingPageConfig } from '../types'

// Mostra a landing page dentro de um <iframe>, como se fosse uma janela de navegador.
// O iframe é um documento separado: o CSS do nosso app (Tailwind) não vaza pra dentro dele
// e o CSS da landing page não vaza pra fora. Assim a preview fica igual ao arquivo baixado.
export function Preview({ config }: { config: LandingPageConfig }) {
  const html = generateHtml(config)

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-300 bg-white shadow-lg">
      {/* Barra decorativa imitando uma janela de navegador */}
      <div className="flex gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3" aria-hidden="true">
        <span className="size-3 rounded-full bg-red-400" />
        <span className="size-3 rounded-full bg-yellow-400" />
        <span className="size-3 rounded-full bg-green-400" />
      </div>
      {/* `srcDoc` recebe o HTML como texto. `sandbox` sem permissões bloqueia scripts, por segurança */}
      <iframe title="Preview da landing page" srcDoc={html} sandbox="" className="w-full flex-1" />
    </div>
  )
}
