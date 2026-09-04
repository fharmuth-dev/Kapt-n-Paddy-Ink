document.addEventListener("DOMContentLoaded", () => {

    /* Preloader zügig ausblenden */
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

    /* ==========================================================================
       CAROUSEL / RONDELL STEUERUNG
       ========================================================================== */
    const carousel = document.getElementById("works-carousel");
    const cards = carousel ? Array.from(carousel.querySelectorAll(".work-card")) : [];
    const activeIndexEl = document.getElementById("active-index");
    const totalIndexEl = document.getElementById("total-index");
    const prevBtn = document.getElementById("gallery-prev");
    const nextBtn = document.getElementById("gallery-next");

    if (carousel && cards.length) {
        const pad = (n) => String(n + 1).padStart(2, "0");
        if (totalIndexEl) totalIndexEl.textContent = pad(cards.length - 1);

        const getCurrentIndex = () => {
            const scrollLeft = carousel.scrollLeft;
            let closest = 0;
            let closestDist = Infinity;
            cards.forEach((card, i) => {
                const dist = Math.abs(card.offsetLeft - carousel.offsetLeft - scrollLeft);
                if (dist < closestDist) {
                    closestDist = dist;
                    closest = i;
                }
            });
            return closest;
        };

        const updateCounter = () => {
            if (activeIndexEl) activeIndexEl.textContent = pad(getCurrentIndex());
        };

        const scrollToIndex = (i) => {
            const clamped = Math.max(0, Math.min(cards.length - 1, i));
            const card = cards[clamped];
            const target = card.offsetLeft - carousel.offsetLeft - (carousel.clientWidth - card.clientWidth) / 2;
            carousel.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
        };

        // Schrittweite = eine Kartenbreite + Abstand. Robuster als "auf Karte X zentrieren",
        // da bei breiten Bildschirmen mehrere Karten gleichzeitig sichtbar sind und ein
        // Zentrieren früher Karten rechnerisch eine negative (= geclampte, wirkungslose)
        // Scroll-Position ergeben kann.
        const stepDistance = () => {
            const style = getComputedStyle(carousel);
            const gap = parseFloat(style.columnGap || style.gap || "16") || 16;
            return cards[0].getBoundingClientRect().width + gap;
        };

        const scrollByStep = (direction) => {
            carousel.scrollBy({ left: direction * stepDistance(), behavior: "smooth" });
        };

        let scrollTimeout;
        carousel.addEventListener("scroll", () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateCounter, 80);
        });

        if (prevBtn) prevBtn.addEventListener("click", () => scrollByStep(-1));
        if (nextBtn) nextBtn.addEventListener("click", () => scrollByStep(1));

        carousel.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") scrollByStep(1);
            if (e.key === "ArrowLeft") scrollByStep(-1);
        });

        updateCounter();
    }

    /* ==========================================================================
       LIGHTBOX
       ========================================================================== */
    const lightbox = document.getElementById("works-lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const lightboxClose = document.getElementById("lightbox-close");

    cards.forEach((card) => {
        card.addEventListener("click", () => {
            const img = card.querySelector("img");
            if (!img || !lightbox || !lightboxImg) return;
            lightboxImg.src = img.currentSrc || img.src;
            lightboxImg.alt = img.alt || "";
            lightbox.classList.add("open");
            lightbox.setAttribute("aria-hidden", "false");
        });
    });

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove("open");
        lightbox.setAttribute("aria-hidden", "true");
    };

    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    if (lightbox) {
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeLightbox();
    });
});
