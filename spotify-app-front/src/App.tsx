//import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./components/Welcome";
import SongAdd from "./components/SongAdd";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    if (!sessionStorage.getItem("localStorageCleared")) {
      localStorage.clear();
      sessionStorage.setItem("localStorageCleared", "true");
    }
  });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/SongAdd" element={<SongAdd />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
