import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import {
  clearStudentCache,
  clearTeacherCache,
} from "../utils/cache";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("edupredict_token"));
  const [loading, setLoading] = useState(true);

  const saveAuthData = (newToken, newUser) => {
    localStorage.setItem("edupredict_token", newToken);
    localStorage.setItem("edupredict_user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  };

  const clearAuthData = () => {
    localStorage.removeItem("edupredict_token");
    localStorage.removeItem("edupredict_user");

    setToken(null);
    setUser(null);
  };

  const getProfile = async () => {
    try {
      const { data } = await api.get("/auth/me");

      const profile = data.user;

      localStorage.setItem("edupredict_user", JSON.stringify(profile));
      setUser(profile);

      return profile;
    } catch (error) {
      clearAuthData();
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem("edupredict_user");
        const savedToken = localStorage.getItem("edupredict_token");

        if (!savedToken) {
          setLoading(false);
          return;
        }

        setToken(savedToken);

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        await getProfile();
      } catch (error) {
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async ({ email, password, role }) => {
  const { data } = await api.post("/auth/login", {
    email,
    password,
    role,
  });

  saveAuthData(data.token, data.user);

  const cacheKey =
    role === "teacher" ? "teacher_dashboard" : "student_dashboard";

  const dashboardUrl =
    role === "teacher" ? "/teacher/dashboard" : "/student/dashboard";

  api
    .get(dashboardUrl)
    .then((res) => {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify(res.data.dashboard)
      );
    })
    .catch(() => {});

  try {
    const profile = await getProfile();
    return profile || data.user;
  } catch {
    return data.user;
  }
};

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    saveAuthData(data.token, data.user);

    try {
      const profile = await getProfile();
      return profile || data.user;
    } catch {
      return data.user;
    }
  };

  const updateUser = (updatedUser) => {
    const mergedUser = {
      ...user,
      ...updatedUser,
    };

    localStorage.setItem("edupredict_user", JSON.stringify(mergedUser));
    setUser(mergedUser);

    return mergedUser;
  };

  const logout = () => {
  clearStudentCache();
  clearTeacherCache();
  clearAuthData();
};

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        getProfile,
        updateUser,
        isAuthenticated: Boolean(token && user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);