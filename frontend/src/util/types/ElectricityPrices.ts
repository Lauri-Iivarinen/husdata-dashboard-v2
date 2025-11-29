export interface ElectricityPrices {
    hour: datapoint[]
    min15: datapoint[]
}

interface datapoint {
    time: string
    value: number
    min15Points: datapoint[]
}