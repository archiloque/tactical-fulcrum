import {Tower} from "./tower";
import {Enemy} from "./enemy";

export class Export {

    static export(tower: Tower): string | string[] {
        return JSON.stringify({
            enemies: tower.enemies.map(enemy => Export.enemyToJson(enemy))
        }, null, 2)
    }

    private static enemyToJson(enemy: Enemy) {
        return {
            type: enemy.type ? enemy.type.valueOf() : null,
            level: enemy.level,
            name: enemy.name,
            hp: enemy.hp,
            atk: enemy.atk,
            def: enemy.def,
            exp: enemy.exp,
            drop: enemy.drop ? enemy.drop.valueOf() : null,
        }
    }
}