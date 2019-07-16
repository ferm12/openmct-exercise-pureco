# Open MCT Coding Exercise

This is my solution to the Open MCT Coding exercise. 

On this exercise I wrote a single page JavaScript web application that:
1. Queries the given telemetry server for the last 15 minutes of historical telemetry data for
either or both of the “pwr.v” and “pwr.c” telemetry points. The telemetry are 
selectable by the user. Changing the selected telemetry points results in only data
from the selected telemetry points being shown in the table. ie. data for a deselected
telemetry point are cleared from the table.

2. Displays the returned telemetry data in an HTML table sorted ascending or descending by
timestamp. The sort order is selectable by the user.

3. Subscribes for new telemetry from the selected telemetry points and add rows to the table
as new data becomes available, maintaining the selected sort order. When the user
changes the selected telemetry point, the app only maintains subscriptions to selected
telemetry points, and any telemetry data for a deselected telemetry point are 
removed

## Prerequisites

* [node.js](https://nodejs.org/en/)
    * Mac OS: We recommend using [Homebrew](https://brew.sh/) to install node.
    ```
    $ brew install node
    ```
    * Windows: https://nodejs.org/en/download/
    * linux: https://nodejs.org/en/download/
* [git](https://git-scm.com/)
    * Mac OS: If XCode is installed, git is likely to already be available from your command line. If not, git can be installed using [Homebrew](https://brew.sh/).
    ```
    $ brew install git
    ```
    * Windows: https://git-scm.com/downloads
    * linux: https://git-scm.com/downloads

## Installing the Exercise

```
git clone https://github.com/ferm12/openmct-exercise-pureco.git
cd openmct-exercise-pureco
npm install
npm start
```
Once the server is running navigate to http://localhost:8080/table/ to display the table.
The table html, js, and css are in the table folder. 
