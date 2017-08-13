import React from 'react';
import dateformat from 'dateformat';

// Login data
import loginData from './../../loginData'

// Toggl
import TogglClient from 'toggl-api';
const myToggl = new TogglClient({apiToken: loginData.apiToken});

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
      <div className='TSCalenderRowMon' style={props.data.mon === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.mon}</div>
      <div className='TSCalenderRowTue' style={props.data.tue === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.tue}</div>
      <div className='TSCalenderRowWed' style={props.data.wed === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.wed}</div>
      <div className='TSCalenderRowThu' style={props.data.thu === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.thu}</div>
      <div className='TSCalenderRowFri' style={props.data.fri === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.fri}</div>
      <div className='TSCalenderRowSat' style={props.data.sat === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.sat}</div>
      <div className='TSCalenderRowTOTAL' style={props.data.tot === '0.0' ? {color: 'var(--color-time-row-secondary)'} : null}>{props.data.tot}</div>
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
        console.log('TSControllersPushButton onClick event called');
        props.see();
      }}
    >
      PUSH
    </div>
  )
}
// UI component: push button function
// function TSControllersPushData() {
//   console.log('TSControllersPushData function called');
  
// }
// UI component: pull button
function TSControllersPullButton(props) {
  return (
    <div
      id='TSControllersPull'
      onClick={()=>{
        // Pull detailed report data from Toggl
        myToggl.detailedReport({
          user_agent: loginData.username,
          workspace_id: loginData.workspaceId,
          since: props.pullDates.startDate,
          until: props.pullDates.endDate
        }, function(err, timeEntry) {
          let togglReport = timeEntry.data.map((task) => {
            return {
              project: task.project,
              task: task.description,
              duration: new Date(task.dur)/3600000,   // duration in hours
              startDate: task.start,
              endDate: task.end
            }
          });
          // Store data within TimeSheet component state
          props.pullFunction(togglReport);
        });
      }}
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
        <TSControllersPullButton pullFunction={this.props.pull.pullFunction} pullDates={this.props.pull.pullDates}/>
        <TSControllersPushButton see={this.props.see}/>
      </div>
    )
  }
}

function GetLastRawTotals(timesheetDataToPlot) {
  // Declare totals and assign them zero values
  let totals = { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, tot: 0 };

  // Get total durations per week day
  timesheetDataToPlot.forEach((task)=>{
    if (task.mon !== 0) totals.mon += parseFloat(task.mon)
    if (task.tue !== 0) totals.tue += parseFloat(task.tue)
    if (task.wed !== 0) totals.wed += parseFloat(task.wed)
    if (task.thu !== 0) totals.thu += parseFloat(task.thu)
    if (task.fri !== 0) totals.fri += parseFloat(task.fri)
    if (task.sat !== 0) totals.sat += parseFloat(task.sat)
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
    mon: x.startDate.getDay() === 1 ? x.duration : '0.0',
    tue: x.startDate.getDay() === 2 ? x.duration : '0.0',
    wed: x.startDate.getDay() === 3 ? x.duration : '0.0',
    thu: x.startDate.getDay() === 4 ? x.duration : '0.0',
    fri: x.startDate.getDay() === 5 ? x.duration : '0.0',
    sat: x.startDate.getDay() === 6 ? x.duration : '0.0',
    tot: '---'
  })
}

// TimeSheets component ----------------------------------------------------
class TimeSheets extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      // db: member to store the raw data of Toggl before formating
      // Add an "empty" task object for rendering
      db: [{
        project: '-',
        task: '-',
        duration: null,
        startDate: null,
        endDate: null
      }],
      // Contains final data to be ploted in the timesheet
      dataToPlot: [
        {
          project: '-',
          task: '-',
          duration: null,
          startDate: new Date(null),
          endDate: new Date(null)
        }
      ],
      plotStartDate: '2017-07-03',
      plotEndDate:  '2017-07-07',
      projectList: '',
    }

    // Bind TimeSheets methods' this keyword to TimeSheet component
    this.storeData = this.storeData.bind(this);
    this.seeState = this.seeState.bind(this);
    this.getProjects = this.getProjects.bind(this);
  }

  // Pull data from Toggl and add it to the state of TimeSheets component
  storeData(data) {
    // Store raw data fetched from Toggl
    this.setState(()=>{
      return({db: data})
    });

    // Format data:
    //  - set startDate and endDate as Date type
    //  - round duration to nearest 0.25
    this.setState(()=>{
      return({dataToPlot: this.state.db.map((x) => {
        x.startDate = new Date(x.startDate);
        x.endDate = new Date(x.endDate);
        x.duration = RoundToNearest(x.duration, 0.25);
        return x
      })})
    });

    // Get projects
    let projectArray = [];
    this.state.db.forEach((x)=>{
      if (-1 === projectArray.indexOf(x.project)) {
        projectArray.push(x.project);
      }
    });
    this.setState(()=>{
      return (
        {projectList: projectArray}
      )
    });
  }

  getProjects() {
    let existingProjects = this.state.projectList;
    console.log('existingProjects:', existingProjects);
  }

  seeState() {
    //console.log('TimeSheet.state:\n', this.state);
    this.getProjects();
  }

  render () {
    // Get first day of the week ploted
    const earliestDate = this.state.dataToPlot
      .map((x) => x.startDate) // Get each task date
      .reduce((pre, cur) => Date.parse(pre) > Date.parse(cur) ? cur : pre); // Get earliest date
    // Prepare dataToPlot
    const timesheetDataToPlot = this.state.dataToPlot.map((x) => createCalendarEntry(x));
    // Calculate last row values (totals) accoring to dataToPlot
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
        <TSControllers pull={{pullFunction: this.storeData, pullDates: {startDate: this.state.plotStartDate, endDate: this.state.plotEndDate}}} see={this.seeState} />
      </div>
    )
  }
}

module.exports = TimeSheets;