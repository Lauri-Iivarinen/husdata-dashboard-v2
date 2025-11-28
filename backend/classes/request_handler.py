import json
import re
import requests
from classes.pump_code import pump_code
from util.constants import OFFLINEDATA

class request_handler:
    url = ''

    def __init__(self, _url) -> None:
        if _url is not None:
            self.url = _url
    
    def get_log(self):
        if len(self.url) == 0:
            return ('OFFLINE LOG TBD', True)

        response = requests.get(f'{self.url}/log')
        return (response.content, response.status_code == 200)

    def set_pump_value(self, code, value):
        if len(self.url) == 0:
            return True
        response = requests.get(f'{self.url}/set?idx={code}&val={value}')
        return response.status_code == 200

    def get_pump_data(self) -> list[pump_code]:
        data: list[pump_code] = []
        if len(self.url) == 0:
            print('env not defined')
            for k in OFFLINEDATA:
                data.append(pump_code(k, OFFLINEDATA[k]))
            return data
        
        print('env defined')
        response = requests.get(f'{self.url}/alldata')
        dct = json.loads(response.content)
        for k in dct:
            data.append(pump_code(k, dct[k]))
        return data
    
    def get_raw_data(self) -> dict[str:int]:
        if len(self.url) == 0:
            return OFFLINEDATA
        
        print('end defined')
        response = requests.get(f'{self.url}/alldata')
        dct = json.loads(response.content)
        return dct
        