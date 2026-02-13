"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yapper_1 = require("../yapper");
let lontCount = 0;
document.querySelectorAll("[lont]").forEach((el) => {
    el.addEventListener("click", () => {
        lontCount++;
        if (lontCount === 4)
            yapper_1.yapper.yap("One more?", true);
        if (lontCount === 5) {
            changeFont();
            yapper_1.yapper.yap("**let me cook 🔥🔥**", true);
        }
    });
});
function changeFont() {
    const style = document.createElement("style");
    style.textContent = `@font-face { font-family: "Lont"; src: url("./fonts/Lont-Regular.ttf") format("truetype"); } body { font-family: "Lont", san-serif; }`;
    document.head.appendChild(style);
}
