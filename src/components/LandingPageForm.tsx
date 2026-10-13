import { FONT_OPTIONS } from '../defaultConfig'
import type { BodyConfig, FooterConfig, HeaderConfig, LandingPageConfig } from '../types'
import {
  BackgroundField,
  ColorField,
  SelectField,
  TextAreaField,
  TextField,
} from './fields'
import { Tabs } from './Tabs'

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
    <form onSubmit={(event) => event.preventDefault()}>
      <Tabs
        label="Seções da landing page"
        tabs={[
          {
            id: 'header',
            label: 'Cabeçalho',
            content: (
              <>
                <TextField
                  label="Título"
                  value={config.header.title}
                  onChange={(title) => updateHeader({ title })}
                />
                <TextField
                  label="URL do logo (opcional)"
                  type="url"
                  placeholder="https://..."
                  value={config.header.logoUrl}
                  onChange={(logoUrl) => updateHeader({ logoUrl })}
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
                <BackgroundField
                  value={config.header.background}
                  onChange={(background) => updateHeader({ background })}
                />
              </>
            ),
          },
          {
            id: 'body',
            label: 'Corpo',
            content: (
              <>
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
              </>
            ),
          },
          {
            id: 'footer',
            label: 'Rodapé',
            content: (
              <>
                <TextAreaField
                  label="Texto"
                  value={config.footer.text}
                  onChange={(text) => updateFooter({ text })}
                />
                <TextField
                  label="Instagram (URL opcional)"
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={config.footer.socialLinks.instagram}
                  onChange={(instagram) =>
                    updateFooter({ socialLinks: { ...config.footer.socialLinks, instagram } })
                  }
                />
                <TextField
                  label="Facebook (URL opcional)"
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={config.footer.socialLinks.facebook}
                  onChange={(facebook) =>
                    updateFooter({ socialLinks: { ...config.footer.socialLinks, facebook } })
                  }
                />
                <TextField
                  label="LinkedIn (URL opcional)"
                  type="url"
                  placeholder="https://linkedin.com/..."
                  value={config.footer.socialLinks.linkedin}
                  onChange={(linkedin) =>
                    updateFooter({ socialLinks: { ...config.footer.socialLinks, linkedin } })
                  }
                />
                <TextField
                  label="WhatsApp (URL opcional)"
                  type="url"
                  placeholder="https://wa.me/..."
                  value={config.footer.socialLinks.whatsapp}
                  onChange={(whatsapp) =>
                    updateFooter({ socialLinks: { ...config.footer.socialLinks, whatsapp } })
                  }
                />
                <BackgroundField
                  value={config.footer.background}
                  onChange={(background) => updateFooter({ background })}
                />
              </>
            ),
          },
        ]}
      />
    </form>
  )
}
