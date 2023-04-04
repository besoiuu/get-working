import React from "react";
import Portfolio from "./components/Portfolio";
import Header from "./components/Header";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main">
        <Portfolio />
      </main>
    </div>
  );
}

export default App;
