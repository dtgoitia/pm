import React from 'react';
import dateformat from 'dateformat';
// import Toggl from './Toggl';
// import togglRawData from './../../output.json';
let togglRawData = [{
  project: '-',
  task: '-',
  duration: null,
  startDate: null,
  endDate: null
}];

// Login data
import loginData from './../../loginData'

// Toggl
import TogglClient from 'toggl-api';
const myToggl = new TogglClient({apiToken: loginData.apiToken});

// This is going to be passed from parent as props ----------
const startDate = '2017-07-03';
const endDate = '2017-07-07';
// ----------------------------------------------------------

const togglData = togglRawData.map((x) => {
  return {
    project: x.project,
    task: x.task,
    duration: x.duration,
    startDate: new Date(x.startDate),
    endDate: new Date(x.endtDate)
  }
})

// Get dates of each task
const allDates = togglData.map((x) => {
  return x.date
})
// Get earliest date
function GetEarliestDate(dateArray) {
  return dateArray.reduce((pre, cur) => {
    return Date.parse(pre) > Date.parse(cur) ? cur : pre;
  })
}
let earliestDate = GetEarliestDate(allDates);

// UI component: time sheet header
function TSCalendarFirstRow() {
  return (
    <li>
      <div className='TSCalenderRowGridContainer' id='TSCalenderRowGridContainerHeader'>
        <div className='TSCalenderRowProject'>PROJECT</div>
        <div className='TSCalenderRowTask'>TASK</div>
        <div className='TSCalenderRowDepartment'>DEP.</div>
        <div className='TSCalenderRowMon'>Mon</div>
        <div className='TSCalenderRowTue'>Tue</div>
        <div className='TSCalenderRowWed'>Wed</div>
        <div className='TSCalenderRowThu'>Thu</div>
        <div className='TSCalenderRowFri'>Fri</div>
        <div className='TSCalenderRowSat'>Sat</div>
        <div className='TSCalenderRowTOTAL'>TOT</div>
      </div>
    </li>
  )
}

