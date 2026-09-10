document.addEventListener("DOMContentLoaded", () => {
    const isDesktop = window.matchMedia("(min-width: 760px)").matches;
    const preloader = document.getElementById("smart-preloader");

    if (preloader) {
        setTimeout(() => {
            if (isDesktop && typeof gsap !== "undefined") {
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1,
                    ease: "power4.inOut",
                    onComplete: () => {
                        preloader.style.display = "none";
                        document.body.classList.remove("preloader-active");
                    }
                });
            } else {
                preloader.style.transition = "opacity .5s ease";
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.style.display = "none";
                    document.body.classList.remove("preloader-active");
                }, 500);
            }
        }, 350);
    }

    // Scroll-Parallax für die Kompass-/Steuerrad-Grafiken: nur Desktop.
    if (isDesktop && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
        gsap.to(".icon-wheel-gallery", {
            rotation: 60,
            ease: "none",
            scrollTrigger: {
                trigger: ".paddy-gallery",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    }
});
