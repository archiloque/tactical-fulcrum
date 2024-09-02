import { EventManager } from "../../common/event-manager"
import { TowerInfo } from "../towers/tower-info"

export const enum AnimationSource {
  INFO_BAR,
  GAME_MAP,
}

export class GameEventManager extends EventManager {
  private static EVENT_TOWER_SELECTION = "towerSelection"
  private static EVENT_TOWER_RESET = "towerReset"
  private static EVENT_ANIMATION_START = "animationStart"

  constructor() {
    super()
  }

  public registerTowerSelection(callBack: (selectedTower: TowerInfo) => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_TOWER_SELECTION, (selectedTower) => callBack(selectedTower))
  }

  public registerTowerReset(callBack: () => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_TOWER_RESET, () => callBack())
  }

  public registerAnimationStart(callBack: (animationSource: AnimationSource) => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_ANIMATION_START, (animationSource) => callBack(animationSource))
  }

  public notifyTowerSelection(selectedTower: TowerInfo): void {
    console.debug("EventManager", "notifyTowerSelection", selectedTower)
    this.eventEmitter.emit(GameEventManager.EVENT_TOWER_SELECTION, selectedTower)
  }

  public notifyTowerReset(): void {
    console.debug("EventManager", "notifyTowerReset")
    this.eventEmitter.emit(GameEventManager.EVENT_TOWER_RESET)
  }

  public notifyAnimationStart(animationSource: AnimationSource): void {
    console.debug("GameEventManager", "notifyAnimationStart", animationSource)
    this.eventEmitter.emit(GameEventManager.EVENT_ANIMATION_START, animationSource)
  }
}
