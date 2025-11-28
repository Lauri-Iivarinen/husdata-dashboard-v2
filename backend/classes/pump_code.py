from util.utility import raw_to_real_value
from util.constants import CODE_DEFINITIONS


class pump_code:
    def __init__(self, _code, _value) -> None:
        self.code = _code
        self.value = _value

        definitions = next((code for code in CODE_DEFINITIONS if code['code'] == _code), None)
        if definitions is not None:
            self.name = definitions['name']
            self.value_type = definitions['valueType']
        else:
            self.name = 'N/A'
            self.value_type = 'N/A'
    
    def __str__(self) -> str:
        return 'obj'

    def to_json(self):
        return {'code': self.code, 'name': self.name, 'value': raw_to_real_value(self.value_type, self.value), 'raw_value': self.value, 'type': self.value_type}

    def csv_format(self):
        return f'{self.code}|{self.value}'
