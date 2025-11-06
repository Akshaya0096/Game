import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Signup from "./components/signup";
import WelcomePage from "./components/welcome";
import GamePage from "./components/Gamepage";
import ResultPage from "./components/ResultPage";
import ScoreboardPage from "./components/ScoreboardPage";

const App = () => {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/welcome" element={<WelcomePage />} />
  <Route path="/game" element={<GamePage />} />
  <Route path="/result" element={<ResultPage />} />
   <Route path="/scoreboard" element={<ScoreboardPage />} />

</Routes>
    </Router>
  );
};

export default App;
