//import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Welcome from "./components/Welcome";
import SongAdd from "./components/SongAdd";
import { useEffect, useRef, useState } from "react";

interface Access {
  data: DataAccess;
}

interface DataAccess {
  access_token: string;
  expires_in: number;
  token_type: string;
}

function App() {
  //const [response, setResponse] = useState<Access | null>(null);

  function handleResponse(data: Access) {
    //setResponse(data);
    localStorage.setItem("my_access", data.data.access_token);
    console.log(JSON.stringify(data));
  }

  useEffect(() => {
    // call to my flask ('/') endpoint
    fetch("http://127.0.0.1:5000")
      .then((response_1) => response_1.json())
      .then((hugo) => handleResponse(hugo));
  }, []);

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
