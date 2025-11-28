from util.constants import VALUE_TYPE_GROUPS
import re

def convert_history_data(dct: dict[str, dict]):
    output = {'timestamps': []}
    keys = list(map(lambda x: int(x), list(dct.keys())))
    keys.sort()
    for k in keys:
        output['timestamps'].append(k)
        values = dct[f'{k}']
        for val_k, val in values.items():
            if val_k not in output:
                output[val_k] = [int(val)]
            else:
                output[val_k].append(int(val))
    return output

def raw_to_real_value(code, value):
    type = VALUE_TYPE_GROUPS[code] if code in VALUE_TYPE_GROUPS else ''
    match type:
        case 'temp':
            return value / 10
        case 'percent':
            return f'{value}%'
        case 'bool':
            return value == 1
        case _:
            return value

def real_to_raw_value(code, value: str):
    type = VALUE_TYPE_GROUPS[code] if code in VALUE_TYPE_GROUPS else ''
    match type:
        case 'temp':
            if '.' in str(value):
                return int(float(value) * 10)
            if float(value) > 100:
                return value
            return int(float(value) * 10)
        case 'percent':
            return str(value.replace('%', ''))
        case 'bool':
            return 1 if re.search('^true$|^1$',value, re.IGNORECASE) else 0
        case _:
            return value