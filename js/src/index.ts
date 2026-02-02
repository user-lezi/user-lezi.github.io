import "./easterEggs";
import { projectLoader } from "./projectLoader";

const path = window.location.pathname;

if (path === "/" || path === "/index" || path === "/index.html") {
  projectLoader();
}
