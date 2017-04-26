import {create as timesync} from 'timesync';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// for debugging in js console...
window.timesync = timesync

class App extends Component {
  constructor(props){
    super(props);
    this.incrementCursor = this.incrementCursor.bind(this);
    this.startCursor = this.startCursor.bind(this);
    this.state = {
      cursor: 0,
      chant: [
        "no",
        "ban",
        "you",
        "suck"
      ]
    };
  }

  incrementCursor() {
    this.setState({
      cursor: (this.state.cursor + 1)
    });
  }

  startCursor(){
    // interval start
    this.setState({
      interval: setInterval( this.incrementCursor, 1000)
    });
  }

  componentDidMount() {
    // init timesync?

    // use timeout to decide when to call startcursor?
    this.startCursor();
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Shout</h2>
        </div>
        <div className="App-intro" style={{fontSize: 72, textAlign: 'center'}}>
          {this.state.chant.map((c, i)=>{
            const isHighlighted = i == this.state.cursor%this.state.chant.length;
            return(
              <div style={{backgroundColor: (isHighlighted) ? 'red' : 'white'}}>
                {this.state.chant[i]}
              </div>
            );
          })}
        </div>
        <p>{this.state.cursor}</p>
      </div>
    );
  }
}

export default App;
