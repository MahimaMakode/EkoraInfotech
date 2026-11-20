(() => {
  "use strict";

  // Project categories
  const categories = [
    { id: "web", label: "Web Development" },
    { id: "marketing", label: "Digital Marketing" },
    { id: "branding", label: "Branding" }
  ];

  // Replace sample content, image paths, and URLs as needed.
  const projectsData = [
    {
      id: "student-shopee",
      title: "Student Shopee",
      categories: ["web"],
      image: "assets/images/project\ image\ 1.jpg",
      imageAlt: "Student Shopee website preview",
      tags: ["Development", "Job Portal", "Design"],
      url: "https://printingtask.com/home"
    },
    {
      id: "figma-workflow",
      title: "Figma workflow",
      categories: ["web"],
      image: "assets/images/project\ img\ 2.jpg",
      imageAlt: "Figma workflow website preview",
      tags: ["Development", "UI Design", "Website"],
      url: "https://printingtask.com/home"
    },
    {
      id: "creative-website",
      title: "Creative Website",
      categories: ["web"],
      image: "assets/images/project\ img\ 3.jpg",
      imageAlt: "Creative website preview",
      tags: ["Development", "Web Design", "Creative"],
      url: "https://printingtask.com/home"
    },
    {
      id: "business-website",
      title: "Business Website",
      categories: ["web"],
      image: "assets/images/project\ image\ 1.jpg",
      imageAlt: "Business website preview",
      tags: ["Website", "Business", "Development"],
      url: "https://printingtask.com/home"
    },
    {
      id: "ecommerce-store",
      title: "E-commerce Store",
      categories: ["web"],
      image: "assets/images/project\ img\ 2.jpg",
      imageAlt: "E-commerce store preview",
      tags: ["E-commerce", "UI Design", "Development"],
      url: "https://printingtask.com/home"
    },
    {
      id: "social-campaign",
      title: "Social Media Campaign",
      categories: ["marketing"],
      image: "assets/images/project\ img\ 3.jpg",
      imageAlt: "Social media campaign preview",
      tags: ["Social Media", "Content", "Marketing"],
      url: "https://printingtask.com/home"
    },
    {
      id: "digital-promotion",
      title: "Digital Promotion",
      categories: ["marketing"],
      image: "assets/images/project\ image\ 1.jpg",
      imageAlt: "Digital promotion campaign preview",
      tags: ["Advertising", "Campaign", "Creative"],
      url: "https://printingtask.com/home"
    },
    {
      id: "brand-identity",
      title: "Brand Identity",
      categories: ["branding"],
      image: "assets/images/project\ img\ 2.jpg",
      imageAlt: "Brand identity presentation",
      tags: ["Logo", "Identity", "Branding"],
      url: "https://printingtask.com/home"
    },
    {
      id: "brand-launch",
      title: "Brand Launch",
      categories: ["branding", "marketing"],
      image: "assets/images/project\ img\ 3.jpg",
      imageAlt: "Brand launch presentation",
      tags: ["Strategy", "Branding", "Marketing"],
      url: "https://printingtask.com/home"
    }
  ];

  function initializeProjects() {
    const section = document.getElementById("projects");

    if (!section) return;
    if (section.dataset.projectSliderReady === "true") return;

    const filters = section.querySelector("#project-filters");
    const grid = section.querySelector("#projects-grid");
    const previousButton = section.querySelector("#projects-prev");
    const nextButton = section.querySelector("#projects-next");
    const status = section.querySelector("#projects-status");

    if (!filters || !grid || !previousButton || !nextButton || !status) {
      console.error("Required projects section elements are missing.");
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    let activeCategory = categories[0].id;
    let requestedPosition = null;
    let updateFrame = null;
    let scrollTimer = null;

    function getProjectUrl(value) {
      if (typeof value !== "string" || !value.trim()) return "";

      try {
        const url = new URL(value.trim(), document.baseURI);

        return ["https:", "http:"].includes(url.protocol)
          ? url.href
          : "";
      } catch {
        return "";
      }
    }

    function getMaximumScroll() {
      return Math.max(0, grid.scrollWidth - grid.clientWidth);
    }

    function updateControls() {
      updateFrame = null;

      const maximum = getMaximumScroll();
      const current = Math.max(0, grid.scrollLeft);

      previousButton.disabled = maximum <= 2 || current <= 2;
      nextButton.disabled = maximum <= 2 || current >= maximum - 2;
    }

    function scheduleControlsUpdate() {
      if (updateFrame !== null) return;
      updateFrame = requestAnimationFrame(updateControls);
    }

    function finishScroll() {
      window.clearTimeout(scrollTimer);
      requestedPosition = null;
      scheduleControlsUpdate();
    }

    function resetSlider() {
      window.clearTimeout(scrollTimer);
      requestedPosition = null;

      grid.scrollTo({
        left: 0,
        behavior: "instant"
      });

      updateControls();
      scheduleControlsUpdate();
    }

    function moveProject(direction) {
      const firstCard = grid.querySelector(".project-card");
      const maximum = getMaximumScroll();

      if (!firstCard || maximum <= 2) return;

      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      const step = firstCard.getBoundingClientRect().width + gap;
      const start = requestedPosition ?? grid.scrollLeft;

      requestedPosition = Math.max(
        0,
        Math.min(maximum, start + direction * step)
      );

      grid.scrollTo({
        left: requestedPosition,
        behavior: reducedMotion.matches ? "instant" : "smooth"
      });

      window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(finishScroll, 1200);
    }

    function createProjectCard(project) {
      const projectUrl = getProjectUrl(project.url);

      const card = document.createElement("article");
      card.className = "project-card";

      const titleId = `project-title-${project.id}`;
      card.setAttribute("aria-labelledby", titleId);

      // Original project image
      const media = document.createElement("div");
      media.className = "project-media";

      const image = document.createElement("img");
      image.alt = project.imageAlt;
      image.loading = "lazy";
      image.decoding = "async";

      image.addEventListener(
        "error",
        () => {
          image.hidden = true;

          const placeholder = document.createElement("span");
          placeholder.className = "project-image-placeholder";
          placeholder.textContent = project.title;
          placeholder.setAttribute("aria-hidden", "true");

          media.appendChild(placeholder);
        },
        { once: true }
      );

      image.src = project.image;
      media.appendChild(image);

      // Clickable hover button
      if (projectUrl) {
        const overlay = document.createElement("div");
        overlay.className = "project-hover";

        const viewLink = document.createElement("a");
        viewLink.className = "project-view-link";
        viewLink.href = projectUrl;
        viewLink.target = "_blank";
        viewLink.rel = "noopener noreferrer";
        viewLink.textContent = "View Now";
        viewLink.setAttribute(
          "aria-label",
          `View ${project.title} (opens in a new tab)`
        );

        overlay.appendChild(viewLink);
        media.appendChild(overlay);
      }

      // Project title
      const title = document.createElement("h3");
      title.id = titleId;
      title.className = "project-title";

      if (projectUrl) {
        const titleLink = document.createElement("a");
        titleLink.href = projectUrl;
        titleLink.target = "_blank";
        titleLink.rel = "noopener noreferrer";
        titleLink.textContent = project.title;
        titleLink.setAttribute(
          "aria-label",
          `${project.title} (opens in a new tab)`
        );

        title.appendChild(titleLink);
      } else {
        title.textContent = project.title;
      }

      // Tags
      const tags = document.createElement("ul");
      tags.className = "project-tags";

      project.tags.forEach((tag) => {
        const item = document.createElement("li");
        item.textContent = tag;
        tags.appendChild(item);
      });

      card.append(media, title, tags);
      return card;
    }

    function renderProjects(categoryId) {
      const matchingProjects = projectsData.filter((project) =>
        project.categories.includes(categoryId)
      );

      const fragment = document.createDocumentFragment();

      matchingProjects.forEach((project) => {
        fragment.appendChild(createProjectCard(project));
      });

      if (matchingProjects.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "projects-empty";
        emptyMessage.textContent =
          "Projects in this category are coming soon.";

        fragment.appendChild(emptyMessage);
      }

      grid.replaceChildren(fragment);
      grid.classList.toggle("is-empty", matchingProjects.length === 0);

      filters.querySelectorAll(".project-filter").forEach((button) => {
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.category === categoryId)
        );
      });

      const category = categories.find((item) => item.id === categoryId);

      status.textContent =
        `${matchingProjects.length} projects shown for ${category.label}.`;

      resetSlider();
    }

    // Category buttons
    const filterFragment = document.createDocumentFragment();

    categories.forEach((category) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "project-filter";
      button.dataset.category = category.id;
      button.textContent = category.label;
      button.setAttribute("aria-controls", "projects-grid");
      button.setAttribute("aria-pressed", "false");

      button.addEventListener("click", () => {
        if (activeCategory === category.id) return;

        activeCategory = category.id;
        renderProjects(activeCategory);
      });

      filterFragment.appendChild(button);
    });

    filters.replaceChildren(filterFragment);

    // Previous / Next
    previousButton.addEventListener("click", () => moveProject(-1));
    nextButton.addEventListener("click", () => moveProject(1));

    // Scroll and swipe
    grid.addEventListener(
      "scroll",
      () => {
        scheduleControlsUpdate();

        window.clearTimeout(scrollTimer);
        scrollTimer = window.setTimeout(finishScroll, 180);
      },
      { passive: true }
    );

    grid.addEventListener("scrollend", finishScroll);

    function releaseRequestedPosition() {
      requestedPosition = null;
      window.clearTimeout(scrollTimer);
    }

    grid.addEventListener("pointerdown", releaseRequestedPosition, {
      passive: true
    });

    grid.addEventListener("wheel", releaseRequestedPosition, {
      passive: true
    });

    // Keyboard navigation
    grid.addEventListener("keydown", (event) => {
      if (event.target !== grid) return;
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      if (getMaximumScroll() <= 2) return;

      event.preventDefault();
      moveProject(event.key === "ArrowRight" ? 1 : -1);
    });

    // Responsive controls
    function handleResize() {
      requestedPosition = null;
      scheduleControlsUpdate();
    }

    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(handleResize);
      observer.observe(grid);
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("load", scheduleControlsUpdate, { once: true });

    if (document.fonts) {
      document.fonts.ready.then(scheduleControlsUpdate);
    }

    reducedMotion.addEventListener("change", () => {
      requestedPosition = null;

      grid.scrollTo({
        left: grid.scrollLeft,
        behavior: "instant"
      });

      scheduleControlsUpdate();
    });

    renderProjects(activeCategory);
    section.dataset.projectSliderReady = "true";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeProjects, {
      once: true
    });
  } else {
    initializeProjects();
  }
})();