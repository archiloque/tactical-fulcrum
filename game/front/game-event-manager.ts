import { EventManager } from "../../common/event-manager"
import { TowerInfo } from "../towers/tower-info"

export const enum AnimationSource {
  INFO_BAR,
  GAME_MAP,
}

export class GameEventManager extends EventManager {
  private static EVENT_ANIMATION_START = "animationStart"
  private static EVENT_DIALOG_HIDDEN = "dialogHidden"
  private static EVENT_DIALOG_SHOW = "dialogShown"
  private static EVENT_PLAYER_ACTION = "playerAction"
  private static EVENT_TOWER_LOAD = "towerLoad"
  private static EVENT_TOWER_RESET = "towerReset"
  private static EVENT_TOWER_SELECTION = "towerSelection"

  constructor() {
    super()
  }

  public registerAnimationStart(callBack: (animationSource: AnimationSource) => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_ANIMATION_START, (animationSource) => callBack(animationSource))
  }

  public notifyAnimationStart(animationSource: AnimationSource): void {
    console.debug("GameEventManager", "notifyAnimationStart", animationSource)
    this.eventEmitter.emit(GameEventManager.EVENT_ANIMATION_START, animationSource)
  }

  public registerDialogHidden(callBack: () => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_DIALOG_HIDDEN, () => callBack())
  }

  public notifyDialogHidden(): void {
    console.debug("EventManager", "notifyDialogHidden")
    this.eventEmitter.emit(GameEventManager.EVENT_DIALOG_HIDDEN)
  }

  public registerDialogShown(callBack: () => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_DIALOG_SHOW, () => callBack())
  }

  public notifyDialogShown(): void {
    console.debug("EventManager", "notifyDialogShown")
    this.eventEmitter.emit(GameEventManager.EVENT_DIALOG_SHOW)
  }

  public registerPlayerAction(callBack: () => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_PLAYER_ACTION, () => callBack())
  }

  public notifyPlayerAction(): void {
    console.debug("EventManager", "notifyPlayerAction")
    this.eventEmitter.emit(GameEventManager.EVENT_PLAYER_ACTION)
  }

  public registerTowerLoad(callBack: (slot: number) => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_TOWER_LOAD, (slot) => callBack(slot))
  }

  public notifyTowerLoad(slot: number): void {
    console.debug("EventManager", "notifyTowerLoad", slot)
    this.eventEmitter.emit(GameEventManager.EVENT_TOWER_LOAD, slot)
  }

  public registerTowerReset(callBack: () => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_TOWER_RESET, () => callBack())
  }

  public notifyTowerReset(): void {
    console.debug("EventManager", "notifyTowerReset")
    this.eventEmitter.emit(GameEventManager.EVENT_TOWER_RESET)
  }

  public notifyTowerSelection(selectedTower: TowerInfo): void {
    console.debug("EventManager", "notifyTowerSelection", selectedTower)
    this.eventEmitter.emit(GameEventManager.EVENT_TOWER_SELECTION, selectedTower)
  }

  public registerTowerSelection(callBack: (selectedTower: TowerInfo) => void): void {
    this.eventEmitter.on(GameEventManager.EVENT_TOWER_SELECTION, (selectedTower) => callBack(selectedTower))
  }
}
