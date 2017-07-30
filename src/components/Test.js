import React from 'react';
// Login data
import loginData from './../../loginData'

// Toggl
import TogglClient from 'toggl-api';
const myToggl = new TogglClient({apiToken: loginData.apiToken});

// This is going to be passed from parent as props ----------
const startDate = '2017-07-03'
const endDate = '2017-07-07'
// ----------------------------------------------------------

// Get detailed report data
const pullTogglReport = (startDate, endDate) => {
  myToggl.detailedReport({
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
    console.log('summary:\n',summary);
    return summary 
  });
}

const consoleOutput = () => {
  console.clear();
  console.log('Hi!');
  console.log('loginData:', loginData);
  let pulledData = pullTogglReport(startDate,endDate);
  console.log('pulledData:', pulledData);
}

class Test extends React.Component {
  render(){
    // Clear console
    setTimeout(consoleOutput, 1000);
    return <h1>hi!</h1>
  }
}

module.exports = Test;