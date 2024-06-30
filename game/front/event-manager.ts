import {SimpleEventManager} from '../../common/simple-event-manager'
import {TowerInfo} from '../towers/tower-info'

export class EventManager extends SimpleEventManager {
  private static EVENT_TOWER_SELECTION = 'towerSelection'

  constructor() {
    super()
  }

  public registerTowerSelection(callBack: (selectedTower: TowerInfo) => void): void {
    this.eventEmitter.on(EventManager.EVENT_TOWER_SELECTION, selectedTower => callBack(selectedTower))
  }

  public notifyTowerSelection(selectedTower: TowerInfo): void {
    console.debug('EventManager', 'notifyTowerSelection', selectedTower)
    this.eventEmitter.emit(EventManager.EVENT_TOWER_SELECTION, selectedTower)
  }
}
