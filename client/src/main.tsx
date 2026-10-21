import { trpc } from "@/lib/trpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { createRoot } from "react-dom/client";
import { Router } from "wouter";
import App from "./App";
import { ThemeProvider } from "./contexts/ThemeContext";
import "./index.css";

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL.replace(/\/$/, "");
const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/api/trpc", transformer: superjson })],
});

createRoot(document.getElementById("root")!).render(
  <trpc.Provider client={trpcClient} queryClient={queryClient}>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" switchable>
        <Router base={basePath}>
          <App />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  </trpc.Provider>,
);

window.requestAnimationFrame(() => {
  window.setTimeout(() => document.getElementById("startup-loader")?.classList.add("app-ready"), 80);
});
