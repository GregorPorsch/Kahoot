import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/PlayerHome";
import Game from "./pages/PlayerGame";
import Question from "./pages/PlayerQuestion";
import Leaderboard from "./pages/PlayerLeaderboard";
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
            <Route path="/playerleaderboard/:gameId" element={<Leaderboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
