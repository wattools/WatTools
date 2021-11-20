# WatTools
A directory of various tools for uWaterloo students, generally written _by_ uWaterloo students.

## Dev
Code is basic enough that it should run with Python 2.7, 3.4+; only tested with Python 3.7 since that's what the build uses.

Start an interactive webserver with `python run.py` - live reload with Werkzeug.
## Production
Build a static version with `python run.py build`, and point the webserver at the `build` directory. Or rsync the contents somewhere.
