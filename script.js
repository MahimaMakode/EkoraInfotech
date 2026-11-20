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




// contact section



(() => {
  "use strict";

  function initializeContactForm() {
    const form = document.getElementById("contact-form");
    const submitButton = document.getElementById("contact-submit");
    const status = document.getElementById("contact-form-status");

    if (!form || !submitButton || !status) return;
    if (form.dataset.initialized === "true") return;

    form.dataset.initialized = "true";

    const nameInput = form.elements.namedItem("name");
    const messageInput = form.elements.namedItem("message");
    const buttonLabel = submitButton.querySelector("span");

    const requiredTextFields = [
      {
        input: nameInput,
        message: "Please enter your name."
      },
      {
        input: messageInput,
        message: "Please describe your project."
      }
    ];

    function validateTextField(field) {
      field.input.setCustomValidity(
        field.input.value.trim() ? "" : field.message
      );
    }

    requiredTextFields.forEach((field) => {
      field.input.addEventListener("input", () => {
        validateTextField(field);
      });
    });

    let submitting = false;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (submitting) return;

      requiredTextFields.forEach(validateTextField);

      if (!form.reportValidity()) return;

      const endpoint = form.dataset.endpoint.trim();

      // Do not claim that a message was sent without a backend.
      if (!endpoint) {
        status.textContent =
          "This form is not connected yet. Your enquiry has not been sent.";
        return;
      }

      const payload = Object.fromEntries(new FormData(form).entries());

      Object.keys(payload).forEach((key) => {
        if (typeof payload[key] === "string") {
          payload[key] = payload[key].trim();
        }
      });

      payload.consent = payload.consent === "yes";

      submitting = true;
      submitButton.disabled = true;
      buttonLabel.textContent = "Sending…";
      form.setAttribute("aria-busy", "true");
      status.textContent = "";

      const controller = new AbortController();
      const timeout = window.setTimeout(() => {
        controller.abort();
      }, 20000);

      try {
        // Expected API response: { "success": true }
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Submission failed.");
        }

        const result = await response.json();

        if (result.success !== true) {
          throw new Error("Submission was not confirmed.");
        }

        status.textContent =
          "Thank you! Your enquiry has been submitted successfully.";

        form.reset();

        requiredTextFields.forEach((field) => {
          field.input.setCustomValidity("");
        });
      } catch (error) {
        status.textContent =
          error.name === "AbortError"
            ? "The request timed out. We could not confirm your submission."
            : "We could not confirm your submission. Please try again later.";
      } finally {
        window.clearTimeout(timeout);

        submitting = false;
        submitButton.disabled = false;
        buttonLabel.textContent = "Get a Quote";
        form.removeAttribute("aria-busy");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeContactForm,
      { once: true }
    );
  } else {
    initializeContactForm();
  }
})();
