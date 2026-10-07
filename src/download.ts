// Faz o navegador baixar um texto como arquivo, sem precisar de servidor:
// 1. Cria um Blob (um "arquivo em memória") com o conteúdo.
// 2. Gera uma URL temporária apontando para ele (blob:http://...).
// 3. Cria um <a download="nome.html"> invisível e "clica" nele.
// 4. Libera a URL temporária para não ocupar memória.
export function downloadHtml(html: string, fileName: string) {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()

  // Espera o clique ser processado antes de liberar a URL
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

// "Padaria do João!" → "padaria-do-joao.html"
export function toFileName(title: string): string {
  const slug = title
    .normalize('NFD') // separa letras dos acentos: "ã" → "a" + "~"
    .replace(/[̀-ͯ]/g, '') // remove os acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // qualquer coisa que não seja letra/número vira "-"
    .replace(/^-+|-+$/g, '') // tira "-" do começo e do fim

  return `${slug || 'landing-page'}.html`
}
