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
import ArtistPage from "./pages/ArtistPage";

import Layout from "./components/Layout";

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
          <Route
            path="/SongAdd"
            element={
              <Layout>
                <SongAdd />
              </Layout>
            }
          />
          <Route
            path="/PageSelect"
            element={
              <Layout>
                <PageSelect />
              </Layout>
            }
          />
          <Route
            path="/TopArtists"
            element={
              <Layout>
                <TopArtists />
              </Layout>
            }
          />
          <Route
            path="/UserPlaylist"
            element={
              <Layout>
                <UserPlaylist />
              </Layout>
            }
          />
          <Route
            path="/ArtistPage"
            element={
              <Layout>
                <ArtistPage />
              </Layout>
            }
          />
        </Routes>
      </Router>
    </AppAuth>
  );
}

export default App;
