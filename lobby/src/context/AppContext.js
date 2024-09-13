import React, { createContext, useContext, useState } from "react";
import io from "socket.io-client";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  const [gameId, setGameId] = useState("");

  return (
    <AppContext.Provider value={{ socket, gameId, setGameId }}>{children}</AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
