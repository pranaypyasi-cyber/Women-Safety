// ===== Contacts page ka JavaScript (localStorage ke saath) =====

const formEl = document.getElementById("contact-form");
const nameEl = document.getElementById("name");
const phoneEl = document.getElementById("phone");
const relationEl = document.getElementById("relation");
const messageEl = document.getElementById("form-message");
const listEl = document.getElementById("contact-list");
const emptyEl = document.getElementById("contacts-empty");
const countEl = document.getElementById("contact-count");

const STORAGE_KEY = "suraksha_contacts";   // browser mein is naam se save hoga
const MAX_CONTACTS = 5;

if (formEl) {
  let contacts = loadContacts();
  showContacts();

  // ----- Form submit hone par -----
  formEl.addEventListener("submit", (event) => {
    event.preventDefault();   // page reload mat karo

    const name = nameEl.value.trim();
    const relation = relationEl.value.trim();
    const phone = cleanPhone(phoneEl.value);

    // Checks
    if (name === "") {
      return showError("Please enter a name.");
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return showError("Enter a valid 10-digit mobile number.");
    }
    if (contacts.length >= MAX_CONTACTS) {
      return showError("You can save up to " + MAX_CONTACTS + " contacts. Delete one to add a new one.");
    }
    if (contacts.some((c) => c.phone === phone)) {
      return showError("This number is already saved.");
    }

    // Sab theek hai, contact add karo
    contacts.push({ id: Date.now(), name: name, phone: phone, relation: relation });

    if (!saveContacts()) {
      contacts.pop();
      return showError("Could not save. Your browser may be blocking storage.");
    }

    formEl.reset();
    showError("");
    nameEl.focus();
    showContacts();
  });

  // ----- Delete button pe click (event delegation) -----
  listEl.addEventListener("click", (event) => {
    const button = event.target.closest(".delete-btn");
    if (!button) return;

    const id = Number(button.dataset.id);
    contacts = contacts.filter((c) => c.id !== id);
    saveContacts();
    showContacts();
  });

  // ----- Contacts ko screen pe dikhao -----
  function showContacts() {
    listEl.innerHTML = "";

    contacts.forEach((contact) => {
      const item = document.createElement("li");
      item.className = "contact-item";

      const info = document.createElement("div");
      info.className = "contact-info";

      const name = document.createElement("strong");
      name.textContent = contact.name;

      const detail = document.createElement("span");
      detail.textContent = contact.relation
        ? contact.relation + " · " + contact.phone
        : contact.phone;

      info.append(name, detail);

      const actions = document.createElement("div");
      actions.className = "contact-actions";

      const call = document.createElement("a");
      call.className = "call-link";
      call.href = "tel:+91" + contact.phone;
      call.textContent = "Call";
      call.setAttribute("aria-label", "Call " + contact.name);

      const del = document.createElement("button");
      del.type = "button";
      del.className = "delete-btn";
      del.dataset.id = contact.id;
      del.textContent = "Delete";
      del.setAttribute("aria-label", "Delete " + contact.name);

      actions.append(call, del);
      item.append(info, actions);
      listEl.appendChild(item);
    });

    countEl.textContent = "(" + contacts.length + " of " + MAX_CONTACTS + ")";
    emptyEl.hidden = contacts.length > 0;
  }

  // ----- Chhote helper functions -----
  function showError(text) {
    messageEl.textContent = text;
  }

  // "+91 98765-43210" ko "9876543210" bana deta hai
  function cleanPhone(value) {
    let digits = value.replace(/\D/g, "");          // sirf numbers rakho
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
    return digits;
  }

  function loadContacts() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  function saveContacts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
      return true;
    } catch (error) {
      return false;
    }
  }
}