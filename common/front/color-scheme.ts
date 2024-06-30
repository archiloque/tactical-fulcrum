export const enum ColorScheme {
  dark = "dark",
  light = "light",
}
export function getCssProperty(propertyName: string): string {
  return getComputedStyle(document.body).getPropertyValue(propertyName)
}

export function getBackgroundColor(): string {
  return getCssProperty("--sl-color-neutral-50")
}

export function getTextColor(): string {
  return getCssProperty("--sl-color-neutral-950")
}
