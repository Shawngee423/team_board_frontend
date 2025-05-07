import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState } from "../types/auth";

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

// Action types
type AuthAction =
  | {
      type: "LOGIN_SUCCESS";
      payload: {
        id: number;
        name: string;
        jobTitle?: string;
        city?: string;
        country?: string;
        phoneNumber?: string;
        website?: string;
        profileUrl?: string;
      };
    }
  | { type: "LOGIN_FAIL"; payload: string }
  | { type: "LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAIL":
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("auth_token");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already logged in
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (error) {
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    loadUser();
  }, []);

  // Login function - in a real app this would call your API
  const login = async (username: string, password: string) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });

      // 添加预设的kunkun用户
      if (username === "kunkun" && password === "password") {
        // 模拟API调用延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 预设的kunkun用户数据
        const userData = {
          id: 1,
          name: "kunkun",
          jobTitle: "star",
          city: "Macao",
          country: "China",
          phoneNumber: "111222333444555",
          website: "kunkun.com",
          profileUrl: "kunkun.com",
        };

        // 设置token
        localStorage.setItem("auth_token", "mock_token_12345");

        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      } else if (username && password) {
        // 模拟API调用延迟
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 一般用户数据
        const userData = { id: 1, name: username };

        // 设置token
        localStorage.setItem("auth_token", "mock_token_12345");

        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      } else {
        dispatch({
          type: "LOGIN_FAIL",
          payload: "Username and password are required",
        });
      }
    } catch (error) {
      dispatch({
        type: "LOGIN_FAIL",
        payload: error instanceof Error ? error.message : "Login failed",
      });
    }
  };

  // Logout function
  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
