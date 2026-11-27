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



// Service page js 

"use strict";

document.documentElement.classList.add("js");

/* ==================================================
   Service Data
================================================== */

const services = [
  {
    number: "01",
    category: "Development",
    title: "Web Development",
    description:
      "Responsive websites that make every first impression count.",
    tags: "BUSINESS WEBSITES / CMS",
    image: "11973.png"
  },
  {
    number: "02",
    category: "Development",
    title: "Mobile App Development",
    description:
      "Intuitive mobile experiences for people on the move.",
    tags: "iOS & ANDROID / CROSS-PLATFORM",
    image: "1ec4e.png"
  },
  {
    number: "03",
    category: "Development",
    title: "Custom Software",
    description:
      "Purpose-built tools for smoother, smarter workflows.",
    tags: "BUSINESS TOOLS / INTEGRATIONS",
    image: "04d45.png"
  },
  {
    number: "04",
    category: "Development",
    title: "E-commerce Solutions",
    description:
      "Seamless shopping experiences, from discovery to checkout.",
    tags: "ONLINE STORES / PAYMENTS",
    image: "e7fd1.png"
  },
  {
    number: "05",
    category: "Design",
    title: "Branding & Identity",
    description:
      "A distinctive identity that feels unmistakably yours.",
    tags: "STRATEGY / VISUAL IDENTITY",
    image: "12ac5.png"
  },
  {
    number: "06",
    category: "Design",
    title: "Creative Design",
    description:
      "Compelling visuals that bring your brand story to life.",
    tags: "DIGITAL CREATIVES / PRINT",
    image: "73761.png"
  },
  {
    number: "07",
    category: "Design",
    title: "UI/UX Design",
    description:
      "Human-centred interfaces that look good and feel effortless.",
    tags: "RESEARCH / WIREFRAMES / UI",
    image: "52709.png"
  },
  {
    number: "08",
    category: "Design",
    title: "Logo Design",
    description:
      "A memorable mark, designed to make your brand stand out.",
    tags: "CUSTOM MARKS / LOGO SYSTEMS",
    image: "49d31.png"
  },
  {
    number: "09",
    category: "Marketing",
    title: "Digital Marketing",
    description:
      "A connected digital strategy to reach the right audience.",
    tags: "STRATEGY / CAMPAIGNS",
    image: "4ff52.png"
  },
  {
    number: "10",
    category: "Marketing",
    title: "Search Engine Optimisation",
    description:
      "Help the right customers find you when it matters most.",
    tags: "ON-PAGE SEO / TECHNICAL SEO",
    image: "c8690.png"
  },
  {
    number: "11",
    category: "Marketing",
    title: "Social Media Marketing",
    description:
      "Build meaningful connections with content worth sharing.",
    tags: "CONTENT / COMMUNITY / SOCIAL",
    image: "3d01a.png"
  },
  {
    number: "12",
    category: "Marketing",
    title: "Paid Advertising",
    description:
      "Focused ad campaigns that turn attention into action.",
    tags: "SEARCH ADS / SOCIAL ADS",
    image: "08187.png"
  }
];

/* ==================================================
   Service Cards
================================================== */

const servicesGrid = document.getElementById("services-grid");
const servicesStatus = document.getElementById("services-status");
const filterButtons = document.querySelectorAll("[data-filter]");

function createServiceCard(service) {
  const card = document.createElement("article");
  card.className = "service-card";

  const image = document.createElement("img");
  image.className = "service-image";
  image.src = `assets/${service.image}`;
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";

  const content = document.createElement("div");
  content.className = "service-content";

  const category = document.createElement("p");
  category.className = "service-category";
  category.textContent = `${service.number} / ${service.category}`;

  const titleRow = document.createElement("div");
  titleRow.className = "service-title-row";

  const title = document.createElement("h3");
  title.className = "service-title";
  title.textContent = service.title;

  const arrow = document.createElement("i");
  arrow.className = "ri-arrow-right-up-line service-arrow";
  arrow.setAttribute("aria-hidden", "true");

  const description = document.createElement("p");
  description.className = "service-description";
  description.textContent = service.description;

  const tags = document.createElement("p");
  tags.className = "service-tags";
  tags.textContent = service.tags;

  titleRow.append(title, arrow);
  content.append(category, titleRow, description, tags);
  card.append(image, content);

  return card;
}

/* ==================================================
   Category Filters
================================================== */

function setServiceFilter(category, announce = true) {
  if (!servicesGrid) return;

  const filteredServices =
    category === "All services"
      ? services
      : services.filter((service) => service.category === category);

  const fragment = document.createDocumentFragment();

  filteredServices.forEach((service) => {
    fragment.append(createServiceCard(service));
  });

  servicesGrid.replaceChildren(fragment);

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.filter === category)
    );
  });

  if (servicesStatus && announce) {
    servicesStatus.textContent =
      category === "All services"
        ? `Showing all ${filteredServices.length} services.`
        : `Showing ${filteredServices.length} ${category.toLowerCase()} services.`;
  }
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setServiceFilter(button.dataset.filter);
  });
});

document.querySelectorAll("[data-service-category]").forEach((link) => {
  link.addEventListener("click", () => {
    setServiceFilter(link.dataset.serviceCategory);
  });
});

setServiceFilter("All services", false);

/* ==================================================
   Mobile Navigation
================================================== */

const menuButton = document.querySelector(".menu-toggle");
const mainMenu = document.getElementById("main-menu");
const mobileViewport = window.matchMedia("(max-width: 1023px)");

if (menuButton && mainMenu) {
  const menuIcon = menuButton.querySelector("i");

  menuButton.hidden = false;

  function setMenuOpen(isOpen, restoreFocus = false) {
    mainMenu.classList.toggle("is-open", isOpen);

    menuButton.setAttribute("aria-expanded", String(isOpen));

    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close menu" : "Open menu"
    );

    if (menuIcon) {
      menuIcon.className = isOpen
        ? "ri-close-line"
        : "ri-menu-line";
    }

    if (restoreFocus) {
      menuButton.focus();
    }
  }

  menuButton.addEventListener("click", () => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    setMenuOpen(!isOpen);
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    const isOpen =
      menuButton.getAttribute("aria-expanded") === "true";

    if (event.key === "Escape" && isOpen) {
      setMenuOpen(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!(event.target instanceof Node)) return;

    const clickedInsideMenu = mainMenu.contains(event.target);
    const clickedMenuButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedMenuButton) {
      setMenuOpen(false);
    }
  });

  mobileViewport.addEventListener("change", () => {
    setMenuOpen(false);
  });
}

/* ==================================================
   FAQ Accordion
================================================== */

const faqItems = [...document.querySelectorAll(".faq-item")];

faqItems.forEach((item) => {
  const summary = item.querySelector("summary");

  if (!summary) return;

  summary.addEventListener("click", () => {
    if (item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.open = false;
      }
    });
  });
});
