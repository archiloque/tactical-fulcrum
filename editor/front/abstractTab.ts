import { Hole, html } from "uhtml"
import SlInput from "@shoelace-style/shoelace/cdn/components/input/input.component"

export abstract class AbstractTab {
  protected tag(text: string, className: string | null = null): Hole {
    return html` <sl-tag variant="neutral" class="${className}" size="large">${text}</sl-tag>`
  }

  protected numberInput(
    value: number,
    callback: (event: CustomEvent) => void,
    min: number,
    placeHolder: string,
    className: string | null = null,
  ): Hole {
    return html` <sl-input
      @sl-input="${callback}"
      class="${className}"
      type="number"
      min="${min}"
      pattern="[0-9]+"
      placeholder="${placeHolder}"
      no-spin-buttons
      value="${value}"
      required
    ></sl-input>`
  }

  protected getInputValueInt = (event: CustomEvent): [number, number | null] => {
    const [enemyIndex, stringValue] = this.getInputValue(event)
    const value: number = parseInt(stringValue)
    return [enemyIndex, isNaN(value) ? null : value]
  }

  protected getInputValue = (event: CustomEvent): [number, string] => {
    const currentTarget = event.currentTarget as SlInput
    const enemyIndex = parseInt((currentTarget.parentElement as HTMLElement).dataset.index)
    return [enemyIndex, currentTarget.value]
  }
}
