import type { ReactNode } from 'react'
import type { Background } from '../types'

// Componentes de campo reutilizáveis. Todos são "controlados":
// recebem o `value` atual por props e avisam a mudança via `onChange`,
// sem guardar estado próprio. Quem guarda o estado é o App.

const labelClass = 'block text-sm font-medium text-gray-700'
const inputClass =
  'mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500'

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4">
      <legend className="px-1 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </legend>
      {children}
    </fieldset>
  )
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: FieldProps & { type?: 'text' | 'url'; placeholder?: string }) {
  return (
    <label className={labelClass}>
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  )
}

export function TextAreaField({ label, value, onChange }: FieldProps) {
  return (
    <label className={labelClass}>
      {label}
      <textarea
        value={value}
        rows={3}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      />
    </label>
  )
}

export function ColorField({ label, value, onChange }: FieldProps) {
  return (
    <label className={`${labelClass} flex items-center justify-between`}>
      {label}
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 w-14 cursor-pointer rounded border border-gray-300"
      />
    </label>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: FieldProps & { options: { label: string; value: string }[] }) {
  return (
    <label className={labelClass}>
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

// Campo opcional: um input vazio vira `undefined`, ou seja, "sem imagem".
function ImageUrlField({
  value,
  onChange,
}: {
  value: string | undefined
  onChange: (value: string | undefined) => void
}) {
  return (
    <TextField
      label="URL da imagem de fundo (opcional)"
      type="url"
      placeholder="https://..."
      value={value ?? ''}
      onChange={(url) => onChange(url || undefined)}
    />
  )
}

// Fundo de uma seção: cor sempre presente + imagem opcional por cima
export function BackgroundField({
  value,
  onChange,
}: {
  value: Background
  onChange: (value: Background) => void
}) {
  return (
    <fieldset className="space-y-3">
      <legend className={labelClass}>Fundo</legend>
      <ColorField
        label="Cor de fundo"
        value={value.color}
        onChange={(color) => onChange({ ...value, color })}
      />
      <ImageUrlField
        value={value.image}
        onChange={(image) => onChange({ ...value, image })}
      />
    </fieldset>
  )
}
