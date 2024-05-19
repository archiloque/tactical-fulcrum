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
