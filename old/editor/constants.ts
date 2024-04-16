import {TextStyle} from "pixi.js";

export const MONO_FONT = 'JetBrains Mono Regular';

export enum Color {
    standard = '#000000',
    hover = '#FF0000',
    selected = '#0000FF',
    backgroundStandard = '#FFFFFF',
    backgroundSelected = '#EEEEFF',
}

export enum EditorEvents {
    Resize = "Resize",
    ClickMenuButton = "ClickMenuButton"
}

export const STANDARD_TEXT_STYLE: TextStyle = new TextStyle({
    fontFamily: MONO_FONT,
    fontSize: 20,
    fill: Color.standard
});

export const enum ElementState {
    default,
    hover,
    selected
}

export const enum Heights {
    title = 75,
    menu = 50,
}