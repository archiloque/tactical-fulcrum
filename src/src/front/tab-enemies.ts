import {Editor} from '../../editor'
import {Tabs} from './main-menu'
import {Enemy} from '../data/enemy'
import {effect, Signal, signal} from '@preact/signals-core'
import {html, reactive} from 'uhtml/reactive'
import {Enemy_type} from '../data/enemy_type'

export class TabEnemies {
    private readonly editor: Editor
    private readonly tabElement: HTMLElement
    private readonly enemySignal: Signal<Enemy[]>

    constructor(editor: Editor) {
        this.editor = editor
        this.tabElement = document.getElementById(Tabs.enemies)
        this.enemySignal = signal(this.editor.tower.enemies)
    }

    private renderEnemy(enemySignal: Signal<Enemy>, enemyIndex: number): string {
        return html`
            <div class="enemyLine">
                <sl-select class="type" placeholder="Type" hoist>
                    ${Enemy_type.map((enemyType: string) => html`
                        <sl-option value="${enemyType}">${enemyType}</sl-option>`)}
                </sl-select>
                <sl-input class="tabEnemyLevel" type="number" min="0" placeholder="Lv"
                          value="${enemySignal.value.level}"></sl-input>
                <sl-input class="tabEnemyName" type="text" placeholder="Name"
                          value="${enemySignal.value.name}"></sl-input>
                <sl-input type="number" min="0" placeholder="HP" value="${enemySignal.value.hp}"></sl-input>
                <sl-input type="number" min="0" placeholder="Atk" value="${enemySignal.value.atk}"></sl-input>
                <sl-input type="number" min="0" placeholder="Def" value="${enemySignal.value.def}"></sl-input>
                <sl-input type="number" min="0" placeholder="Exp" value="${enemySignal.value.exp}"></sl-input>
                <sl-button data-index="${enemyIndex}" onclick="${this.deleteEnemy}" variant="danger"
                           class="tabEnemyDelete">
                    <sl-icon name="trash"></sl-icon>
                </sl-button>
            </div>`
    }

    public render(): void {
        console.debug('TabEnemies showing')
        const render = reactive(effect)
        const enemiesSignals = this.enemySignal.value.map((enemy: Enemy) => signal(enemy))

        render(this.tabElement, () => html`
            <div class="enemyLine">
                <sl-tag class="type" variant="neutral" size="large">Type</sl-tag>
                <sl-tag variant="neutral" class="tabEnemyLevel" size="large">Lv</sl-tag>
                <sl-tag variant="neutral" class="tabEnemyName" size="large">Name</sl-tag>
                <sl-tag variant="neutral" size="large">HP</sl-tag>
                <sl-tag variant="neutral" size="large">Atk</sl-tag>
                <sl-tag variant="neutral" size="large">def</sl-tag>
                <sl-tag variant="neutral" size="large">Exp</sl-tag>
                <sl-tag variant="neutral" class="tabEnemyDelete" size="large">Delete</sl-tag>
            </div>
            ${enemiesSignals.map((enemy: Signal<Enemy>, enemyIndex: number) => this.renderEnemy(enemy, enemyIndex))}
            <div id="tabEnemiesAddButtonDiv">
                <sl-button onclick="${this.addEnemy}" id="tabEnemiesAddButton" class="add">
                    <sl-icon name="plus-circle"></sl-icon>
                </sl-button>
            </div>
        `)
    }

    private addEnemy = (): void => {
        console.debug('TabEnemies add enemy')
        this.enemySignal.value = [...this.enemySignal.value, new Enemy()]
        console.log(this.enemySignal.value)
    }

    private deleteEnemy = (event: PointerEvent): void => {
        // @ts-expect-error because
        const enemyIndex = event.currentTarget.dataset.index
        console.debug('TabEnemies delete enemy', enemyIndex)
    }
}
