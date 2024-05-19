import React, { createContext, useState, useContext, useEffect } from "react";
import { APIUSER } from "../API";
const TokenContext = createContext();

export const useToken = () => {
  return useContext(TokenContext);
};

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("userToken"));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        try {
          const response = await APIUSER.get("/user", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.id) {
            // console.log(response.data);
            setUser(response.data);
            setIsAuthenticated(true);
          }else {
            setIsAuthenticated(false);
            removeToken();
          }
        } catch (error) {
          setIsAuthenticated(false);
          removeToken();
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkToken();
  }, [token]);

  const saveToken = (userToken) => {
    localStorage.setItem("userToken", userToken);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  const removeToken = () => {
    localStorage.removeItem("userToken");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <TokenContext.Provider
      value={{
        token,
        setToken: saveToken,
        removeToken,
        isAuthenticated,
        isLoading,
        user,
        setIsLoading,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};
