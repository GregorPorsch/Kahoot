import React, { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastContext, setToastContext] = useState({ message: "", type: "" });

  return (
    <ToastContext.Provider value={{ toastContext, setToastContext }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);
