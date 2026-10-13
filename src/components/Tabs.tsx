import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export type Tab = {
  id: string
  label: string
  content: ReactNode
}

// Abas acessíveis, seguindo o padrão WAI-ARIA "Tabs":
// - role="tablist" / "tab" / "tabpanel" dizem aos leitores de tela que isto são abas
// - aria-selected marca a aba ativa; aria-controls / aria-labelledby ligam aba ↔ painel
// - Teclado: Tab entra na lista de abas, ← → trocam de aba, Home/End vão para a primeira/última
export function Tabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  // Qual aba está aberta é um estado só de interface: ninguém fora daqui precisa saber,
  // então ele mora aqui dentro, e não no App (diferente do `config`).
  const [activeId, setActiveId] = useState(tabs[0].id)
  const baseId = useId()
  // Referências aos botões, para mover o foco com o teclado
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(event: KeyboardEvent, index: number) {
    const last = tabs.length - 1
    const keyToIndex: Partial<Record<string, number>> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }
    const nextIndex = keyToIndex[event.key]
    if (nextIndex === undefined) return

    event.preventDefault()
    setActiveId(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="tab-list">
        {tabs.map((tab, index) => {
          const selected = tab.id === activeId
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${tab.id}`}
              // Só a aba ativa entra na ordem do Tab; as outras se alcança com as setas
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="tab"
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Todos os painéis ficam montados; os inativos só ficam escondidos (`hidden`) */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className="tab-panel space-y-4"
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}
