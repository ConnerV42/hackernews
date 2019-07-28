import React, { Component } from 'react';
import News from './News.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <div className="glow">Hacker News</div>
        </header>
        <News />
      </div>
    );
  }
}

export default App;
