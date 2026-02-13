"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./easter-eggs/index");
const loader_1 = require("./projects/loader");
const random_1 = require("./util/random");
const yapper_1 = require("./yapper");
if (document.querySelector("div#projects-grid"))
    (0, loader_1.projectLoader)();
document
    .querySelector("[summon-yapper]")
    .addEventListener("click", async () => {
    if (yapper_1.yapper.visible)
        return;
    yapper_1.yapper.show();
    const line = await (0, yapper_1.resolveYap)((0, random_1.pickRandom)(yapper_1.STARTUP_YAPS));
    yapper_1.yapper.yap(line, true);
});
window.yapper = yapper_1.yapper;
