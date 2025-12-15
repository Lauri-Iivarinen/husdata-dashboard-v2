export interface BarChartProps {
    keys: number[],
    values: number[]
    toolTipScale?: number
    graphHeight: number
    rounding?: number
    leftPadding?: number
    widthMultiplier?: number
}