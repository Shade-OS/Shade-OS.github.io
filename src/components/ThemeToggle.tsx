import { useEffect, useState, type ReactElement } from 'react'

import { applyTheme, readTheme, type Theme } from '../theme.ts'

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.95 3.05l-1.13 1.13M4.18 11.82l-1.13 1.13M12.95 12.95l-1.13-1.13M4.18 4.18 3.05 3.05"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  )
}

type Option = { value: Theme; label: string; Icon: () => ReactElement }

const OPTIONS: readonly Option[] = [
  { value: 'dark', label: 'Koyu tema', Icon: MoonIcon },
  { value: 'light', label: 'Açık tema', Icon: SunIcon },
]

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')

  // İlk render'da DOM'daki gerçek temayla eşitlen (SSR/hydration uyumsuzluğu olmasın).
  useEffect(() => setTheme(readTheme()), [])

  function pick(next: Theme) {
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="themer" role="group" aria-label="Tema seçimi">
      <span className="themer__pill" aria-hidden="true" />
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={theme === value}
          data-active={theme === value}
          onClick={() => pick(value)}
        >
          <Icon />
        </button>
      ))}
    </div>
  )
}
