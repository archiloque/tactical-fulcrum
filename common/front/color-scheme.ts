export const enum ColorScheme {
  dark = "dark",
  light = "light",
}

export function currentColorScheme(): ColorScheme {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return ColorScheme.dark
  } else {
    return ColorScheme.light
  }
}

export function getCssProperty(propertyName: string): string {
  return getComputedStyle(document.body).getPropertyValue(propertyName)
}

export function getBackgroundColor(): string {
  return getCssProperty("--sl-color-neutral-50")
}

export function getColor(): string {
  return getCssProperty("--sl-color-neutral-950")
}
