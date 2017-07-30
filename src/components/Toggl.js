import React from 'react';
/**
 * const TogglAPI = require('toggl-api');
 * I have "npm install toggl-api --save" but gives an error on compiling
 * Apparently npm and react can work together but is not a straight forward process.
 * Continue preparing the backend functionality.
 */

// function CreateCalendarHeader() {
//   return ({
//     elementClassName: 'TS_CalenderRow_GridContainer',
//     elementId: 'TS_CalenderRow_GridContainer_header',
//     project: 'PROJECT',
//     task: 'TASK',
//     dep: 'DEP.',
//     mon: 'Mon',
//     tue: 'Tue',
//     wed: 'Wed',
//     thu: 'Thu',
//     fri: 'Fri',
//     sat: 'Sat',
//     tot: 'TOT'
//   })
// }

// function CreateCalendarFooter() {
//   return {
//     elementClassName: 'TS_CalenderRow_GridContainer',
//     elementId: 'TS_CalenderRow_GridContainer_footer',
//     project: null,
//     task: null,
//     dep: null,
//     mon: '12.25',
//     tue: '12.25',
//     wed: '12.25',
//     thu: '12.25',
//     fri: '12.25',
//     sat: '12.25',
//     tot: '38.75'
//   }
// }

function CreateCalendarEntry(x) {
  return ({
    elementClassName: 'TS_CalenderRow_GridContainer',
    elementId: null,
    project: x.project,
    task: x.task,
    dep: 'Civil',
    mon: x.startDate.getDay() == 1 ? x.duration : '0.0',
    tue: x.startDate.getDay() == 2 ? x.duration : '0.0',
    wed: x.startDate.getDay() == 3 ? x.duration : '0.0',
    thu: x.startDate.getDay() == 4 ? x.duration : '0.0',
    fri: x.startDate.getDay() == 5 ? x.duration : '0.0',
    sat: x.startDate.getDay() == 6 ? x.duration : '0.0',
    tot: '---'
  })
}

function RoundToNearest(duration, n) {
  return (Math.round(duration / n) * n).toFixed(2)
}

function Toggl(togglData) {
  return togglData.map((x) => {
    x.startDate = new Date(x.startDate);
    x.endDate = new Date(x.endDate);
    x.duration = RoundToNearest(x.duration, 0.25);
    return x
  }).map((x) => CreateCalendarEntry(x))
}

module.exports = Toggl;