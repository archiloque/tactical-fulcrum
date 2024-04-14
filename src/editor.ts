import {Application, Assets, Text, TextStyle} from 'pixi.js'
import { MONO_FONT } from './editor/constants';
import setupMenu from './editor/menu';

// @ts-ignore
const main = async () => {
   const app: Application = new Application();
   await app.init({ background: '#FFFFFF', resizeTo: window });
   document.body.appendChild(app.canvas);

   Assets.addBundle('fonts', [
      { alias: 'JetBrains Mono Regular', src: 'assets/JetBrainsMono-Regular.ttf', data: {family: 'JetBrains Mono Regular' }},
   ]);

   await Assets.loadBundle('fonts');
   const style = new TextStyle({
      fontFamily: MONO_FONT,
      fontSize: 50
   });
   const titleText = new Text({
      text: 'Tactical fulcrum editor', style: style
   });
   app.stage.addChild(titleText);
   setupMenu(app);
   window.dispatchEvent(new Event('resize'));
   console.debug('Done');
}

main();
