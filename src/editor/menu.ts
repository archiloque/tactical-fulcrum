import {Application, Container, Graphics, Text, TextStyle} from 'pixi.js'
import {FancyButton} from '@pixi/ui';
import {EditorForMenu} from '../editor'
import {MONO_FONT, STANDARD_COLOR, HOVER_COLOR, RESIZE_EVENT} from './constants';

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

    app: Application

    constructor(app: Application) {
        this.app = app;
    }

    private createText(text: string, hover: boolean): Text {
        const style = hover ? Menu.BUTTON_HOVER_TEXT_STYLE : Menu.BUTTON_STANDARD_TEXT_STYLE;
        const button = new Text({
            text: text,
            style: style
        });
        button.anchor.set(0.5);
        button.y = Menu.BUTTON_HEIGHT / 2;
        return button;
    }

    private createBackground(buttonWidth: number): Graphics {
        return new Graphics().rect(0, 0, buttonWidth, Menu.BUTTON_HEIGHT).fill('#A5E24D');
    }

    private setupButton(menuContainer: Container, buttonWidth: number, text: string, index: number, onClick: () => void): void {
        const standardButtonBg = this.createBackground(buttonWidth);
        const standardText = this.createText(text, false);
        const standardView = new Container();
        standardView.addChild(standardButtonBg, standardText);

        const hoverButtonBg = this.createBackground(buttonWidth)
        const hoverText = this.createText(text, true);
        const hoverView = new Container();
        hoverView.addChild(hoverButtonBg, hoverText);

        const button = new FancyButton({defaultView: standardView, hoverView: hoverView, padding: 0});
        button.width = buttonWidth;
        button.onPress.connect(() => onClick());
        menuContainer.addChild(button)
        const resize = function (width: number): void {
            console.debug("Resize menu button", width)
            const buttonWidth = width / Menu.NUMBER_OF_BUTTONS;
            button.width = buttonWidth;
            button.x = buttonWidth * index;

            standardButtonBg.width = buttonWidth;
            standardText.x = buttonWidth / 2;

            hoverButtonBg.width = buttonWidth;
            hoverText.x = buttonWidth / 2;
        };
        this.app.stage.on(RESIZE_EVENT, resize);
        resize(this.app.renderer.width);
    }

    public setup(editorForMenu: EditorForMenu) {
        const buttonWidth: number = this.app.renderer.width / Menu.NUMBER_OF_BUTTONS;
        const menuContainer: Container = new Container({position: {x: 0, y: 75}});
        this.setupButton(menuContainer, buttonWidth, 'Map', 0, editorForMenu.clickInfo);
        this.setupButton(menuContainer, buttonWidth, 'Info', 2, editorForMenu.clickInfo);
        this.setupButton(menuContainer, buttonWidth, 'Enemies', 1, editorForMenu.clickInfo);
        this.app.stage.addChild(menuContainer);
    }
}
