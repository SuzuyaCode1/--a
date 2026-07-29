import { db, collection, getDocs, query, orderBy, addDoc, serverTimestamp } from './firebase-config.js';

const STORAGE_KEY = "autoGlassCatalog";
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const form = document.getElementById("productForm");
const formMessage = document.getElementById("formMessage");
const adminList = document.getElementById("adminList");
const callRequestsList = document.getElementById("callRequestsList");
const consultationRequestsList = document.getElementById("consultationRequestsList");
const syncCatalogButton = document.getElementById("syncCatalogButton");
const syncMessage = document.getElementById("syncMessage");

const ADMIN_CREDENTIALS = {
  username: "1",
  password: "1"
};

const defaultProducts = [
  {
    id: 1,
    title: "Лобове скло",
    car: "Toyota Camry",
    size: "1800x760",
    warranty: "12 місяців",
    price: 4800,
    installationPrice: 1600,
    image: ""
  },
  {
    id: 2,
    title: "Бокове скло",
    car: "Volkswagen Golf",
    size: "900x450",
    warranty: "6 місяців",
    price: 2600,
    installationPrice: 900,
    image: ""
  }
];

let products = loadProducts();

// Try to load products from Firestore (public read). If any found, use them.
async function fetchProductsFromFirestore() {
  try {
    const q = query(collection(db, "products"));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const remote = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        remote.push({
          id: doc.id,
          title: data.title || "",
          car: data.car || "",
          size: data.size || "",
          warranty: data.warranty || "",
          price: data.price || 0,
          installationPrice: data.installationPrice || 0,
          image: data.image || ""
        });
      });
      products = remote;
      saveProducts();
    }
  } catch (error) {
    console.warn("Could not fetch products from Firestore:", error);
  }
}

function loadProducts() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultProducts;
  } catch (error) {
    console.error("Не вдалося завантажити товари", error);
    return defaultProducts;
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function currency(value) {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0
  }).format(value);
}

function renderAdminList() {
  if (!products.length) {
    adminList.innerHTML = '<div class="empty-state">Поки що немає товарів.</div>';
    return;
  }

  adminList.innerHTML = "";

  products.forEach((product) => {
    const item = document.createElement("div");
    item.className = "admin-item";
    item.innerHTML = `
      <strong>${product.title}</strong>
      <p><strong>Авто:</strong> ${product.car}</p>
      <p><strong>Розмір:</strong> ${product.size}</p>
      <p><strong>Гарантія:</strong> ${product.warranty}</p>
      <p><strong>Ціна:</strong> ${currency(product.price)}</p>
      <p><strong>Монтаж:</strong> ${currency(product.installationPrice)}</p>
      <button class="btn" type="button" data-delete-id="${product.id}">Удалить</button>
    `;

    adminList.appendChild(item);
  });

  document.querySelectorAll("[data-delete-id]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = Number(event.currentTarget.getAttribute("data-delete-id"));
      products = products.filter((item) => item.id !== id);
      saveProducts();
      renderAdminList();
      formMessage.textContent = "Товар видалено";
    });
  });
}

