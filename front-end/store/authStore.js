import { create } from "zustand";

import axios from "axios";
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:4000/api/auth"
    : "/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signUp: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      console.log(response);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      console.log(response.data);
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ error: null, isLoading: true });

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      console.log(response);
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      console.log(response.data.user);
    } catch (error) {
      set({
        error: error.response.data.message || "Error while login",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyemail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, { code });
      console.log(response);
      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticated: true,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || "Error signing up",
        isLoading: false,
      });
      throw error;
    }
  },
  authcheck: async () => {
    set({ error: null, isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/check-auth`);
      console.log(response);
      set({
        user: response.data.user,

        isCheckingAuth: false,
        isAuthenticated: true,
      });
    } catch (error) {
      console.log(error);
      set({
        error: null,

        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },

  logout: async () => {
    set({ error: null, isLoading: true });
    const response = await axios.post(`${API_URL}/logout`);

    set({ error: null, isLoading: false, isAuthenticated: false });
  },

  forgotPassword: async (email) => {
    set({ error: null, isLoading: true, message: null });
    try {
      const response = await axios.post(`${API_URL}/forget-password`, {
        email,
      });

      set({ isLoading: false, message: response.data.message, error: null });
    } catch (error) {}
  },

  // reset password function
  resetPassword: async (token, password) => {
    set({ error: null, isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ error: null, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response.data.message });
    }
  },
}));
