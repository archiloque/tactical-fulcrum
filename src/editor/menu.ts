import {Application, Container, Graphics, Text, TextStyle} from 'pixi.js'
import {FancyButton} from '@pixi/ui';

import {
    EditorEvents,
    ElementState,
    HOVER_COLOR,
    MONO_FONT,
    SELECTED_BACKGROUND_COLOR,
    SELECTED_COLOR,
    STANDARD_BACKGROUND_COLOR,
    STANDARD_COLOR
} from './constants';

enum ButtonList {
    Map = 0,
    Enemies = 1,
    Info = 2,
    __SIZE = 3,
}

export class Menu {
    private static readonly NUMBER_OF_BUTTONS = 3;
    private static readonly BUTTON_HEIGHT = 50;

    private static readonly BUTTON_STANDARD_TEXT_STYLE: TextStyle = new TextStyle({
        fontFamily: MONO_FONT,
        fontSize: 20,
        fill: STANDARD_COLOR
    });
    private static readonly BUTTON_HOVER_TEXT_STYLE: TextStyle = new TextStyle({
        fontFamily: MONO_FONT,
        fontSize: 20,
        fill: HOVER_COLOR
    });
    private static readonly BUTTON_SELECTED_TEXT_STYLE: TextStyle = new TextStyle({
        fontFamily: MONO_FONT,
        fontSize: 20,
        fill: SELECTED_COLOR
    });

    app: Application

    constructor(app: Application) {
        this.app = app;
    }

    private createText(text: string, state: ElementState): Text {
        let style: TextStyle;
        switch (state) {
            case ElementState.DEFAULT:
                style = Menu.BUTTON_STANDARD_TEXT_STYLE;
                break;
            case ElementState.HOVER:
                style = Menu.BUTTON_HOVER_TEXT_STYLE;
                break;
            case ElementState.SELECTED:
                style = Menu.BUTTON_SELECTED_TEXT_STYLE;
                break;

        }
        const button = new Text({
            text: text,
            style: style
        });
        button.anchor.set(0.5);
        button.y = Menu.BUTTON_HEIGHT / 2;
        return button;
    }

    private createBackground(buttonWidth: number, state: ElementState): Graphics {
        let color: string;
        switch (state) {
            case ElementState.DEFAULT:
                color = STANDARD_BACKGROUND_COLOR;
                break;
            case ElementState.HOVER:
                color = STANDARD_BACKGROUND_COLOR;
                break;
            case ElementState.SELECTED:
                color = SELECTED_BACKGROUND_COLOR;
                break;

        }
        return new Graphics().rect(0, 0, buttonWidth, Menu.BUTTON_HEIGHT).fill(color);
    }

    private setupButton(menuContainer: Container, buttonWidth: number, text: string, button: ButtonList): void {
        const standardButtonBg = this.createBackground(buttonWidth, ElementState.DEFAULT);
        const standardText = this.createText(text, ElementState.DEFAULT);
        const standardView = new Container();
        standardView.addChild(standardButtonBg, standardText);

        const hoverButtonBg = this.createBackground(buttonWidth, ElementState.HOVER)
        const hoverText = this.createText(text, ElementState.HOVER);
        const hoverView = new Container();
        hoverView.addChild(hoverButtonBg, hoverText);

        const selectedButtonBg = this.createBackground(buttonWidth, ElementState.SELECTED)
        const selectedText = this.createText(text, ElementState.SELECTED);
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
            console.debug("Resize menu button", width)
            const buttonWidth = width / Menu.NUMBER_OF_BUTTONS;
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

    public setup() {
        const buttonWidth: number = this.app.renderer.width / Menu.NUMBER_OF_BUTTONS;
        const menuContainer: Container = new Container({position: {x: 0, y: 75}});
        this.setupButton(menuContainer, buttonWidth, 'Map', ButtonList.Map);
        this.setupButton(menuContainer, buttonWidth, 'Info', ButtonList.Info);
        this.setupButton(menuContainer, buttonWidth, 'Enemies', ButtonList.Enemies);
        this.app.stage.addChild(menuContainer);
    }
}
