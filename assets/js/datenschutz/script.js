document.addEventListener('DOMContentLoaded', () => {
  // Preloader aufräumen
  const preloader = document.getElementById('smart-preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.remove('preloader-active');
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => { preloader.remove(); }, 500);
    }, 300);
  }

  // Runder GSAP Custom-Cursor (Funktioniert auf Desktop, schaltet sich bei Touch stumm)
  const cursor = document.querySelector('.cursor');
  
  if (cursor && window.innerWidth > 768 && typeof gsap !== "undefined") {
    // Initialisierungs-Position offscreen setzen
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
  }
});
