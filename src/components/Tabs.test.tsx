import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs } from './Tabs'

function renderTabs() {
  render(
    <Tabs
      label="Seções"
      tabs={[
        { id: 'a', label: 'Primeira', content: <p>Conteúdo A</p> },
        { id: 'b', label: 'Segunda', content: <p>Conteúdo B</p> },
        { id: 'c', label: 'Terceira', content: <p>Conteúdo C</p> },
      ]}
    />,
  )
}

describe('Tabs', () => {
  it('starts on the first tab and shows only its panel', () => {
    renderTabs()

    expect(screen.getByRole('tablist', { name: 'Seções' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Primeira' })).toHaveTextContent('Conteúdo A')
    expect(screen.getByText('Conteúdo B')).not.toBeVisible()
  })

  it('switches panels on click', async () => {
    const user = userEvent.setup()
    renderTabs()

    await user.click(screen.getByRole('tab', { name: 'Segunda' }))

    expect(screen.getByRole('tab', { name: 'Segunda' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText('Conteúdo B')).toBeVisible()
    expect(screen.getByText('Conteúdo A')).not.toBeVisible()
  })

  it('moves between tabs with the arrow keys, wrapping around', async () => {
    const user = userEvent.setup()
    renderTabs()

    // Tab coloca o foco na aba ativa; as setas fazem o resto
    await user.tab()
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('tab', { name: 'Terceira' })).toHaveFocus()
    expect(screen.getByText('Conteúdo C')).toBeVisible()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveFocus()

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Terceira' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('tab', { name: 'Primeira' })).toHaveFocus()
    expect(screen.getByText('Conteúdo A')).toBeVisible()
  })

  it('keeps only the active tab in the Tab order', () => {
    renderTabs()

    const [first, second, third] = screen.getAllByRole('tab')
    expect(first).toHaveAttribute('tabindex', '0')
    expect(second).toHaveAttribute('tabindex', '-1')
    expect(third).toHaveAttribute('tabindex', '-1')
  })
})
