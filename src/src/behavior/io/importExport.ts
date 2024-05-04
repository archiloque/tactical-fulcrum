export abstract class IOStatus {
    readonly errors: string[]

    protected constructor(errors: string[]) {
        this.errors = errors
    }
}

export abstract class IOOperation {
    protected readonly errors: string[]

    protected constructor() {
        this.errors = []
    }

    static readonly ATTRIBUTE_ROOMS = 'rooms'
    static readonly ATTRIBUTE_ENEMIES = 'enemies'
}

