import { Component, type ReactNode } from 'react'

interface Props {
  onError: () => void
  children: ReactNode
}

/** Catches an error in the 3D scene, for example a lost WebGL context, so the flat spines show. */
export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
