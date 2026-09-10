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
                // Handy: bewusst OHNE GSAP, einfacher CSS-Übergang
                preloader.style.transition = "opacity .5s ease";
                preloader.style.opacity = "0";
                setTimeout(() => {
                    preloader.style.display = "none";
                    document.body.classList.remove("preloader-active");
                }, 500);
            }
        }, 350);
    }

    // Parallax-Rotation der Steuerrad-Grafik: nur Desktop, läuft auf dem
    // Handy nie — weder über pointer:fine (schlägt auf Touch ohnehin fehl)
    // noch jetzt zusätzlich explizit über die Bildschirmbreite abgesichert.
    if (isDesktop && typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
        gsap.utils.toArray(".icon-wheel").forEach((wheel) => {
            gsap.to(wheel, {
                rotation: 90,
                ease: "none",
                scrollTrigger: {
                    trigger: wheel,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }
});
