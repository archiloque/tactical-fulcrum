import './reset.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import './editor.css';

import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import '@shoelace-style/shoelace/dist/components/tab/tab.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js';
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js';

import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import {MainMenu, Tabs} from "./src/front/main-menu";
import {Tower} from "./src/data/tower";
import {TabEnemies} from "./src/front/tab-enemies";

const rootUrl = document.location.origin;
setBasePath(rootUrl);

export class Editor {
    readonly tower: Tower;
    private readonly mainMenu: MainMenu;
    private readonly tabEnemies: TabEnemies;

    constructor() {
        console.info('Editor starting')
        this.tower = new Tower();
        this.mainMenu = new MainMenu(this);
        this.tabEnemies = new TabEnemies(this);
    }

    public tabShown(tabName: Tabs): void {
        switch (tabName) {
            case Tabs.map:
                break;
            case Tabs.info:
                break;
            case Tabs.enemies:
                this.tabEnemies.show();
                break;
            default:
                throw new Error(`Unknown tab [${tabName}]`);
        }
    }
}

onload = (event) => {
    new Editor();
};
