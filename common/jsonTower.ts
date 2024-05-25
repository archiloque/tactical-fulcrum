// To parse this data:
//
//   import { Convert, Tower } from "./file";
//
//   const tower = Convert.toTower(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Tower {
    $schema: string;
    enemies: EnemyElement[];
    levels:  LevelElement[];
    name:    string;
    rooms:   Rooms;
}

export interface EnemyElement {
    atk:   number;
    def:   number;
    drop:  Drop;
    exp:   number;
    hp:    number;
    level: number;
    name:  string;
    type:  EnemyTypeEnum;
}

export enum Drop {
    BluePotion = "Blue potion",
    DropOfDreamOcean = "Drop of dream ocean",
    Empty = "",
    GoldenFeather = "Golden feather",
    GuardCard = "Guard card",
    GuardDeck = "Guard deck",
    GuardGem = "Guard gem",
    GuardPiece = "Guard piece",
    GuardPotion = "Guard potion",
    HeavenlyPotion = "Heavenly potion",
    LifeCrown = "Life Crown",
    LifePotion = "Life potion",
    PowerCard = "Power card",
    PowerDeck = "Power deck",
    PowerGem = "Power gem",
    PowerPiece = "Power piece",
    PowerPotion = "Power potion",
    PulseBookShield = "Pulse book <Shield>",
    PulseBookSword = "Pulse book <Sword>",
    RedPotion = "Red potion",
}

export enum EnemyTypeEnum {
    Burgeoner = "Burgeoner",
    Fighter = "Fighter",
    Ranger = "Ranger",
    Shadow = "Shadow",
    Slasher = "Slasher",
}

export interface LevelElement {
    atkAdd:     number;
    atkMul:     number;
    blueKey:    number;
    crimsonKey: number;
    defAdd:     number;
    defMul:     number;
    hpAdd:      number;
    hpMul:      number;
    yellowKey:  number;
}

export interface Rooms {
    nexus:    NexusElement[];
    standard: NexusElement[];
}

export interface NexusElement {
    name:   string;
    scores: ScoreElement[];
    tiles:  Array<TileElement[]>;
}

export interface ScoreElement {
    column: number;
    line:   number;
    type:   ScoreType;
}

export enum ScoreType {
    Check = "check",
    Crown = "crown",
    Star = "star",
}

export interface TileElement {
    color?:     Color;
    type:       PurpleType;
    enemyType?: EnemyTypeEnum;
    level?:     number;
    name?:      Name;
    direction?: Direction;
}

export enum Color {
    Blue = "blue",
    Crimson = "crimson",
    GreenBlue = "greenBlue",
    Platinum = "platinum",
    Violet = "violet",
    Yellow = "yellow",
}

export enum Direction {
    Down = "down",
    Up = "up",
}

export enum Name {
    BluePotion = "Blue potion",
    DropOfDreamOcean = "Drop of dream ocean",
    GoldenFeather = "Golden feather",
    GuardCard = "Guard card",
    GuardDeck = "Guard deck",
    GuardGem = "Guard gem",
    GuardPiece = "Guard piece",
    GuardPotion = "Guard potion",
    HeavenlyPotion = "Heavenly potion",
    LifeCrown = "Life Crown",
    LifePotion = "Life potion",
    PowerCard = "Power card",
    PowerDeck = "Power deck",
    PowerGem = "Power gem",
    PowerPiece = "Power piece",
    PowerPotion = "Power potion",
    PulseBookShield = "Pulse book <Shield>",
    PulseBookSword = "Pulse book <Sword>",
    RedPotion = "Red potion",
}

export enum PurpleType {
    Door = "door",
    Empty = "empty",
    Enemy = "enemy",
    Item = "item",
    Key = "key",
    Staircase = "staircase",
    StartingPosition = "startingPosition",
    Wall = "wall",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toTower(json: string): Tower {
        return cast(JSON.parse(json), r("Tower"));
    }

