import { db, collection, getDocs, query, orderBy } from './firebase-config.js';

const STORAGE_KEY = "autoGlassCatalog";
const productsGrid = document.getElementById("productsGrid");

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
    console.error("Не удалось загрузить товары", error);
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

function renderProducts() {
  if (!products.length) {
    productsGrid.innerHTML = '<div class="empty-state">Поки що немає товарів. Додайте перший товар через адмінку.</div>';
    return;
  }

  productsGrid.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      ${
        product.image
          ? `<img class="product-photo" src="${product.image}" alt="${product.title}" />`
          : `<div class="product-image"><span>Фото</span></div>`
      }
      <div class="product-content">
        <h3>${product.title}</h3>
        <p><strong>Авто:</strong> ${product.car}</p>
        <p><strong>Розмір:</strong> ${product.size}</p>
        <p><strong>Гарантія:</strong> ${product.warranty}</p>
        <div class="price-block">
          <span class="price">${currency(product.price)}</span>
          <span class="installation">Монтаж: ${currency(product.installationPrice)}</span>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

fetchProductsFromFirestore().then(() => renderProducts());
