// Tipos que descrevem tudo o que o cliente pode configurar na landing page.
// O formulário edita um objeto `LandingPageConfig`; a preview e o download vão ler esse mesmo objeto.

// A cor é obrigatória; a imagem é opcional (o `?` indica isso).
// Quando há imagem, ela cobre a cor. Sem imagem (ou se ela não carregar), vale a cor.
export type Background = {
  color: string
  image?: string
}

export type HeaderConfig = {
  title: string
  text: string
  textColor: string
  font: string
  background: Background
}

export type BodyConfig = {
  title: string
  text: string
  background: Background
}

export type FooterConfig = {
  text: string
  background: Background
}

export type LandingPageConfig = {
  header: HeaderConfig
  body: BodyConfig
  footer: FooterConfig
}
