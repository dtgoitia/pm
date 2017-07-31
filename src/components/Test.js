import React from 'react';

const consoleOutput = () => {
  console.clear();
  console.log('Hi!');
}

class Test extends React.Component {
  constructor(props){
    super();
    this.state = {
      title: 'Mr.'
    }
  }

  handleChange(event) {
    this.setState({title: event.target.value})
  }

  render(){
    // Clear console
    setTimeout(consoleOutput, 1000);
    return <input type="text" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} />
  }
}

module.exports = Test;