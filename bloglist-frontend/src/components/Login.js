import React, { useState } from "react";
import Togglable from "./Togglable";
import LoginForm from "./LoginForm";
import loginService from "../services/login";

const Login = ({ dispatch, notificationDispatch }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      // Updating token for blogService if you're storing it there
      // blogService.setToken(user.token);  // Uncomment if you use it

      // Update user in global state
      dispatch({ type: "LOGIN", payload: user });

      // Clear form fields
      setUsername("");
      setPassword("");

      // Send a successful login notification
      notificationDispatch({ type: "LOGIN" });
    } catch (exception) {
      // Send an error notification
      notificationDispatch({ type: "ERROR_LOGIN" });
    }
  };

  return (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );
};

export { Login };
