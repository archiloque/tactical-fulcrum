export function findEnum<T>(enumList: T[], value: string): T | null {
    return enumList.find(s => s.valueOf() === value)
}
