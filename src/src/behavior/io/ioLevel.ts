import {IO} from './io'
import {Level} from '../level'

export class IoLevel {
    static readonly ATTRIBUTE_NAME = 'name'

    static validate(level: Level, index: number, errors: string[]) {
        IO.checkNotEmpty(level.name, `Level ${index} name [${level.name}] is invalid`, errors)
    }

    static validateLevels(levels: Level[], errors: string[]) {
        const knownLevels = []
        levels.forEach((level, index) => {
            if (knownLevels.indexOf(level.name) != -1) {
                errors.push(`Level ${index} is duplicated (same name)`)
            } else {
                knownLevels.push(level.name)
            }
        })
    }

    static fromAttributes(value: object): Level {
        const result: Level = new Level()
        result.name = value[IoLevel.ATTRIBUTE_NAME]
        return result
    }

    static toAttributes(level: Level) {
        return {
            [IoLevel.ATTRIBUTE_NAME]: level.name,
        }
    }
}
