import "./easter-eggs/index";
import { projectLoader } from "./projects/loader";

if (document.querySelector("div#projects-grid")) projectLoader();
