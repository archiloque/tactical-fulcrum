import {Application, Container, Graphics, Text, TextStyle} from 'pixi.js'
import {FancyButton} from '@pixi/ui';

import {
    EditorEvents,
    ElementState,
    Color,
    MONO_FONT, STANDARD_TEXT_STYLE, Heights,
} from './constants';

export enum ButtonList {
    Map = 0,
    Enemies = 1,
    Info = 2,
    __SIZE = 3,
}

export class Menu {
    private static readonly BUTTON_HOVER_TEXT_STYLE: TextStyle = new TextStyle({
        fontFamily: MONO_FONT,
        fontSize: 20,
        fill: Color.hover
    });
    app: Application

    constructor(app: Application) {
        this.app = app;
        const buttonWidth: number = this.app.renderer.width / ButtonList.__SIZE;
        const menuContainer: Container = new Container({position: {x: 0, y: Heights.title}});
        this.setupButton(menuContainer, buttonWidth, 'Map', ButtonList.Map);
        this.setupButton(menuContainer, buttonWidth, 'Info', ButtonList.Info);
        this.setupButton(menuContainer, buttonWidth, 'Enemies', ButtonList.Enemies);
        this.app.stage.addChild(menuContainer);
    }

    private createText(text: string, state: ElementState): Text {
        let style: TextStyle;
        switch (state) {
            case ElementState.default:
                style = STANDARD_TEXT_STYLE;
                break;
            case ElementState.hover:
                style = Menu.BUTTON_HOVER_TEXT_STYLE;
                break;
            case ElementState.selected:
                style = STANDARD_TEXT_STYLE;
                break;
        }
        const button = new Text({
            text: text,
            style: style
        });
        button.anchor.set(0.5);
        button.y = Heights.menu / 2;
        return button;
    }

    private createBackground(buttonWidth: number, state: ElementState): Graphics {
        let color: string;
        switch (state) {
            case ElementState.default:
                color = Color.backgroundStandard;
                break;
            case ElementState.hover:
                color = Color.backgroundStandard;
                break;
            case ElementState.selected:
                color = Color.backgroundSelected;
                break;

        }
        return new Graphics().rect(0, 0, buttonWidth, Heights.menu).fill(color);
    }

    private setupButton(menuContainer: Container, buttonWidth: number, text: string, button: ButtonList): void {
        const standardButtonBg = this.createBackground(buttonWidth, ElementState.default);
        const standardText = this.createText(text, ElementState.default);
        const standardView = new Container();
        standardView.addChild(standardButtonBg, standardText);

        const hoverButtonBg = this.createBackground(buttonWidth, ElementState.hover)
        const hoverText = this.createText(text, ElementState.hover);
        const hoverView = new Container();
        hoverView.addChild(hoverButtonBg, hoverText);

        const selectedButtonBg = this.createBackground(buttonWidth, ElementState.selected)
        const selectedText = this.createText(text, ElementState.selected);
        const selectedView = new Container();
        selectedView.addChild(selectedButtonBg, selectedText);

        const fancyButton = new FancyButton({
            defaultView: standardView,
            hoverView: hoverView,
            disabledView: selectedView,
            padding: 0
        });
        if (button == ButtonList.Map) {
            fancyButton.enabled = false;
        }
        fancyButton.width = buttonWidth;
        fancyButton.onPress.connect(() => {
            this.app.stage.emit(EditorEvents.ClickMenuButton, button);
        });
        this.app.stage.on(EditorEvents.ClickMenuButton, (eventButton) => {
            fancyButton.enabled = (button != eventButton);
        });
        menuContainer.addChild(fancyButton)
        const resize = function (width: number): void {
            const buttonWidth = width / ButtonList.__SIZE;
            fancyButton.width = buttonWidth;
            fancyButton.x = buttonWidth * button.valueOf();

            standardButtonBg.width = buttonWidth;
            standardText.x = buttonWidth / 2;

            hoverButtonBg.width = buttonWidth;
            hoverText.x = buttonWidth / 2;

            selectedButtonBg.width = buttonWidth;
            selectedText.x = buttonWidth / 2;
        };
        this.app.stage.on(EditorEvents.Resize, resize);
        resize(this.app.renderer.width);
    }
}
