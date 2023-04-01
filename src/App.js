import React from "react";
import Portfolio from "./components/Portfolio";
import "./App.css";

function App() {
  return (
    <div className="App">
      <header className="header">
        <h1 className="title">Get Working</h1>
      </header>
      <main className="main">
        <div className="container">
          <Portfolio />
        </div>
      </main>
    </div>
  );
}

export default App;
