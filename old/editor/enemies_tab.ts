import {Application, Container, Graphics, Text} from "pixi.js";
import {Color, Heights, STANDARD_TEXT_STYLE} from "./constants";
import {Input, Select} from "@pixi/ui";
import {ENEMY_TYPES} from "./enemy_types";

export class EnemiesTab {
    app: Application;

    static readonly COMPONENT_HEIGHT: number = 40;
    static readonly ENEMIES_TYPE_LIST_WIDTH: number = 175;
    static readonly INPUT_WIDTH: number = 100;
    static readonly INPUT_PADDING: number = 10;

    constructor(app: Application) {
        this.app = app;

        const topLine = this.createTopLine();
        this.app.stage.addChild(topLine);
        const line = this.createLine(0);
        this.app.stage.addChild(line);
    }

    private createTopLine(): Container<any> {
        const container: Container = new Container({position: {x: 10, y: Heights.menu + Heights.title + 5}});
        this.createHeaderText(container, 'Type', 0, EnemiesTab.ENEMIES_TYPE_LIST_WIDTH);
        let currentX: number = EnemiesTab.ENEMIES_TYPE_LIST_WIDTH - EnemiesTab.INPUT_BORDER;
        this.createHeaderText(container, 'Level', currentX, EnemiesTab.INPUT_WIDTH);
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        this.createHeaderText(container, 'HP', currentX, EnemiesTab.INPUT_WIDTH);
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        this.createHeaderText(container, 'Atk', currentX, EnemiesTab.INPUT_WIDTH);
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        this.createHeaderText(container, 'Def', currentX, EnemiesTab.INPUT_WIDTH);
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        this.createHeaderText(container, 'Exp', currentX, EnemiesTab.INPUT_WIDTH);
        return container;
    }

    private createHeaderText(container: Container, textValue: string, x: number, width: number) {
        let graphics = this.createInputGraphic(width);
        graphics.x = x
        container.addChild(graphics);
        const text: Text = new Text({text: textValue, style: STANDARD_TEXT_STYLE});
        text.anchor.set(0.5);
        text.x = x + width - EnemiesTab.INPUT_PADDING - text.width / 2;
        text.y = EnemiesTab.COMPONENT_HEIGHT / 2;
        container.addChild(text)
    }

    private createLine(index: number): Container {
        const container: Container = new Container({
            position: {
                x: 10,
                y: Heights.menu + Heights.title + 5 + ((EnemiesTab.COMPONENT_HEIGHT - EnemiesTab.INPUT_BORDER) * (index + 1))
            }
        });

        const enemyTypes = this.createEnemyTypes();
        container.addChild(enemyTypes);

        const levelInput = this.createInput('Level');
        let currentX: number = EnemiesTab.ENEMIES_TYPE_LIST_WIDTH - EnemiesTab.INPUT_BORDER;
        levelInput.x = currentX;
        container.addChild(levelInput)

        const hpInput: Input = this.createInput('HP');
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        hpInput.x = currentX;
        container.addChild(hpInput)

        const atkInput: Input = this.createInput('Atk');
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        atkInput.x = currentX;
        container.addChild(atkInput)

        const defInput: Input = this.createInput('Def');
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        defInput.x = currentX;
        container.addChild(defInput)

        const expInput: Input = this.createInput('Exp');
        currentX += EnemiesTab.INPUT_WIDTH - EnemiesTab.INPUT_BORDER;
        expInput.x = currentX;
        container.addChild(expInput)
        return container;
    }

    private createInput(placeholder: string) {
        const graphics: Graphics = this.createInputGraphic(EnemiesTab.INPUT_WIDTH);
        return new Input({
            bg: graphics,
            textStyle: STANDARD_TEXT_STYLE,
            padding: EnemiesTab.INPUT_PADDING,
            maxLength: 5,
            placeholder: placeholder,
            value: '',
            align: 'right',
        });
    }

    private static readonly INPUT_BORDER: number = 2;

    private createInputGraphic(width: number) {
        return new Graphics()
            .rect(0, 0, width, EnemiesTab.COMPONENT_HEIGHT)
            .fill(Color.backgroundSelected)
            .rect(EnemiesTab.INPUT_BORDER, EnemiesTab.INPUT_BORDER, width - (EnemiesTab.INPUT_BORDER * 2), EnemiesTab.COMPONENT_HEIGHT - (EnemiesTab.INPUT_BORDER * 2))
            .fill(Color.backgroundStandard);
    }

    private createEnemyTypes(): Select {
        return new Select({
            textStyle: STANDARD_TEXT_STYLE,
            openBG: this.createEnemyTypeBackGround('↑'),
            closedBG: this.createEnemyTypeBackGround('↓'),
            items: {
                items: ENEMY_TYPES,
                width: EnemiesTab.ENEMIES_TYPE_LIST_WIDTH,
                height: EnemiesTab.COMPONENT_HEIGHT,
                backgroundColor: Color.backgroundStandard,
                textStyle: STANDARD_TEXT_STYLE,
                hoverColor: Color.backgroundSelected,
                radius: 0,
            }
        });
    }

    private createEnemyTypeBackGround(symbol: string): Container {
        const text: Text = new Text({text: symbol, style: STANDARD_TEXT_STYLE});
        text.x = EnemiesTab.ENEMIES_TYPE_LIST_WIDTH - 25;
        text.y = (EnemiesTab.COMPONENT_HEIGHT - text.height) / 2
        const container: Container = new Container()
        container.addChild(this.createInputGraphic(EnemiesTab.ENEMIES_TYPE_LIST_WIDTH), text)
        return container;
    }
}