import React from 'react';
// File system
import fs from 'fs';
// Login data
import loginData from './../../loginData'
const myUsername = loginData.username;
const myPassword = loginData.password;
const myApiToken = loginData.apiToken;
const myWorkspace = loginData.workspaceId;

// Toggl
import TogglClient from 'toggl-api';
const toggl = new TogglClient({apiToken: myApiToken});

// This is going to be passed from parent as props ----------
const startDate = '2017-07-03'
const endDate = '2017-07-07'
// ----------------------------------------------------------

// Get detailed report data
const pullTogglReport = (startDate, endDate) => {
  toggl.detailedReport({
    user_agent: myUsername,
    workspace_id: myWorkspace,
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
    // console.log('Writing data to \'output.json\' file...');
    //fs.writeFileSync('./output2.json', JSON.stringify(summary, null, 4));
    //console.log('File succesfuly written');
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