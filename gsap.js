// ABOUT SECTION — GSAP SCROLL ANIMATION
(() => {
  "use strict";

  function initAboutScrollAnimation() {
    const about = document.querySelector("#about");
    if (!about || !window.gsap || !window.ScrollTrigger) return;

    if (about.dataset.gsapInitialized === "true") return;
    about.dataset.gsapInitialized = "true";

    gsap.registerPlugin(ScrollTrigger);

    const label = about.querySelector(".about-description .section-label");
    const copy = about.querySelector(".about-description .about-copy");
    const button = about.querySelector(".about-button");
    const heading = about.querySelector("#about-heading");
    const portrait = about.querySelector(".portrait-image");
    const stats = [...about.querySelectorAll(".stat")];
    const teamImage = about.querySelector(".team-image");

    const mm = gsap.matchMedia();

    // Desktop Animation
    mm.add(
      "(min-width: 801px) and (prefers-reduced-motion: no-preference)",
      () => {
        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: about,
            start: "top 78%",
            end: "bottom 38%",
            scrub: 1.1,
            invalidateOnRefresh: true
          }
        });

        if (label) {
          timeline.fromTo(label,
            { autoAlpha: 0, y: 22 },
            { autoAlpha: 1, y: 0, duration: 0.45 },
            0
          );
        }

        if (copy) {
          timeline.fromTo(copy,
            { autoAlpha: 0, y: 28 },
            { autoAlpha: 1, y: 0, duration: 0.65 },
            0.12
          );
        }

        if (button) {
          timeline.fromTo(button,
            { autoAlpha: 0, y: 18, scale: 0.96 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.45 },
            0.28
          );
        }

        if (heading) {
          timeline.fromTo(heading,
            {
              autoAlpha: 0,
              y: 55,
              rotateX: -8,
              transformOrigin: "50% 100%"
            },
            {
              autoAlpha: 1,
              y: 0,
              rotateX: 0,
              duration: 0.9
            },
            0.08
          );
        }

        if (portrait) {
          timeline.fromTo(portrait,
            {
              autoAlpha: 0,
              y: 75,
              scale: 0.88,
              clipPath: "inset(12% 8% 12% 8% round 8px)"
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 5px)",
              duration: 0.8
            },
            0.48
          );
        }

        // STATS ANIMATION — HALF TIMELINE
        if (stats.length) {
          timeline.fromTo(stats,
            { autoAlpha: 0, y: 35 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              stagger: 0.12
            },
            0.35
          );

          stats.forEach((stat) => {
            const value = stat.querySelector(".stat-value");
            if (!value) return;

            const numberNode = [...value.childNodes].find(
              node => node.nodeType === Node.TEXT_NODE
            );

            const target = Number((numberNode?.textContent || "").trim());
            if (!Number.isFinite(target)) return;

            const counter = { value: 0 };

            timeline.fromTo(counter,
              { value: 0 },
              {
                value: target,
                duration: 0.25,
                ease: "none",
                onUpdate: () => {
                  if (numberNode) {
                    numberNode.textContent = String(
                      Math.round(counter.value)
                    );
                  }
                }
              },
              0.45
            );
          });
        }

        if (teamImage) {
          timeline.fromTo(teamImage,
            {
              autoAlpha: 0,
              y: 85,
              scale: 0.92,
              clipPath: "inset(10% 7% 10% 7% round 8px)"
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0% round 5px)",
              duration: 0.95
            },
            0.5
          );
        }

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      }
    );

    // Mobile Animation
    mm.add(
      "(max-width: 800px) and (prefers-reduced-motion: no-preference)",
      () => {
        const items = [
          label, copy, button, heading,
          portrait, ...stats, teamImage
        ].filter(Boolean);

        gsap.set(items, {
          autoAlpha: 0,
          y: 24
        });

        const tween = gsap.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: about,
            start: "top 78%",
            once: true
          }
        });

        return () => tween.scrollTrigger?.kill();
      }
    );
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initAboutScrollAnimation,
      { once: true }
    );
  } else {
    initAboutScrollAnimation();
  }
})();