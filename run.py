#!/usr/bin/env python3
import glob
import json
import os
import shutil
import sys

from flask import Flask, render_template

# flask-frozen code from https://nicolas.perriault.net/code/2012/dead-easy-yet-powerful-static-website-generator-with-flask/
from flask_frozen import Freezer
from htmlmin.minify import html_minify

app = Flask(__name__)
freezer = Freezer(app)


@app.route("/")
def index():
    dicts = {}
    files = sorted(glob.glob("data/*.json"))
    for fname in files:
        fnum = int(os.path.basename(fname).split("-")[0])
        with open(fname, encoding="utf8") as f:
            dicts[fnum] = json.loads(f.read())
    return html_minify(render_template("index.html", dicts=dicts))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "build":
        freezer.freeze()
        # Static files that aren't built
        files = ["_headers", "style.css", "message.html"]
        for f in files:
            shutil.copy(os.path.join("templates", f), "build")
        # Empty favicon to avoid 404s
        with open("build/favicon.ico", "a", encoding="utf8") as f:
            pass

    else:
        app.debug = True
        app.run(host="0.0.0.0")
