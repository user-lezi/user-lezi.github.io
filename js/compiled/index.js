"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./easterEggs");
const projectLoader_1 = require("./projectLoader");
if (document.querySelector("div#projects-grid"))
    (0, projectLoader_1.projectLoader)();
