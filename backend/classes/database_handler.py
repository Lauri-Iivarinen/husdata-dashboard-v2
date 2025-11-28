import json
from datetime import datetime

# Only thing we need to track right now is just some rows of pump data so just use fileparsing to keep it "simple stupid"
class database_handler:
    def __init__(self, _dest) -> None:
        if _dest is None:
            return
        self.history_dest = _dest
        try:
            open(self.history_dest, "x")
        except:
            print('file already exists')
    
    def get_full_history(self):
        rows: list[str] = []
        with open(self.history_dest) as fh:
            for r in fh.readlines():
                r = r.replace('\n', '')
                rows.append(r)
        return rows

    def add_history_row(self, row):
        ALLOWED_LENGTH = 96
        rows = self.get_full_history()
        try:
            dt = datetime.now()
            rows.append(f'{int(dt.timestamp())}={row}')
            if len(rows) > ALLOWED_LENGTH:
                rows = rows[len(rows)-ALLOWED_LENGTH:]

            with open(self.history_dest, 'w') as fh:
                for r in rows:
                    fh.writelines(f'{r}\n')
            return True
        except:
            return False
        