import React from "react";
import { BrowserRouter, Router, Routes, Route } from "react-router-dom";
import LoginPage from "./services/LoginPage";
import "./App.css";
import Portfolio from "./components/Portfolio";
import Header from "./components/Header";
import GuestPage from "./components/GuestPage";

function App() {
  return (
    <div className="App">
    <BrowserRouter>
        <Header />
      <Routes>
        <Route index path="/" element={<LoginPage />} />
        <Route
          path="/portfolio"
          element={<>
              <main className="main">
                <Portfolio />
              </main>
              </>
          }
          />
          <Route path="/guest" element={<GuestPage/>} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
