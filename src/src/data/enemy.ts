import {EnemyTypes} from "./enemy_types";

export class Enemy {
    type: EnemyTypes;
    level: string;
    name: string;
    hp: string;
    atk: string;
    def: string;
    exp: string;

    constructor() {
        this.hp = '10';
    }
}