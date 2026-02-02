"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./easterEggs");
const projectLoader_1 = require("./projectLoader");
const path = window.location.pathname;
if (path === "/" || path === "/index" || path === "/index.html") {
    (0, projectLoader_1.projectLoader)();
}
