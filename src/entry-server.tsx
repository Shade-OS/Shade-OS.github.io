import { renderToString } from 'react-dom/server'

import { App } from './App.tsx'

/** Derleme sonrası scripts/prerender.mjs tarafından çağrılır. */
export function render() {
  return renderToString(<App />)
}
