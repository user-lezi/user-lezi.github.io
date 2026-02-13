import { yapper } from "../yapper";

let lontCount = 0;

// select
document.querySelectorAll("[lont]").forEach((el) => {
  el.addEventListener("click", () => {
    lontCount++;
    if (lontCount === 4) yapper.yap("One more?", true);
    if (lontCount === 5) {
      changeFont();
      yapper.yap("**let me cook 🔥🔥**", true);
    }
  });
});

function changeFont() {
  const style = document.createElement("style");
  style.textContent = `@font-face { font-family: "Lont"; src: url("./fonts/Lont-Regular.ttf") format("truetype"); } body { font-family: "Lont", san-serif; }`;
  document.head.appendChild(style);
}
