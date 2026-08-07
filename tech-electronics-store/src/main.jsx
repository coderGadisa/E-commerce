import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          {/* Single global toast container — renders toasts on top of everything */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "'Segoe UI', system-ui, sans-serif",
                fontSize: "14px",
                borderRadius: "10px",
                padding: "12px 16px",
              },
              success: {
                iconTheme: { primary: "#16a34a", secondary: "#fff" },
                style: { background: "#f0fdf4", color: "#166534", border: "1px solid #86efac" },
              },
              error: {
                iconTheme: { primary: "#dc2626", secondary: "#fff" },
                style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
