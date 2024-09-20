import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/LobbyHome";
import Game from "./pages/LobbyGame";
import Question from "./pages/LobbyQuestion";
import Leaderboard from "./pages/LobbyLeaderboard";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game/:gameId" element={<Game />} />
            <Route path="/quiz" element={<Question />} />
            <Route path="/lobbyleaderboard/:gameId" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
