import {Editor} from "../../editor";
import {Tabs} from "./main-menu";
import {Enemy} from "../data/enemy";
import {effect, Signal, signal} from '@preact/signals-core';
import {html, reactive} from 'uhtml/reactive';

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
                    <sl-option value="option-1">Burgeoner</sl-option>
                    <sl-option value="option-2">Fighter</sl-option>
                    <sl-option value="option-3">Ranger</sl-option>
                    <sl-option value="option-4">Shadow</sl-option>
                    <sl-option value="option-5">Slasher</sl-option>
                </sl-select>
                <sl-input placeholder="Level"></sl-input>
                <sl-input placeholder="Name"></sl-input>
                <sl-input placeholder="HP"></sl-input>
                <sl-input placeholder="Atk"></sl-input>
                <sl-input placeholder="Def"></sl-input>
                <sl-input placeholder="Exp"></sl-input>
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
                <sl-tag variant="neutral" size="large">Level</sl-tag>
                <sl-tag variant="neutral" size="large">Name</sl-tag>
                <sl-tag variant="neutral" size="large">HP</sl-tag>
                <sl-tag variant="neutral" size="large">Atk</sl-tag>
                <sl-tag variant="neutral" size="large">def</sl-tag>
                <sl-tag variant="neutral" size="large">Exp</sl-tag>
                <sl-tag variant="neutral" class="tabEnemyDelete" size="large">Delete</sl-tag>
            </div>
            ${this.enemySignal.value.map((enemy, enemyIndex) => this.line(enemy, enemyIndex))}
            <div id="tabEnemiesAddButtonDiv">
                <sl-button onclick="${this.addEnemy}" id="tabEnemiesAddButton" class="add">
                    <sl-icon name="plus-circle"></sl-icon>
                </sl-button>
            </div>
        `);
    }

    private addEnemy = () => {
        console.debug('TabEnemies add enemy');
        this.enemySignal.value = [...this.enemySignal.value, new Enemy()];
    }
    private deleteEnemy = (event: PointerEvent) => {
        // @ts-ignore
        const enemyIndex = event.currentTarget.dataset.index;
        console.debug('TabEnemies delete enemy', enemyIndex);
    }
}