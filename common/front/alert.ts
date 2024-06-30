import '@shoelace-style/shoelace/dist/components/alert/alert.js'
import SlAlert from '@shoelace-style/shoelace/cdn/components/alert/alert.component'

export const enum AlertVariant {
  primary = 'primary',
  success = 'success',
  neutral = 'neutral',
  warning = 'warning',
  danger = 'danger',
}

export async function showAlert(
  message: string,
  variant: AlertVariant = AlertVariant.primary,
  icon: string = 'info-circle',
  duration: number = 3000,
  closable: boolean = true,
): Promise<any> {
  const alert: SlAlert = Object.assign(document.createElement('sl-alert'), {
    variant,
    closable: closable,
    duration: duration,
    innerHTML: `
        <sl-icon name="${icon}" slot="icon"></sl-icon>
        ${message}
`,
  })
  document.body.append(alert)
  return alert.toast()
}
