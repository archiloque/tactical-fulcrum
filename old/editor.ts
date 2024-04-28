import {Application, Assets, Text, TextStyle} from 'pixi.js'
import {EditorEvents, MONO_FONT} from './editor/constants';
import {Menu} from './editor/menu';
import {EnemiesTab} from "./editor/enemiesTab";

class Editor {
    app: Application

    constructor() {
        this.app = new Application();
    }

    // @ts-expect-error we need thos for the async init
    async initialize() {
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
        new Menu(this.app)
        new EnemiesTab(this.app)

        window.addEventListener('resize', () => {
            const width = this.app.renderer.width;
            this.app.stage.emit(EditorEvents.Resize, width);
        });
        window.dispatchEvent(new Event('resize'));
        console.debug('App initialized');
    }
}

new Editor().initialize()
