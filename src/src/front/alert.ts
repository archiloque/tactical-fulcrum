import { SlAlert } from "@shoelace-style/shoelace"

export async function showAlert(
  message: string,
  variant: string = "primary",
  icon: string = "info-circle",
  duration: number = 3000,
  closable: boolean = true,
): Promise<any> {
  const alert: SlAlert = Object.assign(document.createElement("sl-alert"), {
    variant,
    closable: closable,
    duration: duration,
    innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${message}
`,
  })
  document.body.append(alert)
  await alert.toast()
}
