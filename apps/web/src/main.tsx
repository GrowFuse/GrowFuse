import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "ui/globals.css";

import App from "~/app";
import { TRPCReactProvider } from "~/trpc/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCReactProvider>
        <App />
      </TRPCReactProvider>
    </BrowserRouter>
  </StrictMode>,
);
