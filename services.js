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
      console.error('Services container "#services-list" was not found.');
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

    initializeScrollReveal(servicesList);
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