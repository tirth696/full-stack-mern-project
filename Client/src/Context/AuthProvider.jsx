import { createContext, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export const AuthContext = createContext();

const AuthProvider = (prop) => {
  const { children } = prop;
  // const tto = localStorage.getItem("token");
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [User, setUser] = useState({});

  const login = async (email, password) => {
    // Make an API call to login the user
    // Set the user state with the response from the API
    const data = { email, password };

    try {
      // Send POST request to your backend API endpoint
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "*",
          "Access-Control-Allow-Headers":
            "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
        },
      };
      const response = await axios.post(
        "http://localhost:4000/api/v1/login",
        data,
        config
      );

      // Handle successful login (e.g., redirect, store user data)
      //   console.log("Login successful!", response.data);

      // Example: store token in local storage for future requests
      localStorage.setItem("token", response.data.token);
      // Cookies.set("token", response.data.token, { expires: 7, httpOnly: true });
      settoken(response.data.token);
      setUser(response.data.user);

      return response.data.success;
    } catch (error) {
      // Handle errors here, e.g., display error message to the user
      return error.response?.data?.message || "Login failed.";
    }
  };

  const logout = async () => {
    // Make an API call to logout the user
    // Set the user state to null
    try {
      // Send POST request to your backend API endpoint
      const response = await axios.get("http://localhost:4000/api/v1/logout");

      // Handle successful login (e.g., redirect, store user data)
      //   console.log("Login successful!", response.data);

      // Example: store token in local storage for future requests
      localStorage.removeItem("token");
      Cookies.remove("token");
      settoken(null);
      return response.data.success;
    } catch (error) {
      // Handle errors here, e.g., display error message to the user
      return error.response?.data?.message || "Login failed.";
    }
  };

  const SignUp = async (name, email, password) => {
    const data = { name, email, password };
    try {
      const response = await axios.post(
        "http://localhost:4000/api/v1/register",
        data
      );

      if (response.data.success) {
        // Handle successful signup
        console.log("Signup successful!");
        return true;
        // Redirect to login page
      } else {
        return response.data.message; // Set error message from response
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        // Specific error handling based on response status code
        return (
          error.response.data.message || "An error occurred during signup."
        );
      } else if (error.request) {
        return "No response received from the server. Please check your internet connection.";
      } else {
        return "An error occurred while processing your request.";
      }
    }
  };

  return (
    <AuthContext.Provider value={{ User, token, login, logout, SignUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
