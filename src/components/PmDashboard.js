import React from 'react';

// import projectTracking from './../../projectTracking';

class PmDashboardSearchBar extends React.Component {
  render() {
    return (
        <div
          className='PMD_SearchBar'
        >
          Hi! I am PmDashboardSearchBar!
          <form action='' method='post'>
            <input
              type='text' name='fname'
            />
          </form>
        </div>
    )
  }
}
class PmDashboardToDoList extends React.Component {
  render() {
    return (
        <div
          className='PMD_ToDoList'
        >
          Hi! I am PmDashboardToDoList!
        </div>
    )
  }
}
class PmDashboardTracker extends React.Component {
  render() {
    return (
        <div
          className='PMD_Tracker'
        >
          Hi! I am PmDashboardTracker!
        </div>
    )
  }
}
class PmDashboardProjectList extends React.Component {
  render() {
    return (
      <div
        className='PMD_ProjectList'
      >
        List of available projects:
        <ul className='PMD_ProjectList_Container'>
          {this.props.db.projects.map((data,index)=>{
            return (
              <li key={data.projectNumber}>
                {data.projectNumber} - {data.projectName}
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}
class PmDashboard extends React.Component {
  render() {
    return (
        <div
          className='PMD_Container'
        >
          Hi! I am PmDashboard!
          { null ? <PmDashboardProjectList db={this.props.db} /> : null}
          { null ? <PmDashboardSearchBar /> : null}
          { null ? <PmDashboardToDoList /> : null}
          { null ? <PmDashboardTracker /> : null}
        </div>
    )
  }
}
 
module.exports = PmDashboard;