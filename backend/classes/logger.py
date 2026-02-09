from datetime import datetime
class logger:
    def __init__(self, _dest) -> None:
        if _dest is None:
            return
        self.log_file = _dest
        try:
            open(self.log_file, "x")
        except:
            print('file already exists')

    def log(self, msg):
        with open(self.log_file, 'a') as f:
            f.write(f'INFO  [{datetime.now()}]: {msg}\n')
        f.close()

    def error(self, msg):
        with open(self.log_file, 'a') as f:
            f.write(f'ERROR [{datetime.now()}]: {msg}\n')
        f.close()

    def get_log(self):
        rows = ""
        with open(self.log_file) as f:
            rows = "".join(f.readlines())
        return rows