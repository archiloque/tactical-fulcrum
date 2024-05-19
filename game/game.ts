import '../assets/css/reset.css'
import './game.css'

import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js'

const rootUrl = document.location.origin
setBasePath(rootUrl + './game/')

export class Game {

}

onload = (): void => {
  new Game()
}
