const STORAGE_KEY = "autoGlassCatalog";
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");
const form = document.getElementById("productForm");
const formMessage = document.getElementById("formMessage");
const adminList = document.getElementById("adminList");

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

form.addEventListener("submit", (event) => {
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

  products.unshift(newProduct);
  saveProducts();
  renderAdminList();
  form.reset();
  formMessage.textContent = "Товар додано до каталогу";
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(loginForm);
  const username = data.get("username")?.toString().trim();
  const password = data.get("password")?.toString().trim();

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    loginSection.classList.add("hidden");
    adminSection.classList.remove("hidden");
    renderAdminList();
    loginMessage.textContent = "";
    return;
  }

  loginMessage.textContent = "Невірний логін або пароль";
});

renderAdminList();