async function loadCallRequests() {
  if (!callRequestsList) return;

  callRequestsList.innerHTML = '<div class="empty-state">Завантаження заявок...</div>';

  try {
    const q = query(collection(db, "call_requests"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      callRequestsList.innerHTML = '<div class="empty-state">Поки що немає заявок на дзвінок.</div>';
      return;
    }

    callRequestsList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <strong>Номер:</strong> ${data.phone || "-"}<br />
        <strong>Статус:</strong> ${data.status || "новий"}<br />
        <strong>Час:</strong> ${data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString('uk-UA') : "-"}
      `;
      callRequestsList.appendChild(item);
    });
  } catch (error) {
    console.error("Error loading call requests:", error);
    callRequestsList.innerHTML = '<div class="empty-state">Не вдалося завантажити заявки.</div>';
  }
}

async function loadConsultationRequests() {
  if (!consultationRequestsList) return;

  consultationRequestsList.innerHTML = '<div class="empty-state">Завантаження заявок...</div>';

  try {
    const q = query(collection(db, "consultation_requests"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      consultationRequestsList.innerHTML = '<div class="empty-state">Поки що немає заявок на консультацію.</div>';
      return;
    }

    consultationRequestsList.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <strong>Ім'я:</strong> ${data.name || "-"}<br />
        <strong>Номер:</strong> ${data.phone || "-"}<br />
        <strong>Авто:</strong> ${data.car || "-"}<br />
        <strong>Час:</strong> ${data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString('uk-UA') : "-"}
      `;
      consultationRequestsList.appendChild(item);
    });
  } catch (error) {
    console.error("Error loading consultation requests:", error);
    consultationRequestsList.innerHTML = '<div class="empty-state">Не вдалося завантажити заявки.</div>';
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);

  const newProduct = {
    id: Date.now(),
    title: data.get("title")?.toString().trim(),
    car: data.get("car")?.toString().trim(),
    size: data.get("size")?.toString().trim(),
    warranty: data.get("warranty")?.toString().trim(),
    price: Number(data.get("price") || 0),
    installationPrice: Number(data.get("installationPrice") || 0),
    image: data.get("image")?.toString().trim()
  };

  if (!newProduct.title || !newProduct.car || !newProduct.size || !newProduct.warranty) {
    formMessage.textContent = "Заповніть основні поля";
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.disabled = true;
  submitButton.textContent = "Додаємо...";

  // Try to publish directly to Firestore first
  try {
    const docRef = await addDoc(collection(db, "products"), {
      title: newProduct.title,
      car: newProduct.car,
      size: newProduct.size,
      warranty: newProduct.warranty,
      price: newProduct.price,
      installationPrice: newProduct.installationPrice,
      image: newProduct.image,
      timestamp: serverTimestamp()
    });

    // Use remote ID and add to local list for immediate UI
    newProduct.id = docRef.id;
    products.unshift(newProduct);
    saveProducts();
    renderAdminList();
    form.reset();
    formMessage.textContent = "Товар додано і опубліковано в каталозі";
  } catch (error) {
    // If publishing fails (likely permission), fallback to local storage
    console.error("Failed to publish product to Firestore:", error);
    products.unshift(newProduct);
    saveProducts();
    renderAdminList();
    form.reset();
    formMessage.textContent = "Товар додано локально. Не вдалося опублікувати у Firestore: перевірте правила або автентифікацію";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
});

// Publish local products to Firestore (skips simple duplicates)
async function publishProductsToFirestore() {
  if (!products.length) {
    syncMessage.textContent = "Немає товарів для синхронізації";
    return;
  }

  syncMessage.textContent = "Синхронізація...";

  try {
    // Fetch existing remote products to avoid simple duplicates
    const q = query(collection(db, "products"));
    const snapshot = await getDocs(q);
    const existing = new Set();
    snapshot.forEach((d) => {
      const data = d.data();
      existing.add((data.title || "") + '||' + (data.car || '') + '||' + (data.size || ''));
    });

    let added = 0;
    for (const p of products) {
      const key = (p.title || '') + '||' + (p.car || '') + '||' + (p.size || '');
      if (existing.has(key)) continue;
      await addDoc(collection(db, "products"), {
        title: p.title,
        car: p.car,
        size: p.size,
        warranty: p.warranty,
        price: p.price,
        installationPrice: p.installationPrice,
        image: p.image,
        timestamp: serverTimestamp()
      });
      added++;
    }

    syncMessage.textContent = `Синхронізація завершена. Додано: ${added}`;
  } catch (error) {
    console.error("Publish to Firestore failed:", error);
    syncMessage.textContent = "Не вдалося синхронізувати. Перевірте правила безпеки Firestore.";
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const username = data.get("username")?.toString().trim();
  const password = data.get("password")?.toString().trim();

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    loginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    renderAdminList();
    await fetchProductsFromFirestore();
    await loadCallRequests();
    await loadConsultationRequests();
    loginMessage.textContent = "";
    return;
  }


if (syncCatalogButton) {
  syncCatalogButton.addEventListener('click', async () => {
    await publishProductsToFirestore();
  });
}
  loginMessage.textContent = "Невірний логін або пароль";
});

renderAdminList();