// UI component: time sheet row
function TSCalendarRow(props) {
  return (
    <li
      className='TSCalenderRowGridContainer'
    >
      <div className='TSCalenderRowProject'>{props.data.project}</div>
      <div className='TSCalenderRowTask'>{props.data.task}</div>
      <div className='TSCalenderRowDepartment'>{props.data.dep}</div>
      <div className='TSCalenderRowMon' style={props.data.mon == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.mon}</div>
      <div className='TSCalenderRowTue' style={props.data.tue == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.tue}</div>
      <div className='TSCalenderRowWed' style={props.data.wed == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.wed}</div>
      <div className='TSCalenderRowThu' style={props.data.thu == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.thu}</div>
      <div className='TSCalenderRowFri' style={props.data.fri == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.fri}</div>
      <div className='TSCalenderRowSat' style={props.data.sat == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.sat}</div>
      <div className='TSCalenderRowTOTAL' style={props.data.tot == '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.tot}</div>
    </li>
  )
}

// UI component: time sheet footer
function TSCalendarLastRow(props) {
  return (
    <li
      className='TSCalenderRowGridContainer'
      id='TSCalenderRowGridContainerFooter'
    >
      <div className='TSCalenderRowProject'></div>
      <div className='TSCalenderRowTask'></div>
      <div className='TSCalenderRowDepartment'></div>
      <div className='TSCalenderRowMon'>{props.totals.mon}</div>
      <div className='TSCalenderRowTue'>{props.totals.tue}</div>
      <div className='TSCalenderRowWed'>{props.totals.wed}</div>
      <div className='TSCalenderRowThu'>{props.totals.thu}</div>
      <div className='TSCalenderRowFri'>{props.totals.fri}</div>
      <div className='TSCalenderRowSat'>{props.totals.sat}</div>
      <div className='TSCalenderRowTOTAL'>{props.totals.tot}</div>
    </li>
  )
}

// UI component: push button
function TSControllersPushButton(props) {
  return (
    <div
      id='TSControllersPush'
      onClick={()=>{
        props.see();
        TSControllersPushData()
      }}
    >
      PUSH
    </div>
  )
}
// UI component: push button function
function TSControllersPushData() {
  alert('I am pushing data!');
}
// UI component: pull button
function TSControllersPullButton(props) {
  return (
    <div
      id='TSControllersPull'
      onClick={()=>props.pull()}
    >
      PULL
    </div>
  )
}
// UI component: pull and push buttons
class TSControllers extends React.Component {
  render() {
    return (
      <div className='TSControllers'>
        <TSControllersPullButton pull={this.props.pull}/>
        <TSControllersPushButton see={this.props.see}/>
      </div>
    )
  }
}

function GetLastRawTotals(timesheetDataToPlot) {
  // Declare totals and assign them zero values
  let totals = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, tot: 0 };

  // Get total durations per week day
  timesheetDataToPlot.map((task)=>{
    { task.mon != 0 ? totals.mon = totals.mon + parseFloat(task.mon) : null}
    { task.tue != 0 ? totals.tue = totals.tue + parseFloat(task.tue) : null}
    { task.wed != 0 ? totals.wed = totals.wed + parseFloat(task.wed) : null}
    { task.thu != 0 ? totals.thu = totals.thu + parseFloat(task.thu) : null}
    { task.fri != 0 ? totals.fri = totals.fri + parseFloat(task.fri) : null}
    { task.sat != 0 ? totals.sat = totals.sat + parseFloat(task.sat) : null}
  })

  // Get total value
  totals.tot = totals.mon + totals.tue + totals.wed + totals.thu + totals.fri + totals.sat

  // Convert totals to strings and format them with 2 decimals
  totals.mon = parseFloat(Math.round(totals.mon * 100) / 100).toFixed(2);
  totals.tue = parseFloat(Math.round(totals.tue * 100) / 100).toFixed(2);
  totals.tue = parseFloat(Math.round(totals.tue * 100) / 100).toFixed(2);
  totals.wed = parseFloat(Math.round(totals.wed * 100) / 100).toFixed(2);
  totals.thu = parseFloat(Math.round(totals.thu * 100) / 100).toFixed(2);
  totals.fri = parseFloat(Math.round(totals.fri * 100) / 100).toFixed(2);
  totals.sat = parseFloat(Math.round(totals.sat * 100) / 100).toFixed(2);
  totals.tot = parseFloat(Math.round(totals.tot * 100) / 100).toFixed(2);
  
  return totals
}

function RoundToNearest(duration, n) {
  return (Math.round(duration / n) * n).toFixed(2)
}
function createCalendarEntry(x) {
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
function parseData(togglData) {
  return togglData.map((x) => {
    x.startDate = new Date(x.startDate);
    x.endDate = new Date(x.endDate);
    x.duration = RoundToNearest(x.duration, 0.25);
    return x
  }).map((x) => createCalendarEntry(x))
}

// Get detailed report data
const pullTogglReport = (startDate, endDate) => {
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
};

// TimeSheets component ----------------------------------------------------
class TimeSheets extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      db: {},
      thing: 'haha'
    }

    this.pullData = this.pullData.bind(this);
    this.seeState = this.seeState.bind(this);
    this.updateTimesheetDataBase = this.updateTimesheetDataBase.bind(this);
  }

  updateTimesheetDataBase(data){
    // Update state's db member
    this.setState(()=>{
      return({db: data})
    });
  }

  pullData() {
    // Pull data from Toggl and add it to the state of TimeSheets component
    this.setState(()=>{
      return({db: 'newTogglDataBase'})
    });
    
    console.log('this.state.db:', this.state.db);
  }

  seeState() {
    console.log('TimeSheet.state:', this.state);
  }

  render () {
    // raw data
    const timesheetDataToPlot = parseData(togglData);
    const lastRowTotals = GetLastRawTotals(timesheetDataToPlot);

    return (
      <div className='TS_Container'>
        Calendar {dateformat(earliestDate, 'd mmm')}
        <ul className='TS_Calendar'>
          <TSCalendarFirstRow />
          {timesheetDataToPlot.map(function (x,index) {
            return <TSCalendarRow data={x} key={index}/>
          })}
          <TSCalendarLastRow totals={lastRowTotals}/>
        </ul>
        <TSControllers pull={this.pullData} see={this.seeState} />
      </div>
    )
  }
}

module.exports = TimeSheets;