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
    top:"613%",
    left: "0%",
    x:-320,
    y:20,
    scale: 0.5,
    rotate:"20deg",
    ease: "none"

}, 0);

tl.to("#page2 .about-us-section", {
     background:"linear-gradient(105deg,rgb(0, 0, 0),rgba(40, 40, 40, 0.676),rgb(0, 0, 0))",
         border: "1px solid rgb(188, 188, 188)",
    borderRadius: "5px",
    // background: "linear-gradient(90deg,#3c2eff,#695fff,#07006f)",
    ease: "none"
}, 0.2);




