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
  let rounding = 0.01;
  return ({
    elementClassName: 'TS_CalenderRow_GridContainer',
    elementId: null,
    project: x.project,
    task: x.task,
    dep: 'Civil',
    mon: x.startDate.getDay() === 1 ? RoundToNearest(x.duration, rounding) : '0.0',
    tue: x.startDate.getDay() === 2 ? RoundToNearest(x.duration, rounding) : '0.0',
    wed: x.startDate.getDay() === 3 ? RoundToNearest(x.duration, rounding) : '0.0',
    thu: x.startDate.getDay() === 4 ? RoundToNearest(x.duration, rounding) : '0.0',
    fri: x.startDate.getDay() === 5 ? RoundToNearest(x.duration, rounding) : '0.0',
    sat: x.startDate.getDay() === 6 ? RoundToNearest(x.duration, rounding) : '0.0',
    tot: '---'
  })
}

function joinIdenticalData(dataToPlot) {
  // console.log('dataToPlot:', dataToPlot);
  let returnDataToPlot = [];
  let taskExists = false;
  let showLogs = false;
  dataToPlot.forEach((task, i)=>{
    showLogs === true ? console.log('Checking task (' + i + '): ' + task.task + ' (' + task.project + ')') : null;
    // Reset variables for a new loop
    taskExists = false;
    
    if (i === 0) {
      // Add first entry
      returnDataToPlot.push(dataToPlot[0]);
    } else {
      // Check if the project exists
      returnDataToPlot.forEach( (readyTask, ii) => {
        showLogs === true ? console.log('\t(' + i + ':' + ii +') Referen: ' + readyTask.task + ' (' + readyTask.project + ')') : null;
        if (
          task.project === readyTask.project
          && task.task === readyTask.task
          && task.startDate !== readyTask.startDate
        ) {
          taskExists = true;
          
          let sum = returnDataToPlot[ii].duration + task.duration;
          showLogs === true ? console.log('returnDataToPlot[ii].duration:', returnDataToPlot[ii].duration) : null;
          showLogs === true ? console.log('task.duration:', task.duration) : null;
          showLogs === true ? console.log('sum:', sum) : null;
          
          if (
            returnDataToPlot[ii].project === "5089 - GWP SN02" &&
            returnDataToPlot[ii].task === "Update all drawings to latest planning layout"
          ) {
            console.log('returnDataToPlot[ii].duration:', returnDataToPlot[ii].duration);
            console.log('task.duration:', task.duration);
            console.log('sum:', sum);
          }
          returnDataToPlot[ii].duration = readyTask.duration + task.duration;
          
          // console.log('\tJOINED, returnDataToPlot:', returnDataToPlot);
          showLogs === true ? console.log('\tJOINED') : null;
          showLogs === true ? console.log('---------------------') : null;
        }
        }); // END forEach
        
        if (taskExists === false) {
          returnDataToPlot.push(task);
          // console.log('\tADDED, returnDataToPlot:', returnDataToPlot);
        }
    }
  });
  showLogs === true ? console.log('returnDataToPlot:', returnDataToPlot) : null;
  // console.log('dataToPlot:', dataToPlot);
  // return returnDataToPlot
  return dataToPlot
}

// TSProjectFilter component -----------------------------------------------
class TSProjectFilter extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    let TSProjectFilterItemList = 'no projects!'
    if (this.props.allProjects) {
      TSProjectFilterItemList = this.props.allProjects.map((x)=>{
        return (
          <li key={x}>
            <TSProjectFilterItem
              project={x}
              hideProject={this.props.hideProject}
              showProject={this.props.showProject}
            />
          </li>
        )
      })
    }
    return (
      <div>
        <ul className='ProjectFilter'>
          {TSProjectFilterItemList}
        </ul>
      </div>
    )
  }
}


// TSProjectFilterItem component -----------------------------------------------
class TSProjectFilterItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = { selected: true }
    
    this.updateState = this.updateState.bind(this);
  }

  updateState() {
    let msg = this.props.project + ' project '
    if (this.state.selected === true) {
      msg += 'unselected'
      this.setState({ selected: false });
      this.props.hideProject(this.props.project);
    } else {
      msg += 'selected'
      this.setState({ selected: true });
      this.props.showProject(this.props.project);
    }
    // Print message on log
    console.log(msg);
  }

  render() {
    return (
      <div
      className='ProjectFilterItem'
      onClick={this.updateState.bind(null)}
      style={ this.state.selected === true ? { backgroundColor: 'var(--color-project-filter-selected)'} : { backgroundColor: 'var(--color-project-filter-unselected)'}}
      >
        {this.props.project}
      </div>
    )
  }
}

