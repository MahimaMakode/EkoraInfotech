var tl = gsap.timeline()
tl.from("#page1", {
    opacity: 0,
    duration: 0.2,
    delay: 0.2
})
tl.from("#page1", {
    transform: "scaleX(0.7) scaleY(0.2) translateY(80%)",
    borderRadius: "150px",
    duration: 2,
    ease: "expo.out"
})
tl.from("nav", {
    opacity: 0,
    delay: 0.5,
    translateY: -100
})
tl.from("#page1 #heading-area, #page1 h1, #page1 p, #page1 #page1-somthing, #page1 button, #page1 #moving-div", {
    opacity: 0,
    duration: 0.5,
    stagger: 0.2
})



var nav = document.querySelector("nav")

nav.addEventListener("mouseenter", function () {
    let tl = gsap.timeline()

    tl.to("#nav-bottom", {
        height: "21vh",
        duration: 0.5
    })
    tl.to(".nav-part2 h5", {
        display: "block",
        duration: 0.05

    })
    tl.to(".nav-part2 h5 span", {
        y: 0,
        // duration:0.3,
        stagger: {
            amount: 0.5
        }
    })
})
nav.addEventListener("mouseleave", function () {
    let tl = gsap.timeline()
    tl.to(".nav-part2 h5 span", {
        y: 25,
        stagger: {
            amount: 0.2
        }
    })
    tl.to(".nav-part2 h5", {
        display: "none",
        duration: 0.1
    })
    tl.to("#nav-bottom", {
        height: 0,
        duration: 0.4
    })
})



gsap.registerPlugin(ScrollTrigger);

var tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#page2",
        start: "top 90%",
        end: "top 10%",
        scrub: 1,
        markers: true
    }
});

tl.to(".h-box", {
    top: "613%",
    left: "0%",
    x: -320,
    y: 20,
    scale: 0.5,
    rotate: "20deg",
    ease: "none"

}, 0);

tl.to("#page2 .about-us-section", {
    // background: "linear-gradient(105deg,rgb(0, 0, 0),rgba(40, 40, 40, 0.676),rgb(0, 0, 0))",
    border: "1px solid rgb(188, 188, 188)",
    borderRadius: "5px",
    opacity:1,
    ease: "none"
}, 0.2);



document.querySelectorAll(".gr").forEach((card) => {

    const exploreBtn = card.querySelector(".explore-btn");
    const closeBtn = card.querySelector(".close-service");

    if (!exploreBtn || !closeBtn) return;

    exploreBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        // Close other open cards
        document.querySelectorAll(".gr.active").forEach((item) => {
            item.classList.remove("active");
        });

        // Open selected card
        card.classList.add("active");
    });

    closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("active");
    });

});
















