export function decodeSvg(content: string): string {
  return `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" ${content}</svg>`)}`
}
