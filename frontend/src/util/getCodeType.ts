const CODE_DEFINITIONS = [
    {'name': "Compressor  0W", 'code': "1A01", 'valueType': "Status"},
    {'name': "Add heat step 1  0W", 'code': "1A02", 'valueType': "Status"},
    {'name': "Add heat step 2  0W", 'code': "1A03", 'valueType': "Status"},
    {'name': "Pump Cold circuit  0W", 'code': "1A04", 'valueType': "Status"},
    {'name': "Pump Heat circuit  0W", 'code': "1A05", 'valueType': "Status"},
    {'name': "Pump Radiator  0W", 'code': "1A06", 'valueType': "Status"},
    {'name': "Switch valve 1  0W", 'code': "1A07", 'valueType': "Status"},
    {'name': "Alarm  0W", 'code': "1A20", 'valueType': "Status"},
    {'name': "Radiator Return", 'code': "0001", 'valueType': "Temp Sensor"},
    {'name': "Radiator Forward", 'code': "0002", 'valueType': "Temp Sensor"},
    {'name': "Heat carrier Return", 'code': "0003", 'valueType': "Temp Sensor"},
    {'name': "Heat carrier Forwrd", 'code': "0004", 'valueType': "Temp Sensor"},
    {'name': "Brine in/Evaporator", 'code': "0005", 'valueType': "Temp Sensor"},
    {'name': "Brine out/Condenser", 'code': "0006", 'valueType': "Temp Sensor"},
    {'name': "Outdoor", 'code': "0007", 'valueType': "Temp Sensor"},
    {'name': "Indoor", 'code': "0008", 'valueType': "Temp Sensor"},
    {'name': "Warm water 1 / Top", 'code': "0009", 'valueType': "Temp Sensor"},
    {'name': "Warm water 2 / Mid", 'code': "000A", 'valueType': "Temp Sensor"},
    {'name': "Hot gas / Compr.", 'code': "000B", 'valueType': "Temp Sensor"},
    {'name': "Add heat status  0W", 'code': "3104", 'valueType': "Percent usage"},
    {'name': "Heating setpoint", 'code': "0107", 'valueType': "Temp variable"},
    {'name': "Warm water setpoint", 'code': "0111", 'valueType': "Temp variable"},
    {'name': "Room temp setpoint", 'code': "0203", 'valueType': "Set temp"},
    {'name': "Room sensor influence", 'code': "2204", 'valueType': "Set temp"},
    {'name': "Heat set 1", 'code': "2205", 'valueType': "Set number"},
    {'name': "Heat set 3", 'code': "0207", 'valueType': "Set number"},
    {'name': "Warm Water stop temp", 'code': "0208", 'valueType': "Set temp"},
    {'name': "Warm water Difference", 'code': "020B", 'valueType': "Set temp"},
    {'name': "Extra Warm Water", 'code': "7209", 'valueType': "Set Minutes"},
    {'name': "Elect. heater switch", 'code': "1215", 'valueType': "Set Status"},
    {'name': "External control", 'code': "1233", 'valueType': "Set Status"},
    {'name': "Summer mode", 'code': "020A", 'valueType': "Set temp"},
    {'name': "Holiday mode", 'code': "2210", 'valueType': "Set Hour"},
    {'name': "Alarm Code", 'code': "BA91", 'valueType': "Number"},
    {'name': "Compr. cons. heating", 'code': "6C55", 'valueType': "Time Hours"},
    {'name': "Compr. cons. hotwat", 'code': "6C56", 'valueType': "Time Hours"},
    {'name': "Aux cons. heating", 'code': "6C58", 'valueType': "Time Hours"},
    {'name': "Aux cons. hot water", 'code': "6C59", 'valueType': "Time Hours"}
]

const VALUE_TYPE_GROUPS: any = {
    'Status': 'bool',
    'Temp Sensor': 'temp', 
    'Percent usage': 'percent', 
    'Temp variable': 'temp', 
    'Set temp': 'temp', 
    'Set number': 'num', 
    'Set Minutes': 'time', 
    'Set Status': 'bool', 
    'Set Hour': 'time', 
    "Number": 'num', 
    'Time Hours': 'time'
}

type ValueTypes = 'bool' | 'temp' | 'percent' | 'num' | 'time' | 'bool' | 'N/A'

export const getCodeType  = (code: string): ValueTypes =>  {
    const codeType = CODE_DEFINITIONS.find(v => v.code === code)
    if (codeType === undefined) return 'N/A'
    //if (codeType.valueType === 'Number') return 'num'
    if (Object.keys(VALUE_TYPE_GROUPS).includes(codeType.valueType)) return VALUE_TYPE_GROUPS[codeType.valueType]
    return 'N/A'
}