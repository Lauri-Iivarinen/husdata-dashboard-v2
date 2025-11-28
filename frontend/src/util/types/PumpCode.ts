//{code: '0001', name: 'Radiator Return', value: 22.4, raw_value: 224, type: 'Temp Sensor'}
export interface PumpCode {
    code: string,
    name: string
    value: number | string
    raw_value: number
    type: string
}