// Mobile navigation (fallback when script.js is not loaded)

(() => {
  "use strict";

  const menu = document.querySelector("#main-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const compactNavigation = window.matchMedia("(max-width: 800px)");

  if (!menu || !menuToggle || menu.dataset.navInitialized === "true") {
    return;
  }

  menu.dataset.navInitialized = "true";

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
})();


(() => {
  "use strict";

  // Edit service content, image paths, and project URLs here.
  const servicesData = [
    {
      title: "Brand & Identity",
      description:
        "Build a memorable brand with a clear visual identity that connects with your audience.",
      image: "assets/images/service img 1.jpg",
      imageAlt: "Brand identity design presentation",
      projectUrl: "projects/brand-identity.html",
      tags: [
        "Logo Design",
        "Brand Identity Design"
      ]
    },
    {
      title: "Web Development",
      description:
        "Create responsive, user-friendly websites that showcase your business and turn visitors into customers.",
      image: "assets/images/service img 2.jpg",
      imageAlt: "Website design and development presentation",
      projectUrl: "projects/web-development.html",
      tags: [
        "Website Design",
        "Website Development"
      ]
    },
    {
      title: "Creative Design",
      description:
        "Bring your ideas to life with distinctive graphics and digital visuals created for your brand.",
      image: "assets/images/service img 3.jpg",
      imageAlt: "Colorful creative design composition",
      projectUrl: "projects/creative-design.html",
      tags: [
        "Graphic Design",
        "Digital Creatives"
      ]
    }
  ];

  function initializeServices() {
    const servicesList = document.getElementById("services-list");

    if (!servicesList) {
      return;
    }

    // Prevent duplicate initialization.
    if (servicesList.dataset.initialized === "true") {
      return;
    }

    const fragment = document.createDocumentFragment();

    servicesData.forEach((service, index) => {
      const card = document.createElement("article");
      card.className = "service-card";
      card.style.setProperty("--stack-order", String(index + 1));

      const content = document.createElement("div");
      content.className = "service-card-content";

      const title = document.createElement("h3");
      title.className = "service-card-title";
      title.id = `service-title-${index + 1}`;
      title.textContent = service.title;

      card.setAttribute("aria-labelledby", title.id);

      const description = document.createElement("p");
      description.className = "service-card-description";
      description.textContent = service.description;

      const projectLink = document.createElement("a");
      projectLink.className = "service-project-link";
      projectLink.href = service.projectUrl;
      projectLink.textContent = "View Projects";
      projectLink.setAttribute(
        "aria-label",
        `View ${service.title} projects`
      );

      const tags = document.createElement("ul");
      tags.className = "service-card-tags";

      service.tags.forEach((tag) => {
        const item = document.createElement("li");
        item.textContent = tag;
        tags.appendChild(item);
      });

      content.append(title, description, projectLink, tags);

      const media = document.createElement("div");
      media.className = "service-card-media";

      const image = document.createElement("img");
      image.alt = service.imageAlt;
      image.loading = "lazy";
      image.decoding = "async";

      // Show a placeholder if the image path is unavailable.
      image.addEventListener(
        "error",
        () => {
          image.hidden = true;

          const fallback = document.createElement("span");
          fallback.className = "service-image-fallback";
          fallback.textContent = service.title;

          media.appendChild(fallback);
        },
        { once: true }
      );

      image.src = service.image;

      media.appendChild(image);
      card.append(content, media);
      fragment.appendChild(card);
    });

    servicesList.replaceChildren(fragment);
    servicesList.dataset.initialized = "true";

    if (!window.gsap || !window.ScrollTrigger) {
      initializeScrollReveal(servicesList);
    }
  }

  function initializeScrollReveal(servicesList) {
    const cards = [...servicesList.querySelectorAll(".service-card")];
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    // Leave content visible when animation is unsupported.
    if (
      motionPreference.matches ||
      !("IntersectionObserver" in window) ||
      typeof Element.prototype.animate !== "function"
    ) {
      return;
    }

    const activeAnimations = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target;
          observer.unobserve(card);

          if (
            motionPreference.matches ||
            card.contains(document.activeElement)
          ) {
            return;
          }

          // Animate once without permanently hiding the card.
          const animation = card.animate(
            [
              {
                opacity: 0,
                transform: "translateY(40px)"
              },
              {
                opacity: 1,
                transform: "translateY(0)"
              }
            ],
            {
              duration: 750,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)"
            }
          );

          activeAnimations.set(card, animation);

          animation.onfinish = () => {
            activeAnimations.delete(card);
          };
        });
      },
      {
        threshold: 0.08
      }
    );

    cards.forEach((card) => {
      observer.observe(card);

      // Keep keyboard-focused content immediately visible.
      card.addEventListener("focusin", () => {
        observer.unobserve(card);

        const animation = activeAnimations.get(card);

        if (animation) {
          animation.cancel();
          activeAnimations.delete(card);
        }
      });
    });

    motionPreference.addEventListener("change", (event) => {
      if (!event.matches) return;

      observer.disconnect();

      activeAnimations.forEach((animation) => {
        animation.cancel();
      });

      activeAnimations.clear();
    });
  }

  // Initialize only after the section exists in the document.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeServices,
      { once: true }
    );
  } else {
    initializeServices();
  }
})();


