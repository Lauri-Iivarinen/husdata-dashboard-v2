from flask import Flask, render_template, request
import requests
import json
from classes.database_handler import database_handler
from classes.pump_code import pump_code
from classes.request_handler import request_handler
from dotenv import load_dotenv
from flask_cors import CORS
import os

from util.constants import CODE_DEFINITIONS
from util.utility import convert_history_data, real_to_raw_value

load_dotenv()

app = Flask(__name__)
CORS(app, origins=['*'])
dh = database_handler(os.getenv('HISTORY_DEST'))
rh = request_handler(os.getenv('HUSDATA_URL'))

def return_response(status: str, msg: str = ''):
    res = {}
    res['status'] = status
    if msg != '':
        res['msg'] = msg
    return json.dumps(res)


@app.route("/")
def hello_world():
    return render_template('index.html')

# Returns all pump data
@app.route("/api/getData")
def get_pump_data():
    data: list[pump_code] = rh.get_pump_data()
    return json.dumps(list(map(lambda x: x.to_json(), data)))

# Update value on pump
@app.route('/api/setData/<code>')
def update_data_value(code):
    value = request.args.get('value', None)
    if value is None:
        return return_response('err', 'No value provided for the code')

    definitions = next((c for c in CODE_DEFINITIONS if c['code'] == code), None)
    if definitions is None:
        return return_response('err', 'Code provided is not valid')

    raw_value = real_to_raw_value(definitions['valueType'], value)
    if rh.set_pump_value(code, raw_value):
        return return_response('ok', f'{code} = {raw_value}')
    return return_response('err', 'Something went wrong')

# Refresh history data, add new row and remove oldest
@app.route("/api/updateHistory")
def get_update_history():
    data = rh.get_pump_data()
    formatted = list(map(lambda x: x.csv_format(), data))
    if dh.add_history_row(";".join(formatted)):
        return return_response('ok')
    return return_response('err')

# Returns history data
@app.route('/api/getHistory')
def get_history_file():
    data = dh.get_full_history()
    dct = {}
    for row in data:
        row_dict = {}
        key,values = row.split('=')
        for pair in values.split(';'):
            k,v = pair.split('|')
            row_dict[k] = v
        dct[key] = row_dict
    dt = convert_history_data(dct)
    return json.dumps(dt)

# Returns logfile from pump, mby useless
@app.route('/api/getLog')
def get_log_data():
    log, ok = rh.get_log()
    if ok:
        return return_response('ok', log)
    return return_response('err', ['cant load log'])

@app.route('/api/restart')
def restart_iot_device():
    if rh.restart_iot():
        return return_response('ok', '')
    return return_response('err', 'something went wrong')

@app.route('/api/sahko/<page>')
def get_electricity_price(page):
    res = requests.get(f'https://www.porssisahkoa.fi/api/Prices/GetPrices?mode={page}')
    if res.status_code == 200:
        return res.json()
    print(res)
    return "err"

@app.route('/api/updatelog')
def get_update_log():
    update = 'Added new update popup notification (this one)'
    return update
 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)