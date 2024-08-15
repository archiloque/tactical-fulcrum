import { getLevel } from "../../../../game/models/play/levels"

test("Level values", () => {
  expect(getLevel(0)).toStrictEqual({
    index: 0,
    expForNextLevel: 10,
    startingExp: 0,
  })
  expect(getLevel(1)).toStrictEqual({
    index: 1,
    expForNextLevel: 30,
    startingExp: 10,
  })
  expect(getLevel(2)).toStrictEqual({
    index: 2,
    expForNextLevel: 60,
    startingExp: 40,
  })
})
