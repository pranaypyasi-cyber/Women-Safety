// ===== Helplines page ka JavaScript =====

// HTML ke elements pakad lo
const listEl = document.getElementById("helpline-list");
const searchEl = document.getElementById("search");
const categoryEl = document.getElementById("category");
const countEl = document.getElementById("result-count");
const emptyEl = document.getElementById("empty-message");

// Agar ye page helplines wala nahi hai, toh kuch mat karo
if (listEl) {
  let helplines = [];   // JSON ka data yahan aayega

  // 1. JSON file se data lao
  fetch("data/helplines.json")
    .then((response) => response.json())
    .then((data) => {
      helplines = data;
      showHelplines();
    })
    .catch(() => {
      countEl.textContent = "Could not load helplines. Open this page with Live Server.";
    });

  // 2. Search ya category badalte hi list update karo
  searchEl.addEventListener("input", showHelplines);
  categoryEl.addEventListener("change", showHelplines);

  // 3. Filter karke cards dikhao
  function showHelplines() {
    const text = searchEl.value.trim().toLowerCase();
    const category = categoryEl.value;

    const results = helplines.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;

      // naam, number, description aur category mein dhoondo
      const searchable = (
        item.name + " " + item.number + " " + item.description + " " + item.category
      ).toLowerCase();
      const matchesText = searchable.includes(text);

      return matchesCategory && matchesText;
    });

    // purane cards hatao
    listEl.innerHTML = "";

    // naye cards banao
    results.forEach((item) => {
      const card = document.createElement("article");
      card.className = "card";

      const title = document.createElement("h3");
      title.textContent = item.name;

      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = item.category;

      const desc = document.createElement("p");
      desc.textContent = item.description;

      const link = document.createElement("a");
      link.className = "call-link";
      link.href = "tel:" + item.number;
      link.textContent = "Call " + item.number;

      card.append(tag, title, desc, link);
      listEl.appendChild(card);
    });

    countEl.textContent = results.length + " helpline" + (results.length === 1 ? "" : "s") + " found";
    emptyEl.hidden = results.length > 0;
  }
}