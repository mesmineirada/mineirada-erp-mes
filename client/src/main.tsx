import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

const basePath = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="light" switchable>
    <Router base={basePath}>
      <App />
    </Router>
  </ThemeProvider>,
);

window.requestAnimationFrame(() => {
  window.setTimeout(() => document.getElementById("startup-loader")?.classList.add("app-ready"), 80);
});
