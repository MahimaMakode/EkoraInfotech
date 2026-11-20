(() => {
  "use strict";

  // Demo entries only.
  // Replace these with approved client details and testimonials.
  const clientsData = [
    {
      name: "Client One",
      role: "Designation, Company Name",
      photo: "assets/images/testimonial\ 1.jpg",
      rating: 5,
      quote:
        "Redefines what a music app can be— transforming passive listening into an immersive, interactive experience."
    },
    {
      name: "Client Two",
      role: "Designation, Company Name",
      photo: "assets/images/testimonial\ 2.jpg",
      rating: 5,
      quote:
        "Redefines what a music app can be— transforming passive listening into an immersive, interactive experience."
    },
    {
      name: "Client Three",
      role: "Designation, Company Name",
      photo: "assets/images/testimonial\ 3.jpg",
      rating: 5,
      quote:
        "Redefines what a music app can be— transforming passive listening into an immersive, interactive experience."
    },
    {
      name: "Client Four",
      role: "Designation, Company Name",
      photo: "assets/images/testimonial\ 4.jpg",
      rating: 5,
      quote:
        "Redefines what a music app can be— transforming passive listening into an immersive, interactive experience."
    },
    {
      name: "Client Five",
      role: "Designation, Company Name",
      photo: "assets/images/testimonial\ 1.jpg",
      rating: 5,
      quote:
        "Redefines what a music app can be— transforming passive listening into an immersive, interactive experience."
    },
    {
      name: "Client Six",
      role: "Designation, Company Name",
      photo: "assets/images/testimonial\ 2.jpg",
      rating: 5,
      quote:
        "Redefines what a music app can be— transforming passive listening into an immersive, interactive experience."
    }
  ];

  function createClientCard(client, index) {
    const card = document.createElement("article");
    card.className = "client-card";

    const nameId = `client-name-${index + 1}`;
    card.setAttribute("aria-labelledby", nameId);

    // Client photo
    const photoContainer = document.createElement("div");
    photoContainer.className = "client-photo";

    const photo = document.createElement("img");
    photo.alt = `Portrait of ${client.name}`;
    photo.loading = "lazy";
    photo.decoding = "async";

    // Show initials when the image cannot be loaded.
    photo.addEventListener(
      "error",
      () => {
        photo.hidden = true;

        const fallback = document.createElement("span");
        fallback.className = "client-photo-fallback";
        fallback.setAttribute("aria-hidden", "true");

        fallback.textContent = client.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((word) => word.charAt(0))
          .join("")
          .toUpperCase();

        photoContainer.appendChild(fallback);
      },
      { once: true }
    );

    photo.src = client.photo;
    photoContainer.appendChild(photo);

    // Card body
    const body = document.createElement("div");
    body.className = "client-card-body";

    // Rating
    const ratingValue = Math.max(
      0,
      Math.min(5, Math.round(Number(client.rating) || 0))
    );

    const rating = document.createElement("div");
    rating.className = "client-rating";
    rating.setAttribute("role", "img");
    rating.setAttribute(
      "aria-label",
      `${ratingValue} out of 5 stars`
    );

    for (let starIndex = 0; starIndex < 5; starIndex++) {
      const star = document.createElement("span");
      star.className = "client-star";
      star.textContent = "★";
      star.setAttribute("aria-hidden", "true");

      if (starIndex >= ratingValue) {
        star.classList.add("is-empty");
      }

      rating.appendChild(star);
    }

    // Testimonial
    const quote = document.createElement("blockquote");
    quote.className = "client-quote";

    const quoteText = document.createElement("p");
    quoteText.textContent = client.quote;

    quote.appendChild(quoteText);

    // Client information
    const details = document.createElement("footer");

    const name = document.createElement("h3");
    name.className = "client-name";
    name.id = nameId;
    name.textContent = client.name;

    const role = document.createElement("p");
    role.className = "client-role";
    role.textContent = client.role;

    details.append(name, role);
    body.append(rating, quote, details);
    card.append(photoContainer, body);

    return card;
  }

  // Automatically scroll client cards in a continuous loop.
function initializeClientAutoScroll(grid) {
  const originalCards = [...grid.children];

  if (!originalCards.length) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const speed = 30; // Movement speed in pixels per second.

  let loopWidth = 0;
  let position = grid.scrollLeft;
  let previousTime = 0;
  let animationFrame = null;
  let resizeFrame = null;

  let hovered = false;
  let focused = grid.contains(document.activeElement);
  let touching = false;
  let manualPauseUntil = 0;

  // Duplicate cards for a seamless visual loop.
  // Hide duplicate content from assistive technology.
  originalCards.forEach((card) => {
    const clone = card.cloneNode(true);

    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.removeAttribute("id");
    clone.removeAttribute("aria-labelledby");

    clone.querySelectorAll("[id]").forEach((element) => {
      element.removeAttribute("id");
    });

    // Keep duplicate images synchronized with existing fallbacks.
    const originalPhoto = card.querySelector(".client-photo");
    const clonedPhoto = clone.querySelector(".client-photo");

    if (originalPhoto && clonedPhoto) {
      const photoObserver = new MutationObserver(() => {
        clonedPhoto.replaceChildren(
          ...[...originalPhoto.childNodes].map((node) =>
            node.cloneNode(true)
          )
        );
      });

      photoObserver.observe(originalPhoto, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["hidden"]
      });
    }

    grid.appendChild(clone);
  });

  const firstClone = grid.children[originalCards.length];

  function measureLoop() {
    resizeFrame = null;

    loopWidth =
      firstClone.getBoundingClientRect().left -
      originalCards[0].getBoundingClientRect().left;

    position = grid.scrollLeft;
  }

  function scheduleMeasurement() {
    if (resizeFrame !== null) return;

    resizeFrame = requestAnimationFrame(measureLoop);
  }

  function animate(time) {
    animationFrame = null;

    if (document.hidden || reducedMotion.matches) {
      previousTime = 0;
      return;
    }

    const elapsed = previousTime
      ? Math.min((time - previousTime) / 1000, 0.05)
      : 0;

    previousTime = time;

    const paused =
      hovered ||
      focused ||
      touching ||
      time < manualPauseUntil;

    if (!paused && loopWidth > 0) {
      position += speed * elapsed;

      if (position >= loopWidth) {
        position %= loopWidth;
      }

      grid.scrollLeft = position;
    } else {
      position = grid.scrollLeft;
    }

    animationFrame = requestAnimationFrame(animate);
  }

  function startAnimation() {
    if (
      animationFrame !== null ||
      document.hidden ||
      reducedMotion.matches
    ) {
      return;
    }

    previousTime = 0;
    animationFrame = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (animationFrame !== null) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    previousTime = 0;
  }

  // Pause while the mouse is over the cards.
  grid.addEventListener("mouseenter", () => {
    hovered = true;
  });

  grid.addEventListener("mouseleave", () => {
    hovered = false;
    position = grid.scrollLeft;
  });

  // Pause for keyboard users.
  grid.addEventListener("focusin", () => {
    focused = true;
  });

  grid.addEventListener("focusout", (event) => {
    focused = grid.contains(event.relatedTarget);
    position = grid.scrollLeft;
  });

  // Allow manual swiping on touch screens.
  grid.addEventListener(
    "touchstart",
    () => {
      touching = true;
    },
    { passive: true }
  );

  function finishTouch() {
    touching = false;
    manualPauseUntil = performance.now() + 1500;
    position = grid.scrollLeft;
  }

  grid.addEventListener("touchend", finishTouch, { passive: true });
  grid.addEventListener("touchcancel", finishTouch, { passive: true });

  grid.addEventListener(
    "wheel",
    () => {
      manualPauseUntil = performance.now() + 1500;
    },
    { passive: true }
  );

  // Stop background work when the browser tab is hidden.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else {
      position = grid.scrollLeft;
      startAnimation();
    }
  });

  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) {
      stopAnimation();
    } else {
      position = grid.scrollLeft;
      startAnimation();
    }
  });

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(scheduleMeasurement);

    resizeObserver.observe(grid);
    resizeObserver.observe(originalCards[0]);
  } else {
    window.addEventListener("resize", scheduleMeasurement);
  }

  measureLoop();
  startAnimation();
}

  function initializeClients() {
    const grid = document.getElementById("clients-grid");

    if (!grid) {
      console.error('Client container "#clients-grid" was not found.');
      return;
    }

    if (grid.dataset.initialized === "true") return;

    const fragment = document.createDocumentFragment();

    clientsData.forEach((client, index) => {
      fragment.appendChild(createClientCard(client, index));
    });

    grid.replaceChildren(fragment);
    initializeClientAutoScroll(grid);

    // Enable one-card navigation with the left and right arrow keys.
    // Native touch, trackpad, and scrollbar scrolling remain available.
    grid.addEventListener("keydown", (event) => {
      if (event.target !== grid) return;

      if (
        event.key !== "ArrowLeft" &&
        event.key !== "ArrowRight"
      ) {
        return;
      }

      const firstCard = grid.querySelector(".client-card");

      if (!firstCard) return;
      if (grid.scrollWidth <= grid.clientWidth) return;

      event.preventDefault();

      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
      const distance = firstCard.getBoundingClientRect().width + gap;
      const direction = event.key === "ArrowRight" ? 1 : -1;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      grid.scrollBy({
        left: distance * direction,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  // Initialize after the HTML is available.
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeClients,
      { once: true }
    );
  } else {
    initializeClients();
  }
})();