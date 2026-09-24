import axios from "axios";
import React from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { createContext, useEffect, useState } from "react";

// This context will be used to manage user authentication state across the application
// It will provide user data and loading state to components that need it
// It will also provide functions to update user data and clear user state on logout
// The UserContext will be used to share user data and authentication state across the application
// This allows components to access user information without prop drilling
// It will also handle user authentication and provide functions to update user data and clear user state on logout

// Here we create a UserContext to manage user state across the application
export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) return;

    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    setLoading(false);
  }


  // Logout function to clear user data
    const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
}

    return (
        <UserContext.Provider value={{user, loading, updateUser, clearUser}}>
            {children}
        </UserContext.Provider>
    );
};


export default UserProvider;
