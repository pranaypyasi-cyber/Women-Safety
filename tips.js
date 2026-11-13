// ===== Tips page ka JavaScript =====

const tipsListEl = document.getElementById("tips-list");
const chipsEl = document.getElementById("chips");
const tipsCountEl = document.getElementById("tips-count");

if (tipsListEl) {
  let tips = [];                 // JSON ka data yahan aayega
  let activeCategory = "All";    // abhi kaunsa button selected hai

  // 1. JSON se tips lao
  fetch("data/tips.json")
    .then((response) => response.json())
    .then((data) => {
      tips = data;
      showTips();
    })
    .catch(() => {
      tipsCountEl.textContent = "Could not load tips. Open this page with Live Server.";
    });

  // 2. Kisi bhi button pe click hone par
  chipsEl.addEventListener("click", (event) => {
    const button = event.target.closest(".chip");
    if (!button) return;

    activeCategory = button.dataset.category;

    // sab buttons ka selected state update karo
    chipsEl.querySelectorAll(".chip").forEach((chip) => {
      const isActive = chip === button;
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-pressed", isActive);
    });

    showTips();
  });

  // 3. Selected category ke tips dikhao
  function showTips() {
    const results = tips.filter(
      (tip) => activeCategory === "All" || tip.category === activeCategory
    );

    tipsListEl.innerHTML = "";

    results.forEach((tip) => {
      const card = document.createElement("article");
      card.className = "card";

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = tip.category;

      const title = document.createElement("h3");
      title.textContent = tip.title;

      const text = document.createElement("p");
      text.textContent = tip.text;

      card.append(tag, title, text);
      tipsListEl.appendChild(card);
    });

    tipsCountEl.textContent = results.length + " tip" + (results.length === 1 ? "" : "s");
  }
}