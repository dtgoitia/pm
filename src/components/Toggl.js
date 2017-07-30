// Login data
import loginData from './../../loginData'

// Toggl
import TogglClient from 'toggl-api';
const myToggl = new TogglClient({apiToken: loginData.apiToken});

// This is going to be passed from parent as props ----------
const startDate = '2017-07-03'
const endDate = '2017-07-07'
// ----------------------------------------------------------

// Container object with all the toggl related functions
const Toggl = {

  // Get detailed report data
  pullTogglReport: (startDate, endDate) => {
    return myToggl.detailedReport({
      user_agent: loginData.username,
      workspace_id: loginData.workspaceId,
      since: startDate,
      until: endDate
    }, function(err, timeEntry) {
      let summary = timeEntry.data.map((task) => {
        return {
          project: task.project,
          task: task.description,
          duration: new Date(task.dur)/3600000,   // duration in hours
          startDate: task.start,
          endDate: task.end
        }
      });
      // console.log('summary:\n',summary);
      // return summary
    });
  }
}

module.exports = Toggl;