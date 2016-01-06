from flask import Flask, render_template
# flask-frozen code from https://nicolas.perriault.net/code/2012/dead-easy-yet-powerful-static-website-generator-with-flask/
from flask_frozen import Freezer
from collections import OrderedDict
import glob, json, sys

app = Flask(__name__)
freezer = Freezer(app)

@app.route('/')
def index():
    dicts = []
    files = sorted(glob.glob("data/*.json"))
    for fname in files:
      with open(fname) as f:
        dicts.append(json.loads(f.read()))
    return render_template("index.html", dicts=dicts)

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
    else:
      app.debug = True
      app.run(host='0.0.0.0')
