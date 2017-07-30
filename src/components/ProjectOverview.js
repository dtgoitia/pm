import React from 'react';

// Project data
import db from './../../projectTracking';

const projects = db.projects;

// class ProjectSummary extends React.Component {
//   constructor(props) {
//     super();
//     console.log(props.projectDataBase);
//   }
//   render() {
//     return (
//        <div className='test'>
//          <h3>Project Database JSON:</h3>
//          <div>{JSON.stringify(this.props.projectDataBase)}</div>
//       </div>
//     )
//   }
// }

class ProjectSummary extends React.Component {
  constructor(props) {
    super();
    console.log(props.projectDataBase);
  }
  render() {
    return (
       <div></div>
    )
  }
}

class ProjectOverview extends React.Component {
  render() {
    return (
        <div>
          <ProjectSummary projectDataBase={projects} />
          <ul className='ProjectOverviewList'>
            <h1>Project Overview</h1>
            {projects.map((x)=>{
              return (
                <li
                  key={x.projectNumber}
                  className='ProjectOverviewItem'
                  id={x.projectNumber}
                  onClick={()=>{
                  }}
                >
                  <div className='POI_ProjectID'>
                    <div className='POI_ProjectProjectNumber'>{x.projectNumber}</div>
                    <div className='POI_ProjectID2'>
                      <div className='POI_ProjectName'>{x.projectName}</div>
                      <div className='POI_ProjectClient'>{x.client}</div>
                    </div>
                  </div>
                  <div className='POI_Status'>{x.projectStatus}</div>
                </li>
              )
            })}
          </ul>
        </div>
    )
  }
}
 
module.exports = ProjectOverview;