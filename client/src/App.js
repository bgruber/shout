import {create as timesync} from 'timesync';
import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// for debugging in js console...
window.timesync = timesync;

var intervalMs = 750;
var ts = timesync({
  server: '/timesync'
});
var vibrationRatio = 0.25;
var downbeatRato = 0.5;

class App extends Component {
  constructor(props){
    super(props);
    this.incrementCursor = this.incrementCursor.bind(this);
    this.setCursor = this.setCursor.bind(this);
    this.startCursor = this.startCursor.bind(this);
    this.waitForTime = this.waitForTime.bind(this);
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

  setCursor() {
    var newCursor = Math.floor((ts.now() / intervalMs)) % this.state.chant.length

    if (newCursor === 0) {
      var stepTime = intervalMs;
      var vibTime = Math.floor(stepTime * vibrationRatio);
      var restTime = stepTime - vibTime;
      var downBeat = Math.floor(stepTime * downbeatRato);
      var downRest = stepTime - downBeat;
      var vibrationPattern = [downBeat, downRest];
      for(var i = 1; i !== this.state.chant.length; i++) {
	       vibrationPattern.push(vibTime, restTime);
      }
      navigator.vibrate( vibrationPattern)
    }

    this.setState({
      cursor: newCursor
    });
  }

  incrementCursor() {
    this.setState({
      cursor: (this.state.cursor + 1)
    });
  }

  startCursor() {
    // interval start
    this.setState({
      interval: setInterval(this.setCursor, intervalMs)
    });
  }

  waitForTime(tsState) {
    console.log('timesync state: ' + tsState);
    if (tsState !== "end") {
      return;
    }

    if (this.state.interval !== undefined) {
      console.log('clearing interval')
      clearInterval(this.state.interval)
      this.setState({
	interval: undefined
      });
    }
    // we want to calculate the amount of time between now and the
    // next point at which the sync'd time is an even multiple of intervalMs.
    var now = ts.now();
    var cNow = Math.ceil(now);
    var nextEvenMultiple = cNow + intervalMs - (cNow % intervalMs);
    nextEvenMultiple += intervalMs; // add on an extra interval in case we'll miss the first one in the time it takes to calculate
    var waitTime = nextEvenMultiple - ts.now();
    setTimeout(this.startCursor, waitTime);
  }

  componentDidMount() {
    ts.on('sync', this.waitForTime)
  }

  render() {
    return (
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{flex: 0}}>
          <h2>Shout</h2>
        </div>
        <div style={{flex: 1, backgroundColor: 'blue'}}>
          <div style={{display: 'flex', flexDirection: 'column', fontSize: 72, textAlign: 'center', height: '100%'}}>
            {this.state.chant.map((c, i)=>{
              const isHighlighted = i == this.state.cursor;
              return(
                <div style={{flex: 1, backgroundColor: (isHighlighted) ? 'red' : 'transparent'}}>
                  {this.state.chant[i]}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
