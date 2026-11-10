const header = document.querySelector("[data-header]");
const backToTop = document.querySelector("[data-back-to-top]");

const updateScrollUI = () => {
  const hasScrolled = window.scrollY > 70;
  header?.classList.toggle("is-scrolled", hasScrolled);
  backToTop?.classList.toggle("is-visible", window.scrollY > 650);
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });

backToTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
  const slides = [...carousel.querySelectorAll("[data-slide]")];
  const dots = [...carousel.querySelectorAll("[data-dot]")];
  const previousButton = carousel.querySelector("[data-previous]");
  const nextButton = carousel.querySelector("[data-next]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let currentSlide = 0;
  let autoplay;
  let touchStartX = 0;

  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentSlide;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
  };

  const stopAutoplay = () => window.clearInterval(autoplay);
  const startAutoplay = () => {
    if (reduceMotion) return;
    stopAutoplay();
    autoplay = window.setInterval(() => showSlide(currentSlide + 1), 6500);
  };

  const changeSlide = (offset) => {
    showSlide(currentSlide + offset);
    startAutoplay();
  };

  previousButton?.addEventListener("click", () => changeSlide(-1));
  nextButton?.addEventListener("click", () => changeSlide(1));

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoplay();
    });
  });

  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
  carousel.addEventListener("focusin", stopAutoplay);
  carousel.addEventListener("focusout", startAutoplay);

  carousel.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      const distance = event.changedTouches[0].clientX - touchStartX;
      if (Math.abs(distance) > 45) changeSlide(distance > 0 ? -1 : 1);
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay();
    else startAutoplay();
  });

  startAutoplay();
}
