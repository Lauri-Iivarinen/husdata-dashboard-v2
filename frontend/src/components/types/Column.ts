export interface Column {
    width: number
    height: number
    x: number
    y: number
    value: string | number | null
    padding: string
    timeStamp: string
    coords?: string
    prevX?: number
    prevY?: number
}