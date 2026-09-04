document.addEventListener("DOMContentLoaded", () => {
    const accordionItems = document.querySelectorAll(".accordion-item");

    accordionItems.forEach(item => {
        const trigger = item.querySelector(".accordion-trigger");
        const content = item.querySelector(".accordion-content");

        if (trigger && content) {
            trigger.addEventListener("click", () => {
                const isExpanded = trigger.getAttribute("aria-expanded") === "true";

                // Alle anderen Instanzen schließen (optional, für Solo-Akkordeon-Verhalten)
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherTrigger = otherItem.querySelector(".accordion-trigger");
                        const otherContent = otherItem.querySelector(".accordion-content");
                        if (otherTrigger && otherContent) {
                            otherTrigger.setAttribute("aria-expanded", "false");
                            otherContent.style.maxHeight = null;
                        }
                    }
                });

                // Aktuelles Element toggeln
                if (isExpanded) {
                    trigger.setAttribute("aria-expanded", "false");
                    content.style.maxHeight = null;
                } else {
                    trigger.setAttribute("aria-expanded", "true");
                    // Nutzt die scrollHeight zur exakten Pixelberechnung des Inhalts
                    content.style.maxHeight = content.scrollHeight + "px";
                }
                
                // Aktualisiert ScrollTrigger-Positionen, damit Animationen synchron bleiben
                if (typeof ScrollTrigger !== 'undefined') {
                    ScrollTrigger.refresh();
                }
            });
        }
    });

    // Custom Cursor Support für Akkordeon-Trigger (sofern auf PC aktiv)
    const cursor = document.querySelector(".cursor");
    if (cursor && window.matchMedia("(pointer: fine)").matches && typeof gsap !== "undefined") {
        document.querySelectorAll(".accordion-trigger").forEach(trigger => {
            trigger.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 3, duration: 0.2 }));
            trigger.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 1, duration: 0.2 }));
        });
    }
});
