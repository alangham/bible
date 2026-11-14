let cached: boolean | undefined

/** True when the browser can make a WebGL context. The test runs once; the test context is released. */
export function hasWebGL(): boolean {
  if (cached === undefined) {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl')
      cached = Boolean(gl)
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
    } catch {
      cached = false
    }
  }
  return cached
}
