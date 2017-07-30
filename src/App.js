import React from 'react';
// import logo from './logo.svg';
// CSS style file
import './App.css';
// Database: projects, records, clients, tasks, etc.
import db from './../projectTracking'
// App header
import Header from './components/Header';
// Project overview tab
import ProjectOverview from './components/ProjectOverview';
// Time sheets tab
import TimeSheets from './components/TimeSheets';
// Project Management Dashboard
import PmDashboard from './components/PmDashboard';
// Test component
import Test from './components/Test';

class App extends React.Component {
  constructor (props) {
    // Pass props to parent class
    super (props);
    this.state = {
      testMode: true,
      // selectedMenu: 'Overview'
      // selectedMenu: 'Dashboard'
      selectedMenu: 'Time sheets'
    }
    
    this.changeMenuTab = this.changeMenuTab.bind(this);
  }

  changeMenuTab(menuTab) {
    console.log('Selected menu:', menuTab);
    this.setState(() => {
      return ({
        selectedMenu: menuTab
      })
    })
  }

  render() {
    return (
      <div>
        { this.state.testMode === true ? <Test /> : 
          <div>
            <Header appState={this.state} changeMenuTab={this.changeMenuTab}/>
            {this.state.selectedMenu === 'Overview' ? <ProjectOverview  menu={this.state.selectedMenu} db={db} /> : null}
            {this.state.selectedMenu === 'Dashboard' ? <PmDashboard menu={this.state.selectedMenu} db={db} /> : null}
            {this.state.selectedMenu === 'Time sheets' ? <TimeSheets  menu={this.state.selectedMenu} /> : null}
          </div>
        }
          
          
      </div>
    );
  }
}

export default App;
