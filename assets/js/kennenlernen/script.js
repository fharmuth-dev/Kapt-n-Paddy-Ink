const koerperstellen = [
"Kopf", "Gesamte Kopfhaut (Glatze)", "Stirn", "Schläfen links", "Schläfen rechts", 
"Oberhalb der Augenbrauen", "Augenbrauenbereich", "Zwischen den Augen (Glabella)", 
"Augenlider", "Unter den Augen", "Wangen links", "Wangen rechts", "Wangenknochen", 
"Nase (Rücken)", "Nasenseiten", "Nasenspitze", "Oberlippe", "Unterlippe", "Lippeninnenseite", 
"Kinn", "Kieferlinie links", "Kieferlinie rechts", "Unter dem Kinn", "Ohren außen", 
"Ohrläppchen", "Ohrmuschel innen", "Hinter den Ohren", "Hals", "Hals Vorderseite", 
"Hals Rückseite (Nacken)", "Hals linke Seite", "Hals rechte Seite", "Kehlkopfbereich", 
"Unter dem Kinn bis Hals", "Übergang Hals–Brust", "Übergang Hals–Schulter links", 
"Übergang Hals–Schulter rechts", "Schultern", "Linke Schulterkappe", "Rechte Schulterkappe", 
"Vorderseite Schulter links", "Vorderseite Schulter rechts", "Rückseite Schulter links", 
"Rückseite Schulter rechts", "Schlüsselbein", "Linkes Schlüsselbein", "Rechtes Schlüsselbein", 
"Zwischen den Schlüsselbeinen", "Brust", "Linke Brust", "Rechte Brust", "Brustbein", 
"Obere Brust", "Untere Brust", "Seitliche Brust links", "Seitliche Brust rechts", 
"Brustwarzenbereich links", "Brustwarzenbereich rechts", "Unter den Brustmuskeln", "Rücken", 
"Oberer Rücken", "Mittlerer Rücken", "Unterer Rücken", "Gesamter Rücken", "Linkes Schulterblatt", 
"Rechtes Schulterblatt", "Wirbelsäule", "Rücken links", "Rücken rechts", "Flanken links", 
"Flanken rechts", "Lendenbereich", "Kreuzbein", "Bauch", "Oberbauch", "Unterbauch", 
"Bauchnabel", "Bereich um den Bauchnabel", "Linke Bauchseite", "Rechte Bauchseite", 
"Rippen links", "Rippen rechts", "Achseln", "Linke Achsel", "Rechte Achsel", "Arme",
"Linker Oberarm außen", "Linker Oberarm innen", "Linker Oberarm vorne", "Linker Oberarm hinten", 
"Rechter Oberarm außen", "Rechter Oberarm innen", "Rechter Oberarm vorne", "Rechter Oberarm hinten", 
"Ellenbogen", "Linker Ellenbogen außen", "Linke Ellenbeuge", "Rechter Ellenbogen außen", 
"Rechte Ellenbeuge", "Unterarme", "Linker Unterarm außen", "Linker Unterarm innen", 
"Linker Unterarm oben", "Linker Unterarm unten", "Rechter Unterarm außen", "Rechter Unterarm innen", 
"Rechter Unterarm oben", "Rechter Unterarm unten", "Handgelenke", "Linkes Handgelenk außen", 
"Linkes Handgelenk innen", "Rechtes Handgelenk außen", "Rechtes Handgelenk innen", "Hände", 
"Handrücken links", "Handrücken rechts", "Handfläche links", "Handfläche rechts", "Daumen", 
"Zeigefinger", "Mittelfinger", "Ringfinger", "Kleiner Finger", "Fingerseiten", "Fingerkuppen",
"Fingerknöchel", "Gesäß", "Linke Gesäßhälfte", "Rechte Gesäßhälfte", "Steißbein", "Gesäßfalte", 
"Intimbereich (anatomisch möglich)", "Schambein", "Leisten links", "Leisten rechts", 
"Genitalbereich", "Perineum", "Oberschenkel", "Linker Oberschenkel vorne", "Linker Oberschenkel hinten", 
"Linker Oberschenkel innen", "Linker Oberschenkel außen", "Rechter Oberschenkel vorne", 
"Rechter Oberschenkel hinten", "Rechter Oberschenkel innen", "Rechter Oberschenkel außen", 
"Knie", "Linke Kniescheibe", "Rechtes Knie", "Linke Kniekehle", "Rechte Kniekehle", "Knie innen", 
"Knie außen", "Unterschenkel", "Linkes Schienbein", "Rechtes Schienbein", "Linke Wade", 
"Rechte Wade", "Linker Unterschenkel innen", "Linker Unterschenkel außen", "Rechter Unterschenkel innen", 
"Rechter Unterschenkel außen", "Knöchel", "Linker Innenknöchel", "Linker Außenknöchel", 
"Rechter Innenknöchel", "Rechter Außenknöchel", "Füße", "Fußrücken links", "Fußrücken rechts", 
"Fußsohle links", "Fußsohle rechts", "Fußaußenkante", "Fußinnenkante", "Ferse links", "Ferse rechts", 
"Zehen", "Zehenzwischenräume", 
"Full Sleeve (Arm komplett)", "Half Sleeve (Unterarm)", "Half Sleeve (Oberarm)", 
"Chestpiece (Brust komplett)", "Backpiece (Rücken komplett)", "Leg Sleeve (Bein komplett)"
];

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("eb-canvas");
  const container = document.getElementById("eb-container");

  if (canvas && container) {
    const ctx = canvas.getContext("2d");
    const pad = 35; 
    let cachedWidth = window.innerWidth;

    // Verbessertes Resize: Reagiert auf Breitenänderung (Drehen) & manuelle Triggers,
    // ignoriert aber Höhenänderungen (wie das Hochfahren der mobilen Tastatur).
    function resize(force = false) {
      const currentWidth = window.innerWidth;
      if (!force && currentWidth === cachedWidth && canvas.width > 0) {
        return; 
      }
      cachedWidth = currentWidth;

      const r = container.getBoundingClientRect();
      canvas.width = (r.width + pad * 2) * (window.devicePixelRatio || 1);
      canvas.height = (r.height + pad * 2) * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    }
    
    resize(true);
    window.addEventListener("resize", () => resize(false));

    function drawLightningTimeline(x1, y1, x2, y2, displace) {
      if (displace < 2.0) {
        ctx.lineTo(x2, y2);
        return;
      }
      const mid_x = (x1 + x2) / 2;
      const mid_y = (y1 + y2) / 2;
      const nx = -(y2 - y1);
      const ny = x2 - x1;
      const len = Math.sqrt(nx * nx + ny * ny);
      
      const offsetX = (nx / len) * (Math.random() - 0.5) * displace;
      const offsetY = (ny / len) * (Math.random() - 0.5) * displace;
      
      drawLightningTimeline(x1, y1, mid_x + offsetX, mid_y + offsetY, displace / 2);
      drawLightningTimeline(mid_x + offsetX, mid_y + offsetY, x2, y2, displace / 2);
    }

    // Farbe aus der CSS-Variable lesen, damit sie zentral in der CSS anpassbar bleibt
    const boltColor = (getComputedStyle(document.documentElement)
      .getPropertyValue("--electric-border-color") || "#e0a92e").trim();

    function render() {
      const r = container.getBoundingClientRect();
      const w = r.width;
      const h = r.height;

      ctx.clearRect(0, 0, w + pad * 2, h + pad * 2);
      ctx.strokeStyle = boltColor;
      ctx.lineWidth = 2.0 + Math.random() * 2.5; 
      ctx.shadowBlur = 16; 
      ctx.shadowColor = boltColor;

      const rRad = 20; 
      const corners = [
        {x: pad + rRad, y: pad},
        {x: pad + w - rRad, y: pad},
        {x: pad + w, y: pad + rRad},
        {x: pad + w, y: pad + h - rRad},
        {x: pad + w - rRad, y: pad + h},
        {x: pad + rRad, y: pad + h},
        {x: pad, y: pad + h - rRad},
        {x: pad, y: pad + rRad}
      ];

      const isMobile = window.innerWidth <= 900;
      const currentChaos = isMobile ? 24 : 45;

      ctx.beginPath();
      ctx.moveTo(corners[0].x, corners[0].y);
      for(let i = 0; i < corners.length; i++) {
        const next = corners[(i + 1) % corners.length];
        drawLightningTimeline(corners[i].x, corners[i].y, next.x, next.y, currentChaos);
      }
      ctx.closePath();
      ctx.stroke();

      setTimeout(() => { requestAnimationFrame(render); }, 1000 / 24); 
    }
    requestAnimationFrame(render);
    
    // Macht die Resize-Funktion für die Schrittwechsel global verfügbar
    window.triggerCanvasResize = () => resize(true);
  }

  // ==================================================
  // STEPS & NAVIGATION CONTROLS
  // ==================================================
  const allInputs = document.querySelectorAll(".input-field");
  let currentStep = 1;
  const nextButtons = document.querySelectorAll(".next-trigger");
  const prevButtons = document.querySelectorAll(".prev-trigger");
  const formElement = document.getElementById("main-vibe-form");

  const stepFields = {
    1: document.getElementById("field-name"),
    2: document.getElementById("field-loc"),
    3: document.getElementById("field-story"),
    4: document.getElementById("field-details")
  };

  allInputs.forEach(input => {
    input.addEventListener("focus", () => {
      allInputs.forEach(i => i.classList.remove("active-shimmer-line"));
      input.classList.add("active-shimmer-line");
    });
  });

  function goToNextStep() {
    const currentCard = document.querySelector(`.step-card[data-step="${currentStep}"]`);
    const nextCard = document.querySelector(`.step-card[data-step="${currentStep + 1}"]`);
    
    if(nextCard) {
      // Tastatur schließen, bevor die Animation startet
      if (document.activeElement) document.activeElement.blur();

      const finishSwap = () => {
        currentCard.classList.remove("active");
        currentCard.style.display = "none";
        
        nextCard.classList.add("active");
        nextCard.style.display = "block";

        const nextInput = stepFields[currentStep + 1];
        
        // Canvas an neue Kartenhöhe anpassen, sobald diese eingeblendet wird
        if (window.triggerCanvasResize) window.triggerCanvasResize();

        if(nextInput) {
          allInputs.forEach(i => i.classList.remove("active-shimmer-line"));
          nextInput.classList.add("active-shimmer-line");
          nextInput.focus();
        }
        currentStep++;
      };

      // Robustheits-Fallback: Falls GSAP nicht verfügbar ist (CDN-Ausfall, Adblocker),
      // wechselt die Karte trotzdem sofort, nur ohne Animation.
      if (typeof gsap === "undefined") {
        finishSwap();
        return;
      }

      gsap.to(currentCard, { opacity: 0, x: -15, duration: 0.18, onComplete: () => {
        finishSwap();
        gsap.fromTo(nextCard, { opacity: 0, x: 15 }, { 
          opacity: 1, 
          x: 0, 
          duration: 0.22, 
          ease: "power2.out"
        });
      }});
    }
  }

  function goToPrevStep() {
    const currentCard = document.querySelector(`.step-card[data-step="${currentStep}"]`);
    const prevCard = document.querySelector(`.step-card[data-step="${currentStep - 1}"]`);
    
    if(prevCard) {
      if (document.activeElement) document.activeElement.blur();
      
      const searchBoxEl = document.getElementById("search-results-box");
      if(searchBoxEl) searchBoxEl.style.display = "none";

      const finishSwap = () => {
        currentCard.classList.remove("active");
        currentCard.style.display = "none";
        
        prevCard.classList.add("active");
        prevCard.style.display = "block";

        const prevInput = stepFields[currentStep - 1];
        
        if (window.triggerCanvasResize) window.triggerCanvasResize();

        if(prevInput) {
          allInputs.forEach(i => i.classList.remove("active-shimmer-line"));
          prevInput.classList.add("active-shimmer-line");
          prevInput.focus();
        }
        currentStep--;
      };

      if (typeof gsap === "undefined") {
        finishSwap();
        return;
      }
      
      gsap.to(currentCard, { opacity: 0, x: 15, duration: 0.18, onComplete: () => {
        finishSwap();
        gsap.fromTo(prevCard, { opacity: 0, x: -15 }, { 
          opacity: 1, 
          x: 0, 
          duration: 0.22, 
          ease: "power2.out"
        });
      }});
    }
  }

  nextButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const currentInput = stepFields[currentStep];
      if(currentInput && currentInput.hasAttribute('required') && currentInput.value.trim() === "") {
        currentInput.focus();
        return;
      }
      goToNextStep();
    });
  });

  prevButtons.forEach(btn => { btn.addEventListener("click", () => { goToPrevStep(); }); });

  allInputs.forEach(input => {
    input.addEventListener("keydown", (e) => {
      if(e.key === "Enter" && input.tagName !== "TEXTAREA") {
        e.preventDefault();
        if(input.value.trim().length > 0) {
          const searchBoxEl = document.getElementById("search-results-box");
          if(searchBoxEl) searchBoxEl.style.display = "none";
          goToNextStep();
        }
      }
    });
  });

  // Autocomplete
  const locInput = document.getElementById("field-loc");
  const searchBox = document.getElementById("search-results-box");

  function triggerSearch() {
    const val = locInput.value.toLowerCase().trim();
    searchBox.innerHTML = "";
    if(val.length >= 1) {
      const matches = koerperstellen.filter(k => k.toLowerCase().includes(val));
      if(matches.length > 0) {
        searchBox.style.display = "block";
        matches.forEach(m => {
          const div = document.createElement("div");
          div.classList.add("search-item"); div.innerText = m;
          div.addEventListener("click", () => { 
            locInput.value = m; 
            searchBox.style.display = "none"; 
            goToNextStep(); 
          });
          searchBox.appendChild(div);
        });
      } else { searchBox.style.display = "none"; }
    } else { searchBox.style.display = "none"; }
  }

  if(locInput && searchBox) {
    locInput.addEventListener("input", triggerSearch);
    locInput.addEventListener("click", () => { if (locInput.value.trim().length > 0) triggerSearch(); });
  }

  // Option Stack Channels
  const optionButtons = document.querySelectorAll(".option-btn");
  const hiddenChannel = document.getElementById("hidden-channel-field");
  const detailsInput = document.getElementById("field-details");

  optionButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      optionButtons.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      const chosenChannel = btn.getAttribute("data-channel");
      if(hiddenChannel) hiddenChannel.value = chosenChannel;
      allInputs.forEach(i => i.classList.remove("active-shimmer-line"));
      if(detailsInput) {
        detailsInput.classList.add("active-shimmer-line");
        detailsInput.placeholder = (chosenChannel === "Instagram") ? "DEIN INSTAGRAM-NAME..." : "DEINE NUMMER...";
        detailsInput.focus();
      }
    });
  });

  if (formElement) {
    const submitBtn = document.getElementById("form-submit-btn");
    const errorMsg = document.getElementById("form-error-msg");

    formElement.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!hiddenChannel || hiddenChannel.value.trim() === "") {
        alert("Bitte wähle zuerst einen Kontaktkanal aus (Instagram, WhatsApp oder Telefon)!");
        return;
      }

      if (errorMsg) errorMsg.style.display = "none";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector(".btn-label").textContent = "WIRD GESENDET...";
      }

      const formData = new FormData(formElement);
      // Betreff personalisieren, damit die Anfrage im Postfach sofort erkennbar ist,
      // ohne die E-Mail erst öffnen zu müssen (z. B. "Neue Vibe-Check Anfrage von Ace")
      const visitorName = (formData.get("Name") || "").toString().trim();
      formData.set("subject", visitorName ? `Neue Vibe-Check Anfrage von ${visitorName}` : "Neue Vibe-Check Anfrage über die Webseite");

      fetch(formElement.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            goToNextStep(); // wechselt von Schritt 4 (aktuell) zur Erfolgs-Karte (Schritt 5)
          } else {
            throw new Error(data.message || "Unbekannter Fehler beim Versenden.");
          }
        })
        .catch(() => {
          if (errorMsg) {
            errorMsg.textContent = "Puh, das hat gerade nicht geklappt. Bitte versuch es nochmal oder schreib mir direkt an kaptnpaddy@gmx.de.";
            errorMsg.style.display = "block";
          }
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.querySelector(".btn-label").textContent = "VIBE-CHECK ABSENDEN →";
          }
        });
    });
  }

  document.addEventListener("click", (e) => {
    if(searchBox && !e.target.closest('.search-wrapper')) searchBox.style.display = "none";
  });
});
