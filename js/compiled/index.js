"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./easter-eggs/index");
const loader_1 = require("./projects/loader");
if (document.querySelector("div#projects-grid"))
    (0, loader_1.projectLoader)();
