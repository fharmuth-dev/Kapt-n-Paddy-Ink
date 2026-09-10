document.addEventListener("DOMContentLoaded", () => {

  // MOBILE RESPONSIVE NAV (unabhängig von GSAP, muss immer funktionieren)
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      menuToggle.classList.toggle("open");
    });
  }

  const isDesktop = window.matchMedia("(min-width: 760px)").matches;

  /* ==========================================================================
     HANDY: KEIN GSAP. Bewusst und vollständig getrennt vom Desktop-Zweig
     weiter unten — auf dem Smartphone wird an keiner Stelle mehr gsap.to/
     from/timeline/ScrollTrigger aufgerufen. Nur Preloader ausblenden (CSS-
     Transition) und Bilder in voller Auflösung nachladen. Text-Elemente
     (.word-reveal etc.) werden von GSAP nur per JS versteckt — läuft GSAP
     gar nicht erst, bleiben sie automatisch normal sichtbar, ganz ohne
     Zusatzaufwand.
     ========================================================================== */
  if (!isDesktop) {
    const preloader = document.getElementById("smart-preloader");
    let revealed = false;

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      if (preloader) {
        preloader.style.transition = "transform .7s cubic-bezier(.65,0,.35,1)";
        preloader.style.transform = "translateY(-100%)";
        setTimeout(() => { preloader.style.display = "none"; }, 750);
      }
      document.body.classList.remove("preloader-active");
      // .principle-item ist per CSS fest auf opacity:0 gesetzt (war bisher
      // nur durch die jetzt entfernte GSAP-Logik sichtbar) — hier direkt
      // und dauerhaft sichtbar machen, ganz ohne Scroll-Animation.
      document.querySelectorAll(".principle-item").forEach(el => {
        el.style.opacity = "1";
      });
      const curtainWiper = document.querySelector(".curtain-wiper");
      if (curtainWiper) {
        curtainWiper.style.transition = "transform .9s ease";
        curtainWiper.style.transform = "scaleX(0)";
      }
    };

    const mobileHeroImg = document.querySelector(".mobile-hero-ambient-bg .progressive-img");

    document.querySelectorAll(".progressive-img").forEach((img) => {
      const largeSrc = img.getAttribute("data-large");
      if (largeSrc) {
        const largeImage = new Image();
        largeImage.src = largeSrc;
        largeImage.onload = () => {
          img.src = largeSrc;
          img.classList.add("loaded");
          if (img === mobileHeroImg) reveal();
        };
      }
    });

    window.addEventListener("load", () => setTimeout(reveal, 100));
    setTimeout(reveal, 2500); // Sicherheitsnetz, falls gar nichts anderes greift

    return; // Ab hier: NICHTS von unten wird auf dem Handy ausgeführt.
  }

  /* ==========================================================================
     AB HIER NUR NOCH DESKTOP (min-width: 760px). Unverändert wie zuvor,
     wird auf ausdrücklichen Wunsch nicht mehr angetastet.
     ========================================================================== */
  if (typeof gsap === "undefined") {
    // Falls GSAP am PC ausnahmsweise nicht laden sollte: gleiches
    // Sicherheitsnetz wie früher, Seite bleibt trotzdem benutzbar.
    const preloader = document.getElementById("smart-preloader");
    const reveal = () => {
      if (preloader) {
        preloader.style.transition = "opacity .6s ease";
        preloader.style.opacity = "0";
        setTimeout(() => { preloader.style.display = "none"; }, 600);
      }
      document.body.classList.remove("preloader-active");
      document.querySelectorAll(".word-reveal, .line-reveal, .reveal-text").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      const curtainWiper = document.querySelector(".curtain-wiper");
      if (curtainWiper) curtainWiper.style.transform = "scaleX(0)";
    };
    document.querySelectorAll(".progressive-img").forEach((img) => {
      const largeSrc = img.getAttribute("data-large");
      if (largeSrc) {
        const largeImage = new Image();
        largeImage.src = largeSrc;
        largeImage.onload = () => { img.src = largeSrc; img.classList.add("loaded"); };
      }
    });
    window.addEventListener("load", () => setTimeout(reveal, 100));
    setTimeout(reveal, 2500);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".word-reveal, .line-reveal, .reveal-text").forEach(elem => {
    gsap.set(elem, { opacity: 0, y: 22 });
  });

  function triggerScrollTriggerAnimations() {
    gsap.utils.toArray(".word-reveal, .line-reveal, .reveal-text").forEach(elem => {
      if (!elem.closest('.hero')) {
        gsap.to(elem, {
          scrollTrigger: {
            trigger: elem,
            start: "top 90%",
            toggleActions: "play none none none"
          },
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
      }
    });

    const curtainWiper = document.querySelector(".curtain-wiper");
    const curtainSection = document.querySelector(".curtain-reveal-section");
    if (curtainWiper && curtainSection) {
      gsap.to(curtainWiper, {
        scrollTrigger: {
          trigger: curtainSection,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        scaleX: 0,
        duration: 1.3,
        ease: "power4.inOut"
      });
    }
  }

  const preloader = document.getElementById("smart-preloader");
  const pcBg = document.querySelector('.pc-hero-bg');
  const pcDetail = document.querySelector('.pc-hero-detail-container .progressive-img');
  let criticalImagesToWatch = [];
  if (pcBg) criticalImagesToWatch.push(pcBg);
  if (pcDetail) criticalImagesToWatch.push(pcDetail);

  let loadedCriticalCount = 0;
  const totalCriticalRequired = criticalImagesToWatch.length;

  document.querySelectorAll('.progressive-img').forEach((img) => {
    const largeSrc = img.getAttribute('data-large');
    if (largeSrc) {
      const largeImage = new Image();
      largeImage.src = largeSrc;
      largeImage.onload = () => {
        img.src = largeSrc;
        img.classList.add('loaded');
        if (criticalImagesToWatch.includes(img)) {
          loadedCriticalCount++;
          if (loadedCriticalCount >= totalCriticalRequired) {
            executePageReveal();
          }
        }
      };
    }
  });

  window.addEventListener("load", () => {
    setTimeout(executePageReveal, 100);
  });
  const fallbackTimeout = setTimeout(executePageReveal, 2500);

  let hasRevealed = false;
  function executePageReveal() {
    if (hasRevealed) return;
    hasRevealed = true;
    clearTimeout(fallbackTimeout);

    gsap.to(preloader, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      onComplete: () => {
        preloader.style.display = "none";
        document.body.classList.remove("preloader-active");
        triggerScrollTriggerAnimations();
      }
    });

    const tl = gsap.timeline();
    tl.fromTo(".pc-hero-bg-wrap",
      { clipPath: "inset(12% 15% 12% 15% round 12px)" },
      { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "power4.inOut" }
    )
    .from(".pc-hero-bg", { scale: 1.15, duration: 1.8, ease: "power3.out" }, "<")
    .to(".hero .word-reveal", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15 }, "-=0.6");
  }

  let mm = gsap.matchMedia();

  mm.add("(min-width: 760px)", () => {
    gsap.to(".pc-hero-bg", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      scale: 0.96,
      yPercent: 8,
      ease: "none"
    });

    gsap.to(".pc-hero-detail-container", {
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      },
      yPercent: -12,
      ease: "none"
    });
  });

  const cursor = document.querySelector(".cursor");
  if (cursor && window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.08, ease: "power2.out" });
    });
    document.querySelectorAll("a, button, .principle-item, .route-item").forEach(item => {
      item.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 3, duration: 0.2 }));
      item.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 1, duration: 0.2 }));
    });
  }
});
