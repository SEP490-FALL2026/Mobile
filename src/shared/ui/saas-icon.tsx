import Svg, { Path } from 'react-native-svg'

import { type SaasIconName, saasIcons } from './saas-icons.generated'

export type { SaasIconName } from './saas-icons.generated'

interface SaasIconProps {
  name: SaasIconName
  color: string
  size?: number
  variant?: 'duotone' | 'fill'
}

// Decorative product icon (Phosphor set), recoloured through `color`. Always hidden from screen readers: the
// control or text next to it carries the meaning.
export function SaasIcon({ name, color, size = 24, variant = 'duotone' }: SaasIconProps) {
  return (
    <Svg
      accessibilityElementsHidden
      color={color}
      height={size}
      importantForAccessibility='no-hide-descendants'
      viewBox='0 0 256 256'
      width={size}
    >
      {saasIcons[name][variant].map((path, index) => (
        <Path d={path.d} fill='currentColor' key={index} opacity={'opacity' in path ? path.opacity : 1} />
      ))}
    </Svg>
  )
}
