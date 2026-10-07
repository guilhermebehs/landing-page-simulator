import { FONT_OPTIONS } from '../defaultConfig'
import type { BodyConfig, FooterConfig, HeaderConfig, LandingPageConfig } from '../types'
import {
  BackgroundField,
  ColorField,
  ImageUrlField,
  Section,
  SelectField,
  TextAreaField,
  TextField,
} from './fields'

type LandingPageFormProps = {
  config: LandingPageConfig
  onChange: (config: LandingPageConfig) => void
}

export function LandingPageForm({ config, onChange }: LandingPageFormProps) {
  // No React, nunca alteramos o objeto de estado diretamente (config.header.title = 'x').
  // Criamos um objeto NOVO com o spread (`...`), copiando o que não mudou
  // e sobrescrevendo só o que mudou. É assim que o React percebe a mudança e re-renderiza.
  function updateHeader(changes: Partial<HeaderConfig>) {
    onChange({ ...config, header: { ...config.header, ...changes } })
  }

  function updateBody(changes: Partial<BodyConfig>) {
    onChange({ ...config, body: { ...config.body, ...changes } })
  }

  function updateFooter(changes: Partial<FooterConfig>) {
    onChange({ ...config, footer: { ...config.footer, ...changes } })
  }

  return (
    // O formulário não é "enviado" para lugar nenhum; evitamos o reload da página no Enter
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <Section title="Header">
        <TextField
          label="Título"
          value={config.header.title}
          onChange={(title) => updateHeader({ title })}
        />
        <TextAreaField
          label="Texto"
          value={config.header.text}
          onChange={(text) => updateHeader({ text })}
        />
        <ColorField
          label="Cor do texto"
          value={config.header.textColor}
          onChange={(textColor) => updateHeader({ textColor })}
        />
        <SelectField
          label="Fonte"
          value={config.header.font}
          options={FONT_OPTIONS}
          onChange={(font) => updateHeader({ font })}
        />
        <ImageUrlField
          value={config.header.backgroundImage}
          onChange={(backgroundImage) => updateHeader({ backgroundImage })}
        />
      </Section>

      <Section title="Body">
        <TextField
          label="Título"
          value={config.body.title}
          onChange={(title) => updateBody({ title })}
        />
        <TextAreaField
          label="Texto"
          value={config.body.text}
          onChange={(text) => updateBody({ text })}
        />
        <BackgroundField
          value={config.body.background}
          onChange={(background) => updateBody({ background })}
        />
      </Section>

      <Section title="Footer">
        <TextAreaField
          label="Texto"
          value={config.footer.text}
          onChange={(text) => updateFooter({ text })}
        />
        <BackgroundField
          value={config.footer.background}
          onChange={(background) => updateFooter({ background })}
        />
      </Section>
    </form>
  )
}
