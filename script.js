// Mobile navigation

const menu = document.querySelector("#main-menu");
const menuToggle = document.querySelector(".menu-toggle");
const compactNavigation = window.matchMedia("(max-width: 800px)");

function closeMenu(returnFocus = false) {
  menu.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");

  if (returnFocus) {
    menuToggle.focus();
  }
}

menuToggle.addEventListener("click", () => {
  const isOpen = menu.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close menu" : "Open menu"
  );
});

menu.addEventListener("click", (event) => {
  if (event.target.closest("a, button")) {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  const clickedMenu = menu.contains(event.target);
  const clickedToggle = menuToggle.contains(event.target);

  if (!clickedMenu && !clickedToggle) {
    closeMenu();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menu.classList.contains("open")) {
    closeMenu(true);
  }
});

document.addEventListener("focusin", (event) => {
  if (
    compactNavigation.matches &&
    menu.classList.contains("open") &&
    !menu.contains(event.target) &&
    !menuToggle.contains(event.target)
  ) {
    closeMenu();
  }
});

compactNavigation.addEventListener("change", (event) => {
  if (!event.matches) {
    closeMenu();
  }
});

// Active section tracking

const sectionLinks = [...menu.querySelectorAll('a[href^="#"]')];

const linkedSections = sectionLinks
  .map((link) => ({
    link,
    section: document.getElementById(link.hash.slice(1))
  }))
  .filter((item) => item.section);

function updateActiveLink() {
  if (!linkedSections.length) return;

  let activeItem = linkedSections[0];
  const threshold = window.innerHeight * 0.4;

  linkedSections.forEach((item) => {
    if (item.section.getBoundingClientRect().top <= threshold) {
      activeItem = item;
    }
  });

  linkedSections.forEach(({ link }) => {
    const isActive = link === activeItem.link;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

let scrollScheduled = false;

window.addEventListener(
  "scroll",
  () => {
    if (scrollScheduled) return;

    scrollScheduled = true;

    requestAnimationFrame(() => {
      updateActiveLink();
      scrollScheduled = false;
    });
  },
  { passive: true }
);

window.addEventListener("resize", updateActiveLink);
window.addEventListener("load", updateActiveLink);
updateActiveLink();

// Background video

const video = document.querySelector("#hero-video");
const motionButton = document.querySelector("#motion-button");
const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let playbackRequested = !reducedMotion.matches;
let videoAvailable = false;

video.muted = true;
video.autoplay = playbackRequested;

function updateVideoButton() {
  motionButton.textContent = video.paused ? "▷" : "Ⅱ";
  motionButton.setAttribute(
    "aria-label",
    video.paused ? "Play background video" : "Pause background video"
  );
}

function applyPlaybackPreference() {
  if (!playbackRequested || document.hidden) {
    video.pause();
  } else if (videoAvailable) {
    video.play().catch(updateVideoButton);
  }

  updateVideoButton();
}

function handleVideoReady() {
  videoAvailable = true;
  video.classList.add("is-ready");
  motionButton.hidden = false;
  applyPlaybackPreference();
}

function handleVideoError() {
  videoAvailable = false;
  video.classList.remove("is-ready");
  motionButton.hidden = true;
}

video.addEventListener("loadeddata", handleVideoReady);
video.addEventListener("play", updateVideoButton);
video.addEventListener("pause", updateVideoButton);
video.addEventListener("error", handleVideoError);

video.querySelector("source")?.addEventListener(
  "error",
  handleVideoError
);

motionButton.addEventListener("click", () => {
  playbackRequested = video.paused;
  applyPlaybackPreference();
});

reducedMotion.addEventListener("change", (event) => {
  playbackRequested = !event.matches;
  video.autoplay = playbackRequested;
  applyPlaybackPreference();
});

document.addEventListener(
  "visibilitychange",
  applyPlaybackPreference
);

if (video.readyState >= 2) {
  handleVideoReady();
} else {
  applyPlaybackPreference();
}

// Placeholder dialogs

const dialog = document.querySelector("#info-dialog");
const dialogTitle = document.querySelector("#dialog-title");
const dialogClose = document.querySelector(".dialog-close");

document.querySelectorAll("[data-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    dialogTitle.textContent = button.dataset.dialog;

    if (!dialog.open) {
      dialog.showModal();
    }
  });
});

dialogClose.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;

  const bounds = dialog.getBoundingClientRect();

  const outside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (outside) {
    dialog.close();
  }
});
