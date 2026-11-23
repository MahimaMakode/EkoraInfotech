// const menuButton = document.querySelector(".menu-button");
// const mainNavigation = document.querySelector(".main-nav");

// if (menuButton && mainNavigation) {
//   menuButton.addEventListener("click", () => {
//     const isOpen = mainNavigation.classList.toggle("open");
//     menuButton.setAttribute("aria-expanded", String(isOpen));
//   });

//   mainNavigation.querySelectorAll("a").forEach((link) => {
//     link.addEventListener("click", () => {
//       mainNavigation.classList.remove("open");
//       menuButton.setAttribute("aria-expanded", "false");
//     });
//   });

//   document.addEventListener("keydown", (event) => {
//     if (event.key === "Escape") {
//       mainNavigation.classList.remove("open");
//       menuButton.setAttribute("aria-expanded", "false");
//     }
//   });
// }