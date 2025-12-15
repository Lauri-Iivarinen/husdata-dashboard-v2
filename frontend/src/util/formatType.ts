import { getCodeType } from "./getCodeType";
import { PumpCode } from "./types/PumpCode";

export const formatCodeValue = (pumpCode: PumpCode) => {
    const vType = getCodeType(pumpCode.code)
    switch (vType) {
        case 'bool':
            return pumpCode.value ? 'on' : 'off'
        case 'temp':
            return `${pumpCode.value}°C`
        default:
            return pumpCode.value
    }
}