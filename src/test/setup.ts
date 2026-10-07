import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Desmonta o que foi renderizado em um teste antes do próximo começar
afterEach(() => {
  cleanup()
})
