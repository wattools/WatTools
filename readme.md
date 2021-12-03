# WatTools
A directory of various tools for uWaterloo students, generally written _by_ uWaterloo students.

## Dev
Code is basic enough that it should run with Python 2.7, 3.4+; only tested with Python 3.7 since that's what the build uses.

Start an interactive webserver with `python run.py` - live reload with Werkzeug.
## Production
Build a static version with `python run.py build`, and point the webserver at the `build` directory. Or rsync the contents somewhere.

### Removal Cycle
When tools have become unmaintained or otherwise broken, they will be added to the "Dead" section of the page. In `99-dead.json` these entries will include a `Marked Dead` field. After being marked dead for >= 1 month, entries in the file are eligible to be fully removed.