// TimeSheets component ----------------------------------------------------
class TimeSheets extends React.Component {
  constructor (props) {
    super (props);
    this.state = {
      // db: raw data of Toggl
      db: [{
        project: '-',
        task: '-',
        duration: null,
        startDate: null,
        endDate: null
      }],
      // dbProjectFilter: db after applying project filter
      dbProjectFilter: [{
        project: '-',
        task: '-',
        duration: null,
        startDate: null,
        endDate: null
      }],
      // dbJoin: dbProjectFilter after joining identical tasks duration
      dbJoin: [{
        project: '-',
        task: '-',
        duration: null,
        startDate: null,
        endDate: null
      }],
      // dataPlot contains final data to be ploted in the timesheet
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
      // projectList: member to store all the projects existing in db
      projectList: '',
      // projectsToPlot: member to store all the projects to plot
      projectsToPlot: ''
    }

    // Bind TimeSheets methods' this keyword to TimeSheet component
    this.storeData = this.storeData.bind(this);
    this.seeState = this.seeState.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.hideProject = this.hideProject.bind(this);
    this.showProject = this.showProject.bind(this);
    // this.showProject = this.showProject.bind(this);
  }

  // Remove a project to be shown from this.state.projectToPlot
  hideProject(project) {
    // projectArray : stores new list of projects to plot (after
    // removing passed "project")
    let projectArray = [];
    this.state.projectsToPlot.forEach((plotedProject)=>{
      if (plotedProject !== project) projectArray.push(plotedProject);
    });
    // Update this.state.projectsToPlot
    this.setState(()=>{ return ({ projectsToPlot: projectArray }) });

    // dataToPlotVar : stores new list of data to plot (after
    // removing passed "project")
    let dataToPlotVar = [];
    this.state.db.forEach((x)=>{
      if (-1 !== projectArray.indexOf(x.project) ) {
        dataToPlotVar.push(x);
      }
    });

    // When there is not data to plot, set dataToPlot to its the default initial value
    if (dataToPlotVar.length === 0) {
      dataToPlotVar = [
        {
          project: '-',
          task: '-',
          duration: null,
          startDate: new Date(null),
          endDate: new Date(null)
        }
      ]
    }
    // Update this.state.dataToPlot
    this.setState(()=>{ return ({ dataToPlot: dataToPlotVar }) });
  }

  // Add a project to be shown from this.state.projectToPlot
  showProject(project) {
    // projectArray : stores new list of projects to plot (after
    // adding passed "project")
    let projectArray = this.state.projectsToPlot;
    if ( -1 === this.state.projectsToPlot.indexOf(project) ) {
      // Add project to projectArray
      projectArray.push(project);
      // Update this.state.projectsToPlot
      this.setState(()=>{ return ({ projectsToPlot: projectArray }) });

      // dataToPlotVar : stores new list of data to plot (after
      // removing passed "project")
      let dataToPlotVar = [];
      this.state.db.forEach((x)=>{
        if (-1 !== projectArray.indexOf(x.project) ) {
          dataToPlotVar.push(x);
        }
      });

      // Update this.state.dataToPlot
      this.setState(()=>{ return ({ dataToPlot: dataToPlotVar }) });
    }
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
        x.duration = x.duration;
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
        {
          projectList: projectArray,
          projectsToPlot: projectArray
        }
      )
    });
  }

  getProjects() {
    // let existingProjects = this.state.projectList;
    console.log('TimeSheet.getProjects() runned');
    console.log('this.state.projectList:', this.state.projectList);
    console.log('this.state.projectsToPlot:', this.state.projectsToPlot);
  }

  seeState() {
    //console.log('TimeSheet.state:\n', this.state);
    this.getProjects();
  }

  render () {
    // --- UI DATA PREPROCESSING ------------------------------------------

    // Get first day of the week ploted
    const earliestDate = this.state.dataToPlot
      .map((x) => x.startDate) // Get each task date
      .reduce((pre, cur) => Date.parse(pre) > Date.parse(cur) ? cur : pre); // Get earliest date
    
    console.log('A this.state.db[30].duration:', this.state.db[30] ? this.state.db[30].duration : null);
    // --- UI BUILDING ---------------------------------------------------

    // Join identical tasks
    const compactDataToPlot = joinIdenticalData(this.state.dataToPlot);
    // const compactDataToPlot = this.state.dataToPlot;

    console.log('B this.state.db[30].duration:', this.state.db[30] ? this.state.db[30].duration : null);
    // Prepare dataToPlot
    const timesheetDataToPlot = compactDataToPlot.map((x) => createCalendarEntry(x));

    // Calculate last row values (totals) accoring to dataToPlot
    const lastRowTotals = GetLastRawTotals(timesheetDataToPlot);
    let existingProjects = this.state.projectList;




    // --- RETURN UI -----------------------------------------------------

    return (
      <div className='TS_Container'>
        Calendar {dateformat(earliestDate, 'd mmm')}
        <TSProjectFilter
          allProjects={existingProjects ? existingProjects : null}
          hideProject={this.hideProject}
          showProject={this.showProject}
        />
        <ul className='TS_Calendar'>
          <TSCalendarFirstRow />
          {timesheetDataToPlot.map(function (x,index) {
            return <TSCalendarRow data={x} key={index}/>
          })}
          <TSCalendarLastRow totals={lastRowTotals}/>
        </ul>
        <TSControllers
          pull={{pullFunction: this.storeData, pullDates: {startDate: this.state.plotStartDate, endDate: this.state.plotEndDate}}}
          see={this.seeState}
        />
      </div>
    )
  }
}

module.exports = TimeSheets;