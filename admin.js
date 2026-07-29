import { db, collection, getDocs, query, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from './firebase-config.js';

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
const callMessage = document.getElementById("callMessage");
const consultationMessage = document.getElementById("consultationMessage");

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
    button.addEventListener("click", async (event) => {
      const id = event.currentTarget.getAttribute("data-delete-id");
      
      // Try to delete from Firestore first (if ID looks like Firestore doc ID)
      try {
        if (typeof id === 'string' && id.length > 10) {
          await deleteDoc(doc(db, "products", id));
        }
      } catch (error) {
        console.log("Product not in Firestore or already deleted:", error);
      }

      // Remove from local list
      products = products.filter((item) => String(item.id) !== String(id));
      saveProducts();
      renderAdminList();
      formMessage.textContent = "Товар видалено";
    });
  });
}

async function loadCallRequests() {
  if (!callRequestsList) return;

  const previousScrollTop = callRequestsList.scrollTop;
  callRequestsList.innerHTML = '<div class="empty-state">Завантаження заявок...</div>';

  try {
    const q = query(collection(db, "call_requests"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      callRequestsList.innerHTML = '<div class="empty-state">Поки що немає заявок на дзвінок.</div>';
      return;
    }

    callRequestsList.innerHTML = "";
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <strong>Номер:</strong> ${data.phone || "-"}<br />
        <strong>Статус:</strong> ${data.status || "новий"}<br />
        <strong>Час:</strong> ${data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString('uk-UA') : "-"}<br />
        <button class="btn" type="button" data-accept-call="${docSnapshot.id}" style="margin-top:8px;">Прийняти</button>
      `;
      callRequestsList.appendChild(item);
    });

    callRequestsList.scrollTop = previousScrollTop;

    document.querySelectorAll("[data-accept-call]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const docId = event.currentTarget.getAttribute("data-accept-call");
        try {
          await deleteDoc(doc(db, "call_requests", docId));
          callMessage.textContent = "Заявка прийнята і видалена";
          await loadCallRequests();
          setTimeout(() => { callMessage.textContent = ""; }, 3000);
        } catch (error) {
          console.error("Error deleting call request:", error);
          callMessage.textContent = "Не вдалося видалити заявку";
        }
      });
    });
  } catch (error) {
    console.error("Error loading call requests:", error);
    callRequestsList.innerHTML = '<div class="empty-state">Не вдалося завантажити заявки.</div>';
  }
}

async function loadConsultationRequests() {
  if (!consultationRequestsList) return;

  const previousScrollTop = consultationRequestsList.scrollTop;
  consultationRequestsList.innerHTML = '<div class="empty-state">Завантаження заявок...</div>';

  try {
    const q = query(collection(db, "consultation_requests"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      consultationRequestsList.innerHTML = '<div class="empty-state">Поки що немає заявок на консультацію.</div>';
      return;
    }

    consultationRequestsList.innerHTML = "";
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const item = document.createElement("div");
      item.className = "admin-item";
      item.innerHTML = `
        <strong>Ім'я:</strong> ${data.name || "-"}<br />
        <strong>Номер:</strong> ${data.phone || "-"}<br />
        <strong>Авто:</strong> ${data.car || "-"}<br />
        <strong>Час:</strong> ${data.timestamp?.toDate ? data.timestamp.toDate().toLocaleString('uk-UA') : "-"}<br />
        <button class="btn" type="button" data-accept-consultation="${docSnapshot.id}" style="margin-top:8px;">Прийняти</button>
      `;
      consultationRequestsList.appendChild(item);
    });

    consultationRequestsList.scrollTop = previousScrollTop;

    document.querySelectorAll("[data-accept-consultation]").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const docId = event.currentTarget.getAttribute("data-accept-consultation");
        try {
          await deleteDoc(doc(db, "consultation_requests", docId));
          consultationMessage.textContent = "Заявка прийнята і видалена";
          await loadConsultationRequests();
          setTimeout(() => { consultationMessage.textContent = ""; }, 3000);
        } catch (error) {
          console.error("Error deleting consultation request:", error);
          consultationMessage.textContent = "Не вдалося видалити заявку";
        }
      });
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

    // Auto-refresh lists every 3 seconds
    setInterval(async () => {
      await loadCallRequests();
      await loadConsultationRequests();
    }, 3000);

    return;
  }

  loginMessage.textContent = "Невірний логін або пароль";
});

renderAdminList();
