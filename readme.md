# WatTools
A directory of various tools for uWaterloo students, generally written _by_ uWaterloo students.

## Building
### Dev
This should work with any Python version >=3.7.

If not already installed, run `pip install pipenv`. Then, run `pipenv install` to download all dependencies.

Start an interactive webserver with `pipenv run python run.py` - the server will update on any changes to the source code. If static files (CSS, images) are not updating, reload your browser with `Ctrl+F5`.

### Production
Build a static version with `pipenv run python run.py build`, and point the webserver at the `build` directory. Or rsync the contents somewhere.

### Cloudflare Pages
The project is currently hosted on Cloudflare Pages to remove as much overhead as possible. The build system is configured to comment on any PR with a link to a preview.

## Tool Removal Cycle
When tools have become unmaintained or are otherwise broken, they will be moved to the "Dead" category. In `99-dead.json` these entries will include a `Marked Dead` field. After being marked dead for >= 1 month, entries in the file are eligible to be fully removed.

## Legacy
### wattools.com
Launched Aug 2011 (https://www.reddit.com/r/uwaterloo/comments/j93yk/wattools_a_collection_of_tools_for_university_of/)
Domain lapsed (https://www.reddit.com/r/uwaterloo/comments/3xjjvy/what_happened_to_wattoolscom/)
### uwaterloo.xyz
Relaunched Jan 2016 (https://www.reddit.com/r/uwaterloo/comments/3zmgx7/i_gave_up_waiting_for_wattools_to_be_fixed_and/)
Domain transferred to the university in Nov 2021 
### wattools.ca
Transferred domains in Nov 2021 to make sure the university won't be annoyed at new people taking over (https://www.reddit.com/r/uwaterloo/comments/qxsnfa/any_active_student_want_to_take_over/)
Currently the domain is paid for through Nov 2024, but is set to not auto-renew, and will expire unless transferred. (registered through Canspace - https://www.canspace.ca/)
