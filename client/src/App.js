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

const WAIT_FOR_SYNC = 0;
const COUNTDOWN = 1;
const CHANTING = 2;

class App extends Component {

  constructor(props){
    super(props);
    this.setCursor = this.setCursor.bind(this);
    this.startCursor = this.startCursor.bind(this);
    this.waitForTime = this.waitForTime.bind(this);
    this.state = {
      chant: [
        "no",
        "ban",
        "you",
        "suck"
      ],
      stage: WAIT_FOR_SYNC
    };
  }

  setCursor() {
    var newCursor = Math.floor((ts.now() / intervalMs)) % this.state.chant.length

    var newStage = (newCursor === 0)
	? Math.min(this.state.stage + 1, CHANTING)
	: this.state.stage;

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
      if (navigator.vibrate) {
	navigator.vibrate( vibrationPattern)
      }
    }

    this.setState({
      cursor: newCursor,
      stage: newStage
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
    var waitTime = nextEvenMultiple - ts.now();
    setTimeout(this.startCursor, waitTime);
  }

  componentDidMount() {
    ts.on('sync', this.waitForTime)
  }

  render() {
    const chantColors = [
      '#00A8FF',
      '#00D13F',
      '#FFCE00',
      '#E71614',
    ];

    return (
      <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
        <div style={{fontWeight: 100, letterSpacing: 2, flex: 0, backgroundColor: '#0F1721', color: 'rgba(255,255,255,.5)', textAlign: 'center'}}>
          {this.state.stage == WAIT_FOR_SYNC &&
            <p>synchronizing</p>
          }
          {this.state.stage != WAIT_FOR_SYNC &&
            <p>shout!</p>
          }
        </div>

        {this.state.stage == WAIT_FOR_SYNC &&
          <div style={{display: 'flex', flex: 1, backgroundColor: '#0F1721', color: '#fff', width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div><img src="puff.svg" width="120" alt="" /></div>
          </div>
        }

        {this.state.stage != WAIT_FOR_SYNC &&

          <div style={{display: 'flex', flex: 1, backgroundColor: '#0F1721', color: '#fff', width: '100%'}}>
            <div style={{display: 'flex', flexDirection: 'column', fontSize: 72, fontWeight: 'bold', textAlign: 'center',width: '100%'}}>
              {this.state.chant.map((c, i)=>{
                const isHighlighted = i == this.state.cursor;
                return(
                  <div key={i} style={{boxSizing: 'border-box', borderTop: '1px solid #000', display: 'flex', flex: 1, backgroundColor: chantColors[i%chantColors.length], opacity: (isHighlighted) ? 1 : .45, alignItems: 'center', justifyContent: 'center', textTransform: 'uppercase'}}>
                    <div>{this.state.chant[i]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        }
      </div>
    );
  }
}

export default App;
