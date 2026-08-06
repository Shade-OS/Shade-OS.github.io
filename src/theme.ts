export type Theme = 'dark' | 'light'

const KEY = 'shadeos-theme'

const BG: Record<Theme, string> = {
  dark: '#000000',
  light: '#f2f1f7',
}

/** index.html'deki başlangıç betiği temayı zaten yazdı; buradan okuyoruz. */
export function readTheme(): Theme {
  return document.documentElement.dataset['theme'] === 'light' ? 'light' : 'dark'
}

export function applyTheme(theme: Theme) {
  document.documentElement.dataset['theme'] = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* localStorage kapalı olabilir — tema yine de uygulanır */
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', BG[theme])
}
