import React from "react";
import { createRoot } from "react-dom/client";
import ChemistryQuest from "./atom-builder.jsx";

const root = createRoot(document.getElementById("root"));
root.render(<ChemistryQuest />);

// Service worker (hors-ligne)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
