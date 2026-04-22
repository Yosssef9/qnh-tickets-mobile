import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "16px",
            padding: "12px 14px",
            fontSize: "14px",
          },
          success: {
            style: {
              border: "1px solid #bbf7d0",
              background: "#f0fdf4",
              color: "#166534",
            },
          },
          error: {
            style: {
              border: "1px solid #fecaca",
              background: "#fef2f2",
              color: "#991b1b",
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
);
