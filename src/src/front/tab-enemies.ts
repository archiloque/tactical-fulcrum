import {Editor} from "../../editor";
import {Tabs} from "./main-menu";
import {Enemy} from "../data/enemy";
import {effect, Signal, signal} from '@preact/signals-core';
import {html, reactive} from 'uhtml/reactive';
import {ENEMY_TYPES} from "../data/enemy_types";

export class TabEnemies {
    private readonly editor: Editor;
    private readonly tabElement: HTMLElement;
    private readonly enemySignal: Signal<Enemy[]>;

    constructor(editor: Editor) {
        this.editor = editor;
        this.tabElement = document.getElementById(Tabs.enemies);
        this.enemySignal = signal(this.editor.tower.enemies);
    }

    private line(enemy: Enemy, enemyIndex: number): string {
        return html`
            <div class="enemyLine">
                <sl-select class="type" placeholder="Type" hoist>
                    ${ENEMY_TYPES.map((enemyType: string) => html`
                        <sl-option value="${enemyType}">${enemyType}</sl-option>`)}
                </sl-select>
                <sl-input class="tabEnemyLevel" type="number" min="0" placeholder="Lv"
                          value="${enemy.level}"></sl-input>
                <sl-input class="tabEnemyName" type="text" placeholder="Name" value="${enemy.name}"></sl-input>
                <sl-input type="number" min="0" placeholder="HP" value="${enemy.hp}"></sl-input>
                <sl-input type="number" min="0" placeholder="Atk" value="${enemy.atk}"></sl-input>
                <sl-input type="number" min="0" placeholder="Def" value="${enemy.def}"></sl-input>
                <sl-input type="number" min="0" placeholder="Exp" value="${enemy.exp}"></sl-input>
                <sl-button data-index="${enemyIndex}" onclick="${this.deleteEnemy}" variant="danger"
                           class="tabEnemyDelete">
                    <sl-icon name="trash"></sl-icon>
                </sl-button>
            </div>`;
    }

    public show(): void {
        console.debug('TabEnemies showing');
        const render = reactive(effect);

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
            ${this.enemySignal.value.map((enemy: Enemy, enemyIndex: number) => this.line(enemy, enemyIndex))}
            <div id="tabEnemiesAddButtonDiv">
                <sl-button onclick="${this.addEnemy}" id="tabEnemiesAddButton" class="add">
                    <sl-icon name="plus-circle"></sl-icon>
                </sl-button>
            </div>
        `);
    }

    private addEnemy = (): void => {
        console.debug('TabEnemies add enemy');
        this.enemySignal.value = [...this.enemySignal.value, new Enemy()];
        console.log(this.enemySignal.value)
    }
    private deleteEnemy = (event: PointerEvent): void => {
        // @ts-ignore
        const enemyIndex = event.currentTarget.dataset.index;
        console.debug('TabEnemies delete enemy', enemyIndex);
    }
}