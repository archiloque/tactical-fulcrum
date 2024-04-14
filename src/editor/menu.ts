import {Application, Container, Graphics, Text, TextStyle} from 'pixi.js'
import {FancyButton} from '@pixi/ui';
import {MONO_FONT, STANDARD_COLOR, HOVER_COLOR} from './constants';

const NUMBER_OF_BUTTONS = 3;
const BUTTON_HEIGHT = 50;

const BUTTON_STANDARD_TEXT_STYLE = new TextStyle({
    fontFamily: MONO_FONT,
    fontSize: 20,
    fill: STANDARD_COLOR
});
const BUTTON_HOVER_TEXT_STYLE = new TextStyle({
    fontFamily: MONO_FONT,
    fontSize: 20,
    fill: HOVER_COLOR
});

function createText(text: string, hover: boolean): Text {
    const style = hover ? BUTTON_HOVER_TEXT_STYLE : BUTTON_STANDARD_TEXT_STYLE;
    const button = new Text({
        text: text,
        style: style
    });
    button.anchor.set(0.5);
    button.y = BUTTON_HEIGHT / 2;
    return button;
}

function createBackground(buttonWidth: number): Graphics {
    return new Graphics().rect(0, 0, buttonWidth, BUTTON_HEIGHT).fill('#A5E24D');
}

function setupButton(menuContainer: Container, buttonWidth: number, text: string, index: number): (buttonWidth: number) => void {
    const standardButtonBg = createBackground(buttonWidth);
    const standardText = createText(text, false);
    const standardView = new Container();
    standardView.addChild(standardButtonBg, standardText);

    const hoverButtonBg = createBackground(buttonWidth)
    const hoverText = createText(text, true);
    const hoverView = new Container();
    hoverView.addChild(hoverButtonBg, hoverText);

    const button = new FancyButton({defaultView: standardView, hoverView: hoverView, padding: 0});
    button.width = buttonWidth;
    menuContainer.addChild(button)
    const resize = function (buttonWidth: number): void {
        button.width = buttonWidth;
        button.x = buttonWidth * index;

        standardButtonBg.width = buttonWidth;
        standardText.x = buttonWidth / 2;

        hoverButtonBg.width = buttonWidth;
        hoverText.x = buttonWidth / 2;
    };
    resize(buttonWidth);
    return resize
}

export default function setupMenu(app: Application) {
    const buttonWidth: number = app.renderer.width / NUMBER_OF_BUTTONS;
    const resizeCallbacks: Array<(buttonWidth: number) => void> = [];
    const menuContainer: Container = new Container({position: {x: 0, y: 75}});
    resizeCallbacks.push(setupButton(menuContainer, buttonWidth, 'Map', 0));
    resizeCallbacks.push(setupButton(menuContainer, buttonWidth, 'Enemies', 1));
    resizeCallbacks.push(setupButton(menuContainer, buttonWidth, 'Info', 2));

    app.stage.addChild(menuContainer);
    window.addEventListener('resize', function () {
        const buttonWidth = app.renderer.width / NUMBER_OF_BUTTONS;
        resizeCallbacks.forEach((callback) => {
            callback(buttonWidth)
        });
    });
}
