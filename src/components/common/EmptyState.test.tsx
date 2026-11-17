/// <reference types="@testing-library/jest-dom/vitest" />
import { render, screen } from '@testing-library/react'
import { EmptyState } from './EmptyState'
import { Home } from 'lucide-react'

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState icon={Home} title="Sin datos" description="No hay nada aquí" />)
    expect(screen.getByText('Sin datos')).toBeInTheDocument()
    expect(screen.getByText('No hay nada aquí')).toBeInTheDocument()
  })

  it('renders action button when provided', () => {
    const onAction = vi.fn()
    render(<EmptyState icon={Home} title="Sin datos" description="No hay nada" actionLabel="Crear" onAction={onAction} />)
    expect(screen.getByText('Crear')).toBeInTheDocument()
  })

  it('does not render action button when not provided', () => {
    render(<EmptyState icon={Home} title="Sin datos" description="No hay nada" />)
    expect(screen.queryByText('Crear')).not.toBeInTheDocument()
  })
})