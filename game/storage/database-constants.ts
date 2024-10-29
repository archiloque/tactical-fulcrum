export const enum TableName {
  action = "action",
  playedTower = "playedTower",
  playedTowerRoom = "playedTowerRoom",
  tower = "tower",
}

export const enum IndexName {
  towerNameIndex = `${TableName.tower}NameIndex`,

  playedTowerByTowerName = `${TableName.playedTower}ByTowerName`,
  playedTowerByTowerNameAndSlot = `${TableName.playedTower}ByTowerNameAndSlot`,

  playedTowerRoomByPlayedTowerNameAndSlot = `${TableName.playedTowerRoom}ByPlayedTowerNameAndSlot`,
  playedTowerRoomByPlayedTowerNameAndSlotAndRoomAndNexusIndex = `${TableName.playedTowerRoom}ByPlayedTowerNameAndSlotAndRoomAndNexusIndex`,

  actionByPlayedTowerNameAndSlot = `${TableName.action}ByPlayedTowerNameAndSlot`,
  actionByPlayedTowerNameAndSlotAndIndex = `${TableName.action}ByPlayedTowerNameAndSlotAndIndex`,
}