const services = [
    {
        name: "Web Development",
        icon: "ri-code-s-slash-fill",
        desc: "Fast, accessible websites built around your business goals.",
        tech: ["React", "TypeScript", "Node.js"],
        details: "We create modern, responsive and high-performance websites designed around your business goals.",
        features: [
            "Front-End Development: Engaging and responsive user interfaces.",
            "Back-End Development: Secure and efficient server-side applications.",
            "Web Applications: Dynamic and scalable web applications.",
            "E-Commerce Development: Powerful online shopping experiences.",
            "Custom Solutions: Websites tailored to your business needs."
        ]
    },
    {
        name: "E-Commerce Development",
        icon: "ri-shopping-cart-line",
        desc: "Powerful online stores with smooth shopping experiences.",
        tech: ["Shopify", "WooCommerce", "Payment Gateway"],
        details: "We build online stores that make shopping simple and help businesses sell products online.",
        features: [
            "Custom online store development.",
            "Shopping cart and checkout integration.",
            "Secure payment gateway integration.",
            "Product and inventory management.",
            "Responsive shopping experience."
        ]
    },
    {
        name: "Mobile App Development",
        icon: "ri-smartphone-line",
        desc: "Smart mobile applications for modern businesses.",
        tech: ["React Native", "Flutter", "Android"],
        details: "We develop user-friendly mobile applications that connect your business with customers.",
        features: [
            "Android application development.",
            "Cross-platform app development.",
            "Modern and intuitive app interfaces.",
            "API and database integration.",
            "Application testing and optimization."
        ]
    },
    {
        name: "Custom Software",
        icon: "ri-settings-3-line",
        desc: "Tailored software solutions built around your workflow.",
        tech: ["Node.js", "TypeScript", "Database"],
        details: "We develop customized software solutions to simplify complex business processes.",
        features: [
            "Business software development.",
            "Workflow automation.",
            "Custom dashboards and reports.",
            "Database integration.",
            "Scalable software architecture."
        ]
    },
    {
        name: "CRM & ERP Solutions",
        icon: "ri-team-line",
        desc: "Manage customers, teams and business operations.",
        tech: ["React", "Database", "Node.js"],
        details: "Manage your customers, employees, operations and business information from one platform.",
        features: [
            "Customer relationship management.",
            "Employee and team management.",
            "Business process automation.",
            "Reports and analytics dashboards.",
            "Centralized business data."
        ]
    },
    {
        name: "AI & Automation",
        icon: "ri-brain-line",
        desc: "Intelligent automation that makes work faster.",
        tech: ["Python", "AI APIs", "Automation"],
        details: "We use intelligent automation to reduce repetitive work and improve business productivity.",
        features: [
            "AI-powered business solutions.",
            "Chatbot development.",
            "Workflow automation.",
            "Third-party AI API integration.",
            "Smart data processing."
        ]
    },
    {
        name: "API Development",
        icon: "ri-plug-line",
        desc: "Connect applications with powerful API solutions.",
        tech: ["REST", "GraphQL", "Node.js"],
        details: "We build reliable APIs that allow different applications and services to communicate seamlessly.",
        features: [
            "REST API development.",
            "GraphQL API integration.",
            "Third-party API integration.",
            "Secure authentication systems.",
            "API testing and documentation."
        ]
    },
    {
        name: "UI/UX Design",
        icon: "ri-palette-line",
        desc: "Beautiful interfaces focused on user experience.",
        tech: ["Figma", "FigJam", "Prototyping"],
        details: "We design intuitive digital experiences that combine attractive visuals with easy navigation.",
        features: [
            "Website UI design.",
            "Mobile application UI design.",
            "Wireframing and prototyping.",
            "User experience research.",
            "Design systems and components."
        ]
    },
    {
        name: "Cloud & DevOps",
        icon: "ri-cloud-line",
        desc: "Reliable cloud infrastructure and deployment.",
        tech: ["AWS", "Docker", "CI/CD"],
        details: "We help businesses deploy, manage and scale applications using modern cloud technologies.",
        features: [
            "Cloud infrastructure setup.",
            "Application deployment.",
            "CI/CD pipeline configuration.",
            "Containerization with Docker.",
            "Performance monitoring."
        ]
    },
    {
        name: "Cyber Security",
        icon: "ri-shield-check-line",
        desc: "Protect your applications and business data.",
        tech: ["Security", "Testing", "Monitoring"],
        details: "We help improve application security and protect important business information.",
        features: [
            "Application security assessment.",
            "Vulnerability identification.",
            "Secure authentication.",
            "Data protection practices.",
            "Security testing and monitoring."
        ]
    },
    {
        name: "Blockchain",
        icon: "ri-box-3-line",
        desc: "Secure decentralized solutions for businesses.",
        tech: ["Solidity", "Ethereum", "Web3"],
        details: "We explore blockchain-based solutions for transparent and secure digital applications.",
        features: [
            "Smart contract development.",
            "Blockchain application integration.",
            "Web3 integration.",
            "Decentralized application development.",
            "Smart contract testing."
        ]
    },
    {
        name: "WordPress & Themes",
        icon: "ri-wordpress-line",
        desc: "Custom WordPress websites and themes.",
        tech: ["WordPress", "PHP", "WooCommerce"],
        details: "We create flexible WordPress websites that are easy to manage and update.",
        features: [
            "Custom WordPress website development.",
            "Theme customization.",
            "Plugin integration.",
            "WooCommerce store setup.",
            "Website speed optimization."
        ]
    },
    {
        name: "Maintenance & Support",
        icon: "ri-tools-line",
        desc: "Keep your website updated and running smoothly.",
        tech: ["Monitoring", "Git", "Support"],
        details: "We keep your digital platforms updated, secure and performing reliably.",
        features: [
            "Website updates and maintenance.",
            "Bug fixing and troubleshooting.",
            "Performance optimization.",
            "Backup and recovery support.",
            "Technical assistance."
        ]
    },
    {
        name: "Graphic Design",
        icon: "ri-image-line",
        desc: "Creative visuals and digital brand experiences.",
        tech: ["Figma", "Adobe", "Branding"],
        details: "We create impactful visual designs that help businesses build a consistent brand identity.",
        features: [
            "Logo and brand identity design.",
            "Social media creatives.",
            "Marketing and promotional designs.",
            "Website graphics and banners.",
            "Print design solutions."
        ]
    },
    {
        name: "Domain & Hosting",
        icon: "ri-server-line",
        desc: "Reliable hosting and domain management.",
        tech: ["DNS", "Hosting", "SSL"],
        details: "We help businesses establish a reliable online presence with domain and hosting solutions.",
        features: [
            "Domain registration assistance.",
            "Web hosting setup.",
            "DNS configuration.",
            "SSL certificate setup.",
            "Hosting migration and support."
        ]
    }
];

