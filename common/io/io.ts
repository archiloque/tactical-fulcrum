export class IO {
  static checkEnum(value: any, values: string[], mandatory: boolean, message: string, errors: string[]): void {
    if (value == null || value === "") {
      if (mandatory) {
        errors.push(message)
      }
      return
    }
    if (values.indexOf(value) === -1) {
      errors.push(message)
    }
  }

  static checkNotEmpty(value: string | number | null, message: string, errors: string[]): void {
    if (value == null) {
      errors.push(message)
    } else if (typeof value === "number") {
    } else if (value.length === 0) {
      errors.push(message)
    }
  }

  static checkNumber(
    value: string | number | null,
    message: string,
    zeroAuthorized: boolean,
    nullAuthorized: boolean,
    errors: string[],
  ): void {
    if (value == null) {
      if (!nullAuthorized) {
        errors.push(message)
      }
    } else if (typeof value === "number") {
      if (zeroAuthorized) {
        if (value < 0) {
          errors.push(message)
        }
      } else {
        if (value <= 0) {
          errors.push(message)
        }
      }
    } else {
      const v = parseInt(value)
      if (zeroAuthorized) {
        if (isNaN(v) || v < 0) {
          errors.push(message)
        }
      } else {
        if (isNaN(v) || v <= 0) {
          errors.push(message)
        }
      }
    }
  }
}
