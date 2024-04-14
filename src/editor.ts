import {Application, Assets, Text, TextStyle} from 'pixi.js'
import {MONO_FONT, RESIZE_EVENT} from './editor/constants';
import {Menu} from './editor/menu';

export interface EditorForMenu {
    clickMap(): void

    clickEnemies(): void

    clickInfo(): void
}

class Editor implements EditorForMenu {
    app: Application

    constructor() {
        this.app = new Application();
    }

    // @ts-ignore
    async initialize(): Promise<void> {
        await this.app.init({background: '#FFFFFF', resizeTo: window});
        document.body.appendChild(this.app.canvas);

        Assets.addBundle('fonts', [
            {
                alias: 'JetBrains Mono Regular',
                src: 'assets/JetBrainsMono-Regular.ttf',
                data: {family: 'JetBrains Mono Regular'}
            },
        ]);

        await Assets.loadBundle('fonts');
        const style: TextStyle = new TextStyle({
            fontFamily: MONO_FONT,
            fontSize: 50
        });
        const titleText = new Text({
            text: 'Tactical fulcrum editor', style: style
        });
        this.app.stage.addChild(titleText);
        new Menu(this.app).setup(this);

        window.addEventListener('resize', () => {
            const width = this.app.renderer.width;
            console.debug('App', 'resize', width);
            this.app.stage.emit(RESIZE_EVENT, width);
        });
        window.dispatchEvent(new Event('resize'));
        console.debug('Done');
    }

    clickEnemies(): void {
        throw new Error("Not implemented")
    }

    clickInfo(): void {
        throw new Error("Not implemented")
    }

    clickMap(): void {
        throw new Error("Not implemented")
    }

}

new Editor().initialize()
