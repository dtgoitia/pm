import React from 'react';

const consoleOutput = () => {
  console.clear();
  console.log('Hi!');
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
      </div>
    )
  }
}

module.exports = Test;