import React, { createContext, useReducer, useContext } from "react";
import { useEffect } from "react";

// Define the context
const UserStateContext = createContext();

// Define the reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

// Create a provider component
export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, { user: null });

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <UserStateContext.Provider value={{ state, dispatch }}>
      {children}
    </UserStateContext.Provider>
  );
};

// Create a hook for easy use of the context
export const useUser = () => {
  const context = useContext(UserStateContext);
  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }
  return context;
};
