// cursor.js
(() => {
    function initStarCursor() {
        let canvas = document.getElementById("starCanvas");

        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.id = "starCanvas";
            document.body.appendChild(canvas);
        }

        // Prevent duplicate initialization.
        if (canvas.dataset.initialized === "true") return;
        canvas.dataset.initialized = "true";

        // Keep canvas outside animated page containers.
        document.body.appendChild(canvas);
        canvas.setAttribute("aria-hidden", "true");

        Object.assign(canvas.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "2147483647",
            pointerEvents: "none",
            background: "transparent"
        });

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );

        const MAX_STARS = 350;

        let width = 0;
        let height = 0;
        let stars = [];

        let lastMouseX = null;
        let lastMouseY = null;
        let lastTime = 0;
        let animationId = null;

        function resetMouse() {
            lastMouseX = null;
            lastMouseY = null;
        }

        function stopAnimation() {
            if (animationId !== null) {
                cancelAnimationFrame(animationId);
            }

            animationId = null;
            stars = [];
            lastTime = 0;

            resetMouse();
            ctx.clearRect(0, 0, width, height);
        }

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);

            canvas.width = Math.round(width * dpr);
            canvas.height = Math.round(height * dpr);

            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            stopAnimation();
        }

        class Star {
            constructor(x, y, velocityX, velocityY) {
                this.x = x;
                this.y = y;

                this.finalSize = 0.5 + Math.random() * 1.5;
                this.size = this.finalSize * 2;

                this.alpha = 1;
                this.velocityX = velocityX * 0.05;
                this.velocityY =
                    1 + Math.random() + velocityY * 0.05;

                this.gravity = 0.02;
                this.drag = 0.97;
                this.timeElapsed = 0;
                this.lifetime = 3300;
            }

            update(deltaTime) {
                // Normalize movement for different screen refresh rates.
                const frame = deltaTime / (1000 / 60);

                this.x +=
                    this.velocityX * frame +
                    (Math.random() * 0.5 - 0.25) * Math.sqrt(frame);

                this.velocityX *= Math.pow(this.drag, frame);

                this.y += this.velocityY * frame;
                this.velocityY += this.gravity * frame;

                this.timeElapsed += deltaTime;

                this.alpha = Math.max(
                    0,
                    1 - this.timeElapsed / this.lifetime
                );

                const shrinkProgress = Math.min(
                    this.timeElapsed / 2000,
                    1
                );

                this.size = this.finalSize * (2 - shrinkProgress);
            }

            draw() {
    ctx.save();

    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = "#ffffff";

    ctx.beginPath();
    ctx.arc(
        this.x,
        this.y,
        this.size,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
}
        }

        function addStar(event) {
            if (
                event.pointerType !== "mouse" ||
                reducedMotion.matches ||
                document.hidden
            ) {
                return;
            }

            if (lastMouseX === null || lastMouseY === null) {
                lastMouseX = event.clientX;
                lastMouseY = event.clientY;
            }

            const velocityX = Math.max(
                -100,
                Math.min(100, event.clientX - lastMouseX)
            );

            const velocityY = Math.max(
                -100,
                Math.min(100, event.clientY - lastMouseY)
            );

            lastMouseX = event.clientX;
            lastMouseY = event.clientY;

            const randomOffsetX = (Math.random() - 0.5) * 100;
            const randomOffsetY = (Math.random() - 0.5) * 100;

            stars.push(
                new Star(
                    event.clientX,
                    event.clientY,
                    velocityX + randomOffsetX,
                    velocityY + randomOffsetY
                )
            );

            if (stars.length > MAX_STARS) {
                stars.splice(0, stars.length - MAX_STARS);
            }

            if (animationId === null) {
                lastTime = performance.now();
                animationId = requestAnimationFrame(animate);
            }
        }

        function animate(time) {
            animationId = null;

            if (document.hidden || reducedMotion.matches) {
                stopAnimation();
                return;
            }

            const deltaTime = Math.min(
                Math.max(time - lastTime, 0),
                50
            );

            lastTime = time;

            ctx.clearRect(0, 0, width, height);

            stars = stars.filter((star) => {
                star.update(deltaTime);

                const visible =
                    star.alpha > 0 &&
                    star.y - star.size < height &&
                    star.x + star.size > 0 &&
                    star.x - star.size < width;

                if (visible) star.draw();

                return visible;
            });

            // Stop rendering when all particles have disappeared.
            if (stars.length > 0) {
                animationId = requestAnimationFrame(animate);
            }
        }

        window.addEventListener("pointermove", addStar, {
            passive: true
        });

        window.addEventListener("resize", resizeCanvas, {
            passive: true
        });

        window.addEventListener("blur", stopAnimation);

        document.documentElement.addEventListener(
            "pointerleave",
            resetMouse
        );

        document.addEventListener(
            "visibilitychange",
            stopAnimation
        );

        reducedMotion.addEventListener("change", stopAnimation);

        resizeCanvas();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initStarCursor,
            { once: true }
        );
    } else {
        initStarCursor();
    }
})();

