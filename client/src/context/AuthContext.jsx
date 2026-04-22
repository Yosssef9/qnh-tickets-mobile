import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMeRequest, logoutRequest } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("auth_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("auth_token") || null;
  });

  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth_user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  const setAuth = ({ user, token }) => {
    setUser(user || null);
    setToken(token || null);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } catch (error) {
      // ignore backend logout failure, still clear local auth
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  const fetchCurrentUser = async () => {
    if (!token) {
      setLoadingAuth(false);
      return;
    }

    try {
      const data = await getMeRequest();

      if (data?.success && data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      setUser(null);
      setToken(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      setAuth,
      logout,
      fetchCurrentUser,
      isAuthenticated: !!user,
      loadingAuth,
    }),
    [user, token, loadingAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
