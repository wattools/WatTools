# WatTools
A directory of various tools for uWaterloo students, generally written _by_ uWaterloo students.

## Dev
We currently use Python 3.10.1, but the project works with 3.7+. If you do use a different version of Python, remove `python_version` from the Pipfile.

If not already installed, run `pip install pipenv`. Then, run `pipenv install` to download all dependencies.

Start an interactive webserver with `pipenv run python run.py` - the server will update on any changes to the source code. If static files (CSS, images) are not updating, reload your browser with `Ctrl+F5`.

## Production
Build a static version with `python run.py build`, and point the webserver at the `build` directory. Or rsync the contents somewhere.

### Removal Cycle
When tools have become unmaintained or are otherwise broken, they will be moved to the "Dead" category. In `99-dead.json` these entries will include a `Marked Dead` field. After being marked dead for >= 1 month, entries in the file are eligible to be fully removed.
