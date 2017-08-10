import React from 'react';
import $ from 'jquery';

// const consoleOutput = () => {
//   console.clear();
//   console.log('Hi!');
// }

const testfuncion = () => {
  console.log('Let\'s go!');
  $.ajax({
    url: "http://192.168.1.11/Timesheet/AddTimesheet",
    data: {
      TimeSheetID: "0",
      StaffID: "18",
      WeekStartDate: "14/08/2017", // Exact format they need: "19/06/2017"
      ProjectID: "5396 - Wheatpieces Phase 1A", // "5396 - Wheatpieces Phase 1A"
      Activity: "Engineering",
      DEPT: "C",
      MON: "2.25",
      TUE: "0",
      WED: "0",
      THUR: "0",
      FRI: "0",
      WKD: "0",
      ApproveTimesheet: false,
      ApproveOT: false
    },
    type: "POST",
    success: function() {
      console.log('SUCCESSFULL!');
    },
    error: function() {
      console.log('ERROR!');
    }
  });    
}

class Test extends React.Component {
  constructor(props){
    super();
    this.state = {
      title1: 'Mr.'
    }
  }

  handleChange(event) {
    this.setState({title: event.target.value})
    console.log('event.target.value:', event.target.value);
  }

  render(){
    // Clear console
    return (
      <div>
        <input type="text" name1="title" placeholder='This is a placehorlder string' value={this.state.title} onChange={this.handleChange.bind(this)} />
        <input type="text" name2="title" placeholder='This is a placehorlder string' value={this.state.title} onChange={this.handleChange.bind(this)} />
        <button onClick={testfuncion}>HHHHHHHHHHHHHHH</button>
      </div>
    )
  }
}

module.exports = Test;