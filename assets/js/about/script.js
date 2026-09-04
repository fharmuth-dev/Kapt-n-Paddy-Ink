document.addEventListener("DOMContentLoaded", () => {
    // Preloader zügig ausblenden (Unterseite ohne kritische Hero-Bilder-Kette)
    const preloader = document.getElementById("smart-preloader");
    if (preloader) {
        setTimeout(() => {
            if (typeof gsap !== "undefined") {
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
                preloader.style.display = "none";
                document.body.classList.remove("preloader-active");
            }
        }, 350);
    }

    // Leichte Scroll-Parallax für die Kompass-/Steuerrad-Grafiken (nur Desktop / feine Pointer)
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
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
