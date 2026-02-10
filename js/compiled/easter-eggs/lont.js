"use strict";
let lontCount = 0;
document.querySelectorAll("[lont]").forEach((el) => {
    el.addEventListener("click", () => {
        lontCount++;
        if (lontCount === 5)
            changeFont();
    });
});
function changeFont() {
    const style = document.createElement("style");
    style.textContent = `@font-face { font-family: "Lont"; src: url("./fonts/Lont-Regular.ttf") format("truetype"); } body { font-family: "Lont", san-serif; }`;
    document.head.appendChild(style);
}
