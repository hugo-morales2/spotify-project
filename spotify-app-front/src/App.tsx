//import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import SongAdd from "./pages/SongAdd";
import PageSelect from "./pages/PageSelect";

import { useEffect } from "react";
import TopArtists from "./pages/TopArtists";
import UserPlaylist from "./pages/UserPlaylist";
import { AppAuth } from "./utils/AuthContext";

function App() {
  useEffect(() => {
    if (!sessionStorage.getItem("localStorageCleared")) {
      localStorage.clear();
      sessionStorage.setItem("localStorageCleared", "true");
    }
  });

  return (
    <AppAuth>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/SongAdd" element={<SongAdd />} />
          <Route path="/PageSelect" element={<PageSelect />} />
          <Route path="/TopArtists" element={<TopArtists />} />
          <Route path="/UserPlaylist" element={<UserPlaylist />} />
        </Routes>
      </Router>
    </AppAuth>
  );
}

export default App;
