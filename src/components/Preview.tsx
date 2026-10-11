// Mostra a landing page dentro de um <iframe>, como se fosse uma janela de navegador.
// O iframe é um documento separado: o CSS do nosso app (Tailwind) não vaza pra dentro dele
// e o CSS da landing page não vaza pra fora. Assim a preview fica igual ao arquivo baixado.
export function Preview({ html }: { html: string }) {
  return (
    <div className="preview-window flex h-full flex-col overflow-hidden rounded-lg border bg-white shadow-lg">
      {/* Barra decorativa imitando uma janela de navegador */}
      <div className="browser-chrome flex gap-2 px-4 py-3" aria-hidden="true">
        <span className="browser-dot browser-dot-red size-3 rounded-full" />
        <span className="browser-dot browser-dot-yellow size-3 rounded-full" />
        <span className="browser-dot browser-dot-green size-3 rounded-full" />
        <span className="browser-address">sua página</span>
      </div>
      {/* `srcDoc` recebe o HTML como texto. `sandbox` sem permissões bloqueia scripts, por segurança */}
      <iframe title="Preview da landing page" srcDoc={html} sandbox="" className="preview-frame w-full flex-1" />
    </div>
  )
}
