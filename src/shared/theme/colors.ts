export type IconTone = 'indigo' | 'orange' | 'teal' | 'pink' | 'blue' | 'green'

// Accent pairs for icon tiles: a saturated badge colour and a soft tint for the tile behind it.
export type ToneColors = Record<IconTone, { solid: string; soft: string }>

export type MobileColors = {
  background: string
  border: string
  danger: string
  dangerBackground: string
  onDanger: string
  foreground: string
  muted: string
  primary: string
  primaryInk: string
  primarySoft: string
  onPrimary: string
  sidebar: string
  success: string
  successBackground: string
  successDot: string
  surface: string
  surfaceSubtle: string
  warning: string
  warningBackground: string
  white: string
  tones: ToneColors
}

export const mobileColors: MobileColors = {
  background: '#f3f5fa',
  border: '#e2e5ef',
  danger: '#b42630',
  dangerBackground: '#fbe8e9',
  onDanger: '#ffffff',
  foreground: '#232741',
  muted: '#646887',
  primary: '#5546b0',
  primaryInk: '#43378f',
  primarySoft: '#ecebfa',
  onPrimary: '#ffffff',
  sidebar: '#ffffff',
  success: '#13704a',
  successBackground: '#e3f4ec',
  successDot: '#2fa36b',
  surface: '#ffffff',
  surfaceSubtle: '#f5f6fb',
  warning: '#8a4b00',
  warningBackground: '#fdf0d8',
  white: '#ffffff',
  tones: {
    indigo: { solid: '#6a5ae0', soft: '#eeecfd' },
    orange: { solid: '#f07a2c', soft: '#fff1e6' },
    teal: { solid: '#14a3a8', soft: '#e3f7f6' },
    pink: { solid: '#e2557f', soft: '#fdebf1' },
    blue: { solid: '#3f7fea', soft: '#e8f0fe' },
    green: { solid: '#2f9e6a', soft: '#e4f5ec' }
  }
}

export const darkMobileColors: MobileColors = {
  background: '#05162a',
  border: '#1b3553',
  danger: '#f04850',
  dangerBackground: '#3d1f27',
  onDanger: '#05162a',
  foreground: '#f8fcff',
  muted: '#a8b8cc',
  primary: '#2888ff',
  primaryInk: '#6cb2ff',
  primarySoft: '#103870',
  onPrimary: '#05162a',
  sidebar: '#011226',
  success: '#10b8c0',
  successBackground: '#103d3d',
  successDot: '#10b8c0',
  surface: '#0d1c33',
  surfaceSubtle: '#102440',
  warning: '#f0a830',
  warningBackground: '#342711',
  white: '#0d1c33',
  tones: {
    indigo: { solid: '#7d6ff0', soft: '#1d1d4a' },
    orange: { solid: '#f58a3d', soft: '#3a2414' },
    teal: { solid: '#22b8bd', soft: '#0f3236' },
    pink: { solid: '#ef6b93', soft: '#3a1a28' },
    blue: { solid: '#4f8ff5', soft: '#12284a' },
    green: { solid: '#3cb47b', soft: '#113526' }
  }
}