/* CREATE SERVICE CARDS */

const servicesList = document.getElementById("servicesList");

services.forEach((service, index) => {

    const card = document.createElement("article");
    card.className = "service-card";

    card.innerHTML = `
        <div class="card-collapsed">
            <span class="card-number">
                ${String(index + 1).padStart(2, "0")}
            </span>

            <span class="card-vertical-name">
                ${service.name}
            </span>

            <i class="ri-arrow-down-line card-arrow"></i>
        </div>

        <div class="card-expanded">
            <i class="${service.icon} card-icon"></i>

            <h3>${service.name}</h3>

            <p>${service.desc}</p>

            <div class="card-tech">
                ${service.tech.map(item => `<span>${item}</span>`).join("")}
            </div>

            <button class="explore-btn" data-index="${index}">
                Explore Service
                <i class="ri-arrow-up-right-line"></i>
            </button>
        </div>
    `;

    servicesList.appendChild(card);
});


/* LANDSCAPE POPUP */

const overlay = document.getElementById("serviceOverlay");
const closeService = document.getElementById("closeService");

function openService(index) {

    const service = services[index];

    document.getElementById("popupIcon").className = service.icon;
    document.getElementById("popupNumber").textContent =
        `SERVICE ${String(index + 1).padStart(2, "0")}`;

    document.getElementById("popupTitle").textContent = service.name;
    document.getElementById("popupDescription").textContent = service.details;

    document.getElementById("popupTech").innerHTML =
        service.tech.map(item => `<span>${item}</span>`).join("");

    document.getElementById("popupList").innerHTML =
        service.features.map(item => `<li>${item}</li>`).join("");

    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closePopup() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
}

servicesList.addEventListener("click", (event) => {

    const button = event.target.closest(".explore-btn");

    if (!button) return;

    const index = Number(button.dataset.index);
    openService(index);
});

closeService.addEventListener("click", closePopup);

overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closePopup();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closePopup();
    }
});


/* MANUAL NAVIGATION */

const track = document.getElementById("servicesTrack");

document.getElementById("serviceNext").addEventListener("click", () => {
    track.scrollBy({
        left: 350,
        behavior: "smooth"
    });
});

document.getElementById("servicePrev").addEventListener("click", () => {
    track.scrollBy({
        left: -350,
        behavior: "smooth"
    });
});


/* AUTO SCROLL */

let autoScroll;
let autoDirection = 1;

function startAutoScroll() {

    stopAutoScroll();

    autoScroll = setInterval(() => {

        if (overlay.classList.contains("active")) return;

        const maxScroll = track.scrollWidth - track.clientWidth;

        if (maxScroll <= 0) return;

        if (track.scrollLeft >= maxScroll - 3) {
            autoDirection = -1;
        }

        if (track.scrollLeft <= 3) {
            autoDirection = 1;
        }

        track.scrollLeft += autoDirection * 1.2;

    }, 25);
}

function stopAutoScroll() {
    clearInterval(autoScroll);
}

track.addEventListener("mouseenter", stopAutoScroll);
track.addEventListener("mouseleave", startAutoScroll);
track.addEventListener("touchstart", stopAutoScroll, { passive: true });
track.addEventListener("touchend", startAutoScroll, { passive: true });

overlay.addEventListener("transitionend", () => {
    if (!overlay.classList.contains("active")) {
        startAutoScroll();
    }
});

startAutoScroll();

