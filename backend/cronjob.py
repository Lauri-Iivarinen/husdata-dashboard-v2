import requests
import time


def main():
    res = requests.get('http://localhost:8080/api/updateHistory')
    time.sleep(900)
    main()

if __name__ == "__main__":
    main()