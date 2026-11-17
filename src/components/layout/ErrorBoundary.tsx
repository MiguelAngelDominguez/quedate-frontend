import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface Props { children: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl p-6">
          <Alert variant="destructive">
            <AlertTitle>Algo salió mal</AlertTitle>
            <AlertDescription>{this.state.message || 'Error inesperado de renderizado.'}</AlertDescription>
          </Alert>
          <Button className="mt-4" onClick={() => this.setState({ hasError: false, message: '' })}>
            Reintentar
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}