/**
 * Menu mobile, animação de entrada na rolagem, contador numérico e voltar ao topo.
 */
export function initUiEffects() {
  const toggleBtn = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("main-nav");
  const backToTopBtn = document.getElementById("back-to-top");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", String(!isOpen));
      navMenu.classList.toggle("open", !isOpen);
    });
    navMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        toggleBtn.setAttribute("aria-expanded", "false");
        navMenu.classList.remove("open");
      })
    );
  }

  const animateCounter = (el) => {
    const target = Number(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    let current = Math.max(1, target - 10);
    const timer = setInterval(() => {
      current += 1;
      el.textContent = current >= target ? `${target}${suffix}` : `${current}${suffix}`;
      if (current >= target) clearInterval(timer);
    }, 35);
  };

  const targets = [...document.querySelectorAll(".reveal, .stat-number[data-target]")];
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          if (entry.target.classList.contains("reveal")) {
            entry.target.classList.add("is-visible");
          } else {
            animateCounter(entry.target);
          }
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll(".stat-number[data-target]").forEach(animateCounter);
  }

  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      backToTopBtn.classList.toggle("visible", window.scrollY > 360);
    });
    backToTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
}