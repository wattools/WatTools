from flask import Flask, render_template
from flask_frozen import Freezer
import json, sys

app = Flask(__name__)
freezer = Freezer(app)

@app.route('/')
def index():
    with open("entries.json") as f:
      entries = json.loads(f.read())
    return render_template("index.j2", entries=entries['entries'])

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
      app.debug = True
      app.run(host='0.0.0.0')
