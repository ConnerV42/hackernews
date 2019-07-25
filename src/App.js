import React, { Component } from 'react';
import News from './News.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="container">
          <div className="glow">Hacker News</div>
          <News />
        </header>
      </div>
    );
  }
}

export default App;