// service page js

(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const servicesGrid = document.getElementById("services-grid");
  if (!servicesGrid) return;

  /* ==================================================
     Service Page Data 
  ================================================== */

  const services = [
    {
      number: "01",
      category: "Development",
      title: "Web Development",
      description:
        "Responsive websites that make every first impression count.",
      tags: "BUSINESS WEBSITES / CMS",
      image: "assets/images/web service.png"
    },
    {
      number: "02",
      category: "Development",
      title: "Mobile App Development",
      description:
        "Intuitive mobile experiences for people on the move.",
      tags: "iOS & ANDROID / CROSS-PLATFORM",
      image: "assets/images/mobile app service.png"
    },
    {
      number: "03",
      category: "Development",
      title: "Custom Software",
      description:
        "Purpose-built tools for smoother, smarter workflows.",
      tags: "BUSINESS TOOLS / INTEGRATIONS",
      image: "assets/images/custom software service.png"
    },
    {
      number: "04",
      category: "Development",
      title: "E-commerce Solutions",
      description:
        "Seamless shopping experiences, from discovery to checkout.",
      tags: "ONLINE STORES / PAYMENTS",
      image: "assets/images/e-commerce solution service.png"
    },
    {
      number: "06",
      category: "Design",
      title: "UI/UX Design",
      description:
        "Human-centred interfaces that look good and feel effortless.",
      tags: "RESEARCH / WIREFRAMES / UI",
      image: "assets/images/uiux design service.png"
    },

    {
      number: "07",
      category: "Marketing",
      title: "Digital Marketing",
      description:
        "A connected digital strategy to reach the right audience.",
      tags: "STRATEGY / CAMPAIGNS",
      image: "assets/images/digital marketing service.png"
    }
  ];

  /* ==================================================
     Service Cards
  ================================================== */

  const servicesStatus = document.getElementById("services-status");
  const filterButtons = document.querySelectorAll("[data-filter]");

  function createServiceCard(service) {
    const card = document.createElement("article");
    card.className = "service-card";

    const image = document.createElement("img");
    image.className = "service-image";
    image.src = service.image;
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
})();





// process scroll step

(() => {
  "use strict";

  function initializeProcessReveal() {
    const section = document.querySelector(".process-section");
    if (!section) return;

    const timeline = section.querySelector(".process-timeline");
    const steps = [...section.querySelectorAll(".process-step")];

    if (!timeline || !steps.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let framePending = false;

    section.classList.add("process-reveal-ready");

    function updateSteps() {
      framePending = false;

      const viewportHeight = window.innerHeight;
      const timelineTop = timeline.getBoundingClientRect().top;
      const revealDistance = viewportHeight * 0.45;

      const progress =
        (viewportHeight * 0.85 - timelineTop) / revealDistance;

      steps.forEach((step, index) => {
        const threshold = index / Math.max(steps.length - 1, 1);

        // Use the layout position without the animated transform.
        const stepTop =
          step.getBoundingClientRect().top -
          (Number.parseFloat(getComputedStyle(step).translate) || 0);

        const shouldReveal =
          reducedMotion.matches ||
          (progress >= threshold &&
            stepTop <= viewportHeight * 0.9);

        step.classList.toggle("is-visible", shouldReveal);
      });
    }

    function requestUpdate() {
      if (framePending) return;

      framePending = true;
      window.requestAnimationFrame(updateSteps);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    updateSteps();
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeProcessReveal,
      { once: true }
    );
  } else {
    initializeProcessReveal();
  }
})();
