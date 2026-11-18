import { describe, it, expect, vi } from 'vitest'
import axios from 'axios'
import { getErrorMessage } from './api'

describe('getErrorMessage', () => {
  it('returns backend message when present', () => {
    const error = {
      isAxiosError: true,
      response: { status: 400, data: { message: 'Email ya registrado' } },
    } as any
    // Mock axios.isAxiosError
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
    expect(getErrorMessage(error)).toBe('Email ya registrado')
  })

  it('returns generic message for 404', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
    const error = { response: { status: 404, data: {} } } as any
    expect(getErrorMessage(error)).toBe('Recurso no encontrado.')
  })

  it('returns generic message for 401', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
    const error = { response: { status: 401, data: {} } } as any
    expect(getErrorMessage(error)).toBe('Tu sesión ha expirado. Inicia sesión nuevamente.')
  })

  it('returns network error when no response', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(true)
    const error = { response: undefined } as any
    expect(getErrorMessage(error)).toBe('Sin conexión con el servidor. Intenta de nuevo.')
  })

  it('returns Error.message for non-axios errors', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)
    const error = new Error('Something broke')
    expect(getErrorMessage(error)).toBe('Something broke')
  })

  it('returns fallback for unknown errors', () => {
    vi.spyOn(axios, 'isAxiosError').mockReturnValue(false)
    expect(getErrorMessage(42)).toBe('Ocurrió un error inesperado.')
  })
})
