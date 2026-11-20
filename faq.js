(() => {
  "use strict";

  // Replace this sample content with your company FAQs.
  const faqData = [
    {
      question: "What services does Ekora Infotech offer?",
      answer:
        "We offer website development, mobile app development, branding, creative design, and digital marketing services."
    },
    {
      question: "How do I know which service is right for me?",
      answer:
        "Share your business goals and project requirements with us. We can help you identify the services that suit your needs."
    },
    {
      question: "How can I discuss my project?",
      answer:
        "Use our contact page to share your requirements and preferred contact details so we can discuss the next steps."
    },
    {
      question: "Do you offer online consultations?",
      answer:
        "Project requirements can be discussed remotely. Contact us to arrange a suitable time."
    },
    {
      question: "Can you update an existing website?",
      answer:
        "We can review your current website and discuss design improvements, new features, and development requirements."
    }
  ];

  function initializeFaq() {
    const list = document.getElementById("faq-list");

    if (!list) {
      console.error('FAQ container "#faq-list" was not found.');
      return;
    }

    if (list.dataset.initialized === "true") return;

    const fragment = document.createDocumentFragment();

    faqData.forEach((faq, index) => {
      const item = document.createElement("article");
      item.className = "faq-item";

      const heading = document.createElement("h3");
      heading.className = "faq-question-heading";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "faq-question";
      button.id = `faq-question-${index + 1}`;

      const answerId = `faq-answer-${index + 1}`;

      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", answerId);

      const questionText = document.createElement("span");
      questionText.textContent = faq.question;

      const arrow = document.createElement("span");
      arrow.className = "faq-arrow";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");

      button.append(questionText, arrow);
      heading.appendChild(button);

      const answer = document.createElement("div");
      answer.className = "faq-answer";
      answer.id = answerId;
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", button.id);
      answer.setAttribute("aria-hidden", "true");
      answer.setAttribute("inert", "");

      const answerInner = document.createElement("div");
      answerInner.className = "faq-answer-inner";

      const paragraph = document.createElement("p");
      paragraph.textContent = faq.answer;

      answerInner.appendChild(paragraph);
      answer.appendChild(answerInner);

      item.append(heading, answer);
      fragment.appendChild(item);
    });

    list.replaceChildren(fragment);
    list.dataset.initialized = "true";

    const items = [...list.querySelectorAll(".faq-item")];
    const hoverAvailable = window.matchMedia(
      "(any-hover: hover)"
    );

    function setOpenItem(selectedItem) {
      items.forEach((item) => {
        const isOpen = item === selectedItem;
        const button = item.querySelector(".faq-question");
        const answer = item.querySelector(".faq-answer");

        item.classList.toggle("is-open", isOpen);
        button.setAttribute("aria-expanded", String(isOpen));
        answer.setAttribute("aria-hidden", String(!isOpen));
        answer.toggleAttribute("inert", !isOpen);
      });
    }

    items.forEach((item, index) => {
      const button = item.querySelector(".faq-question");

      // Open on mouse hover.
      // Keep the latest answer open when the pointer leaves.
      item.addEventListener("pointerenter", (event) => {
        if (
          event.pointerType === "mouse" &&
          hoverAvailable.matches
        ) {
          setOpenItem(item);
        }
      });

      // Support mobile taps and keyboard activation.
      button.addEventListener("click", (event) => {
        const mouseActivation =
          event.detail > 0 &&
          hoverAvailable.matches &&
          item.matches(":hover");

        if (mouseActivation) {
          setOpenItem(item);
          return;
        }

        setOpenItem(
          item.classList.contains("is-open") ? null : item
        );
      });

      // Optional arrow-key navigation between questions.
      button.addEventListener("keydown", (event) => {
        let targetIndex;

        switch (event.key) {
          case "ArrowDown":
            targetIndex = (index + 1) % items.length;
            break;

          case "ArrowUp":
            targetIndex =
              (index - 1 + items.length) % items.length;
            break;

          case "Home":
            targetIndex = 0;
            break;

          case "End":
            targetIndex = items.length - 1;
            break;

          default:
            return;
        }

        event.preventDefault();

        items[targetIndex]
          .querySelector(".faq-question")
          .focus();
      });
    });

    // Keep the first answer open initially.
    if (items.length) {
      setOpenItem(items[0]);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      initializeFaq,
      { once: true }
    );
  } else {
    initializeFaq();
  }
})();