    public static towerToJson(value: Tower): string {
        return JSON.stringify(uncast(value, r("Tower")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Tower": o([
        { json: "$schema", js: "$schema", typ: "" },
        { json: "enemies", js: "enemies", typ: a(r("EnemyElement")) },
        { json: "levels", js: "levels", typ: a(r("LevelElement")) },
        { json: "name", js: "name", typ: "" },
        { json: "rooms", js: "rooms", typ: r("Rooms") },
    ], false),
    "EnemyElement": o([
        { json: "atk", js: "atk", typ: 3.14 },
        { json: "def", js: "def", typ: 3.14 },
        { json: "drop", js: "drop", typ: r("Drop") },
        { json: "exp", js: "exp", typ: 3.14 },
        { json: "hp", js: "hp", typ: 3.14 },
        { json: "level", js: "level", typ: 3.14 },
        { json: "name", js: "name", typ: "" },
        { json: "type", js: "type", typ: r("EnemyTypeEnum") },
    ], false),
    "LevelElement": o([
        { json: "atkAdd", js: "atkAdd", typ: 3.14 },
        { json: "atkMul", js: "atkMul", typ: 3.14 },
        { json: "blueKey", js: "blueKey", typ: 3.14 },
        { json: "crimsonKey", js: "crimsonKey", typ: 3.14 },
        { json: "defAdd", js: "defAdd", typ: 3.14 },
        { json: "defMul", js: "defMul", typ: 3.14 },
        { json: "hpAdd", js: "hpAdd", typ: 3.14 },
        { json: "hpMul", js: "hpMul", typ: 3.14 },
        { json: "yellowKey", js: "yellowKey", typ: 3.14 },
    ], false),
    "Rooms": o([
        { json: "nexus", js: "nexus", typ: a(r("NexusElement")) },
        { json: "standard", js: "standard", typ: a(r("NexusElement")) },
    ], false),
    "NexusElement": o([
        { json: "name", js: "name", typ: "" },
        { json: "scores", js: "scores", typ: a(r("ScoreElement")) },
        { json: "tiles", js: "tiles", typ: a(a(r("TileElement"))) },
    ], false),
    "ScoreElement": o([
        { json: "column", js: "column", typ: 3.14 },
        { json: "line", js: "line", typ: 3.14 },
        { json: "type", js: "type", typ: r("ScoreType") },
    ], false),
    "TileElement": o([
        { json: "color", js: "color", typ: u(undefined, r("Color")) },
        { json: "type", js: "type", typ: r("PurpleType") },
        { json: "enemyType", js: "enemyType", typ: u(undefined, r("EnemyTypeEnum")) },
        { json: "level", js: "level", typ: u(undefined, 3.14) },
        { json: "name", js: "name", typ: u(undefined, r("Name")) },
        { json: "direction", js: "direction", typ: u(undefined, r("Direction")) },
    ], false),
    "Drop": [
        "Blue potion",
        "Drop of dream ocean",
        "",
        "Golden feather",
        "Guard card",
        "Guard deck",
        "Guard gem",
        "Guard piece",
        "Guard potion",
        "Heavenly potion",
        "Life Crown",
        "Life potion",
        "Power card",
        "Power deck",
        "Power gem",
        "Power piece",
        "Power potion",
        "Pulse book <Shield>",
        "Pulse book <Sword>",
        "Red potion",
    ],
    "EnemyTypeEnum": [
        "Burgeoner",
        "Fighter",
        "Ranger",
        "Shadow",
        "Slasher",
    ],
    "ScoreType": [
        "check",
        "crown",
        "star",
    ],
    "Color": [
        "blue",
        "crimson",
        "greenBlue",
        "platinum",
        "violet",
        "yellow",
    ],
    "Direction": [
        "down",
        "up",
    ],
    "Name": [
        "Blue potion",
        "Drop of dream ocean",
        "Golden feather",
        "Guard card",
        "Guard deck",
        "Guard gem",
        "Guard piece",
        "Guard potion",
        "Heavenly potion",
        "Life Crown",
        "Life potion",
        "Power card",
        "Power deck",
        "Power gem",
        "Power piece",
        "Power potion",
        "Pulse book <Shield>",
        "Pulse book <Sword>",
        "Red potion",
    ],
    "PurpleType": [
        "door",
        "empty",
        "enemy",
        "item",
        "key",
        "staircase",
        "startingPosition",
        "wall",
    ],
};
