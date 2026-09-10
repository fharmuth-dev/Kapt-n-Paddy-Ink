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

  /* ==========================================================================
     GEMEINSAME PROGRESSIVE-IMAGE-LOGIK (Ursache des Ruckelns beim Scrollen)
     ---------------------------------------------------------------------
     Vorher wurden ALLE hochauflösenden Bilder der Seite (~3,6 MB, 9 Stück,
     darunter sogar reine Desktop-Bilder wie corner-02a.jpg/paddy-01a.jpg,
     die auf dem Handy nie sichtbar sind) sofort beim Laden gleichzeitig
     angefordert und dekodiert. Genau das hat auf dem Handy den Haupt-Thread
     blockiert, während gleichzeitig gescrollt wurde — sichtbar als kurzes
     "Einfrieren", gefolgt von einem ruckartigen Sprung, sobald die Arbeit
     fertig war.
     Jetzt wird jedes Bild einzeln per IntersectionObserver beobachtet und
     lädt erst nach, kurz bevor es tatsächlich in den sichtbaren Bereich
     scrollt. Bilder, die schon im ersten Moment sichtbar sind (z. B. das
     Hero-Foto), lösen sofort aus — für sie ändert sich nichts. Bilder in
     Containern mit display:none (z. B. Desktop-Bilder auf dem Handy) haben
     keine Fläche und lösen nie aus, werden also gar nicht erst geladen.

     ZUSÄTZLICHES SICHERHEITSNETZ: IntersectionObserver-Callbacks laufen
     asynchron und können bei sehr schnellem/ruckartigem Scrollen (z. B.
     einem kräftigen Fling-Gesture) im ungünstigsten Fall ein Bild
     "überspringen". Damit nie ein Bild dauerhaft unscharf hängen bleibt,
     prüft ein leichtgewichtiger, per requestAnimationFrame gebündelter
     Scroll-Handler zusätzlich alle noch offenen Bilder direkt gegen die
     aktuelle Bildschirmposition. Die Liste wird mit jedem geladenen Bild
     kürzer, und sobald alle geladen sind, entfernt sich der Handler
     automatisch wieder — keine dauerhaften Scroll-Kosten.
     ========================================================================== */
  function initProgressiveImages(onImageLoaded) {
    const images = Array.from(document.querySelectorAll(".progressive-img"));
    const pending = new Set(images);

    const loadImage = (img) => {
      if (!pending.has(img)) return;
      const largeSrc = img.getAttribute("data-large");
      pending.delete(img);
      if (!largeSrc || img.dataset.largeRequested) return;
      img.dataset.largeRequested = "1";
      const largeImage = new Image();
      largeImage.decoding = "async";
      largeImage.src = largeSrc;
      largeImage.onload = () => {
        img.src = largeSrc;
        img.classList.add("loaded");
        if (onImageLoaded) onImageLoaded(img);
      };
    };

    // (Hinweis: decoding="async" bewusst NUR auf dem unsichtbaren Preload-Objekt
    // unten gesetzt, nicht hier auf dem sichtbaren <img> — dort würde es das
    // Neuzeichnen des bereits fertig dekodierten Bildes unnötig verzögern.)

    if (!("IntersectionObserver" in window)) {
      // Sehr alte Browser ohne IntersectionObserver-Unterstützung: wie zuvor alles direkt laden
      images.forEach(loadImage);
      return;
    }

    const SAFETY_MARGIN = 1000; // px zusätzlicher Puffer für den Scroll-Fallback

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "1000px 0px 1000px 0px" });

    images.forEach((img) => observer.observe(img));

    // Sicherheitsnetz: läuft nur, solange noch Bilder offen sind
    let ticking = false;
    function checkPendingOnScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const viewportTop = -SAFETY_MARGIN;
        const viewportBottom = window.innerHeight + SAFETY_MARGIN;
        pending.forEach((img) => {
          const rect = img.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return; // display:none (o.ä.) — nie laden
          if (rect.bottom >= viewportTop && rect.top <= viewportBottom) {
            observer.unobserve(img);
            loadImage(img);
          }
        });
        if (pending.size === 0) {
          window.removeEventListener("scroll", checkPendingOnScroll);
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", checkPendingOnScroll, { passive: true });
    checkPendingOnScroll(); // einmal direkt beim Start prüfen
  }

  /* ==========================================================================
     ROBUSTHEITS-FALLBACK: Sollte GSAP nicht laden (CDN-Ausfall, Adblocker,
     Firmen-Firewall etc.), darf die Seite trotzdem nutzbar sein: Preloader
     ausblenden, Bilder in voller Auflösung nachladen, Texte sichtbar machen.
     ========================================================================== */
  if (typeof gsap === "undefined") {
    const fallbackPreloader = document.getElementById("smart-preloader");
    const reveal = () => {
      if (fallbackPreloader) {
        fallbackPreloader.style.transition = "opacity .6s ease";
        fallbackPreloader.style.opacity = "0";
        setTimeout(() => { fallbackPreloader.style.display = "none"; }, 600);
      }
      document.body.classList.remove("preloader-active");
      document.querySelectorAll(".word-reveal, .line-reveal, .reveal-text").forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      const curtainWiper = document.querySelector(".curtain-wiper");
      if (curtainWiper) curtainWiper.style.transform = "scaleX(0)";
    };
    initProgressiveImages();
    window.addEventListener("load", () => setTimeout(reveal, 100));
    setTimeout(reveal, 2500);
    return; // Kein weiterer GSAP-Code wird ausgeführt
  }

  gsap.registerPlugin(ScrollTrigger); 

  // GLOBAL TEXT REVEAL SETUP 
  gsap.utils.toArray(".word-reveal, .line-reveal, .reveal-text").forEach(elem => { 
    gsap.set(elem, { opacity: 0, y: 22 }); 
  }); 

  // Neues mobiles Detailbild: gleiche Vor-Verstecken-Logik wie oben, damit es
  // nicht erst normal sichtbar aufblitzt und dann beim Timeline-Start auf
  // opacity:0 "springt", bevor es einblendet (würde wie ein Ruckler wirken).
  const mobileHeroDetailEl = document.querySelector(".mobile-hero-detail"); 
  if (mobileHeroDetailEl) gsap.set(mobileHeroDetailEl, { opacity: 0, y: 28 }); 

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


  /* ========================================================================== 
     INTELLIGENTES IMAGE-LOADING (GERÄTE-GETRENNT) 
     ========================================================================== */ 
  const preloader = document.getElementById("smart-preloader"); 
  const isDesktop = window.matchMedia("(min-width: 760px)").matches; 
   
  // Wir bestimmen EXAKT, welche Bilder für das aktuelle Gerät kritisch sind 
  let criticalImagesToWatch = []; 
   
  if (isDesktop) { 
    // Am PC MUSS das große Hintergrundbild und das Detailbild geladen sein 
    const pcBg = document.querySelector('.pc-hero-bg'); 
    const pcDetail = document.querySelector('.pc-hero-detail-container .progressive-img'); 
    if (pcBg) criticalImagesToWatch.push(pcBg); 
    if (pcDetail) criticalImagesToWatch.push(pcDetail); 
  } else { 
    // Auf dem Smartphone MUSS das vollflächige Hero-Bild geladen sein, 
    // bevor sich die Seite öffnet — sonst startet der Zoom-Effekt zeitversetzt 
    // und unsynchron zu den übrigen Reveal-Animationen (wirkt dann ruckelig). 
    const mobileImg = document.querySelector('.mobile-hero-ambient-bg .progressive-img'); 
    if (mobileImg) criticalImagesToWatch.push(mobileImg); 
  } 

  let loadedCriticalCount = 0; 
  const totalCriticalRequired = criticalImagesToWatch.length; 

  // Startet das hochauflösende Laden — jetzt gestaffelt statt alles auf einmal 
  initProgressiveImages((img) => { 
    // Prüfen, ob dieses geladene Bild für das aktuelle Gerät kritisch war 
    if (criticalImagesToWatch.includes(img)) { 
      loadedCriticalCount++; 
      // Erst wenn alle für dieses Gerät wichtigen Bilder da sind, öffnet sich der Vorhang! 
      if (loadedCriticalCount >= totalCriticalRequired) { 
        executePageReveal();  
      } 
    } 
  }); 

  // Sicherheits-Fallbacks, falls ein Bild komplett blockiert oder fehlt 
  window.addEventListener("load", () => { 
    setTimeout(executePageReveal, 100);  
  }); 
  const fallbackTimeout = setTimeout(executePageReveal, 2500); // Maximal 2.5 Sek. warten 

  let hasRevealed = false; 
  function executePageReveal() { 
    if (hasRevealed) return; 
    hasRevealed = true; 
    clearTimeout(fallbackTimeout); 

    // Vorhang-Effekt für den Preloader 
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

    // START DER HERO ANIMATIONEN DIREKT IM ANSCHLUSS 
    let activeMedia = gsap.matchMedia(); 
     
    // PC HERO ENTRANCE 
    activeMedia.add("(min-width: 760px)", () => { 
      const tl = gsap.timeline(); 
      tl.fromTo(".pc-hero-bg-wrap",  
        { clipPath: "inset(12% 15% 12% 15% round 12px)" }, 
        { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.6, ease: "power4.inOut" } 
      ) 
      .to(".hero .word-reveal", { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.15 }, "-=0.6"); 
    }); 

    // HANDY HERO ENTRANCE 
    // (Kein Zoom/Scale-Effekt mehr auf dem Foto — das Bild steht sofort in
    // finaler Größe da. Grund: die vorherige 1,8s-Zoom-Einblendung lief oft
    // noch, während Nutzer bereits zu scrollen begannen, was wie eine vom
    // Scrollen ausgelöste Größenänderung wirkte, obwohl es reine Ladezeit-
    // Koinzidenz war. Text-Stagger und Detailbild-Einblendung bleiben.) 
    activeMedia.add("(max-width: 759px)", () => { 
      const tl = gsap.timeline(); 
      tl.to(".hero .word-reveal", { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12 }) 
      .to(".mobile-hero-detail", { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.35"); 
    }); 
  } 


  /* ========================================================================== 
     GSAP MATCHMEDIA PARALLAX & PINNING CONTROLLER (STRIKT GETRENNT) 
     ========================================================================== */ 
  let mm = gsap.matchMedia(); 

  // HANDY ONLY RUNTIME (Klares Scrolling ohne Pinning-Zwang)
  mm.add("(max-width: 759px)", () => { 
    gsap.utils.toArray('.principle-item').forEach((item) => { 
      gsap.fromTo(item,  
        {  
          opacity: 0,  
          y: 40  
        }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out", 
          scrollTrigger: { 
            trigger: item, 
            start: "top 88%", 
            toggleActions: "play none none none" 
          } 
        } 
      ); 
    }); 
  }); 

  // PC ONLY RUNTIME 
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

  // INTERACTIVE MOUSE CURSOR 
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
