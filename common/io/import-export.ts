export abstract class IOResult {
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

  static readonly ATTRIBUTE_ENEMIES = "enemies"
  static readonly ATTRIBUTE_ITEMS = "items"
  static readonly ATTRIBUTE_LEVELS = "levels"
  static readonly ATTRIBUTE_NAME = "name"
  static readonly ATTRIBUTE_NEXUS = "nexus"
  static readonly ATTRIBUTE_ROOMS = "rooms"
  static readonly ATTRIBUTE_STANDARD = "standard"
  static readonly ATTRIBUTE_INFO = "info"
}
