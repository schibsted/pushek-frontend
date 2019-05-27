import React from 'react';
import logo from './logo.svg';
import pushek from './puszek.gif';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={pushek} className="App-logo" alt="logo" />
        <p>
          This is Pushek Frontend app
        </p>
        <a
          className="App-link"
          href="http://schibsted.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Schibsted Devs
        </a>
      </header>
    </div>
  );
}

export default App;
