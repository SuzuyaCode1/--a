// Import Firebase functions
import { sendConsultationRequest, sendCallRequest } from './firebase-functions.js';

const callButton = document.getElementById("callButton");
const callModal = document.getElementById("callModal");
const closeModal = document.getElementById("closeModal");
const cancelButton = document.getElementById("cancelButton");
const callForm = document.getElementById("callForm");
const callMessage = document.getElementById("callMessage");
const languageButtons = document.querySelectorAll(".lang-btn");

// Get all contact forms
const contactForms = document.querySelectorAll(".contact-form");

const translations = {
  uk: {
    catalog: "Каталог",
    admin: "Адмінка",
    autoglass: "Автоскло",
    headline: "АВТОСКЛО",
    intro: "Базова головна сторінка, звідси можна перейти до каталогу або адмінки.",
    orderCall: "Замовити дзвінок",
    viewCatalog: "Переглянути каталог",
    bannerTitle: "Доставимо автомобільне скло в будь-яку точку України на будь-які види авто",
    aboutHeading: "Про нас",
    aboutText: "Протягом 20 років здійснюємо продаж і заміну якісного автомобільного скла преміум класу світових лідерів.",
    fillForm: "Заповніть форму",
    contactIntro: "і наш менеджер підбере для Вас підходяще автоскло.",
    topbarRetailLabel: "Менеджер по роздрібній торгівлі",
    topbarWholesaleLabel: "Менеджер по оптовій торгівлі",
    chooseHeading: "Чому нас вибирають",
    feature1Text: "20 років здійснюємо продаж і заміну автоскла",
    feature2Text: "Співпрацюємо безпосередньо з виробниками",
    feature3Text: "Вся продукція з логотипами компаній і сертифікована в Україні і світі",
    feature4Text: "Роздрібна та оптова торгівля",
    feature5Text: "Безкоштовна консультація по вибору автоскла",
    feature6Text: "Продаж і установка автоскла з ПДВ",
    feature7Text: "Скло преміум класу світових лідерів",
    partnersHeading: "Наші партнери",
    contactsHeading: "Контакти",
    contactsAddress: "Волинська обл., с. Воля-Ковельська, вул. Центральна 1",
    contactRetailLabel: "Менеджер по роздрібній торгівлі:",
    contactWholesaleLabel: "Менеджер по оптовій торгівлі:",
    contactEmailLabel: "E-mail:",
    scheduleLabel: "Графік роботи:",
    scheduleWeekdays: "Пн-пт: 09:00 - 18:00",
    scheduleWeekend: "Субота, неділя: вихідний",
    consultTitle: "Отримати консультацію",
    yourName: "Ваше ім'я",
    yourPhone: "Ваш номер телефону",
    yourCar: "Марка і модель авто",
    namePlaceholder: "Ім'я",
    phonePlaceholder: "+380 67 000 00 00",
    carPlaceholder: "Наприклад: Toyota Range Rover",
    stepsHeading: "Як ми працюємо",
    step1Title: "Заявка",
    step1Description: "Ви залишаєте заявку на сайті або телефонуєте нам: +38(067)-407-98-94",
    step2Title: "Дзвінок",
    step2Description: "Наш менеджер зв'язується з Вами для уточнення деталей",
    step3Title: "Часткова оплата",
    step3Description: "Оплата % від суми замовлення, щоб ми розуміли що Ви заберете товар.",
    step4Title: "Доставка",
    step4Description: "Товар доставляється транспортною компанією найближчим для Вас відділенням \"Нової пошти\".",
    step5Title: "Оплата",
    step5Description: "Оплата здійснюється при отриманні.",
    phoneNumber: "Номер телефону",
    modalDescription: "Введіть номер телефону, щоб менеджер міг зателефонувати вам.",
    send: "Відправити",
    cancel: "Відмінити"
  },
  en: {
    catalog: "Catalog",
    admin: "Admin",
    autoglass: "Auto Glass",
    headline: "AUTO GLASS",
    intro: "Basic homepage — from here you can go to the catalog or admin area.",
    orderCall: "Order a call",
    viewCatalog: "View catalog",
    bannerTitle: "We deliver auto glass anywhere in Ukraine for all vehicle types",
    aboutHeading: "About us",
    aboutText: "For 20 years we have been selling and replacing premium auto glass from world-class brands.",
    fillForm: "Fill out the form",
    contactIntro: "and our manager will select the right auto glass for you.",
    topbarRetailLabel: "Retail sales manager",
    topbarWholesaleLabel: "Wholesale sales manager",
    chooseHeading: "Why choose us",
    feature1Text: "20 years of selling and replacing auto glass",
    feature2Text: "We work directly with manufacturers",
    feature3Text: "All products carry company logos and are certified in Ukraine and abroad",
    feature4Text: "Retail and wholesale trade",
    feature5Text: "Free consultation on choosing auto glass",
    feature6Text: "Sale and installation of auto glass with VAT",
    feature7Text: "Premium class glass from world leaders",
    partnersHeading: "Our partners",
    contactsHeading: "Contacts",
    contactsAddress: "Volyn region, Volia-Kovelska village, Centralna St. 1",
    contactRetailLabel: "Retail sales manager:",
    contactWholesaleLabel: "Wholesale sales manager:",
    contactEmailLabel: "E-mail:",
    scheduleLabel: "Working hours:",
    scheduleWeekdays: "Mon-Fri: 09:00 - 18:00",
    scheduleWeekend: "Saturday, Sunday: closed",
    consultTitle: "Get a consultation",
    yourName: "Your name",
    yourPhone: "Your phone number",
    yourCar: "Make and model of the car",
    namePlaceholder: "Name",
    phonePlaceholder: "+380 67 000 00 00",
    carPlaceholder: "For example: Toyota Range Rover",
    stepsHeading: "How we work",
    step1Title: "Request",
    step1Description: "You leave a request on the site or call us: +38(067)-407-98-94",
    step2Title: "Call",
    step2Description: "Our manager contacts you to clarify the details",
    step3Title: "Partial payment",
    step3Description: "A percentage of the order amount is paid so we know you will take the goods.",
    step4Title: "Delivery",
    step4Description: "The goods are delivered by a transport company to the nearest Nova Poshta branch for you.",
    step5Title: "Payment",
    step5Description: "Payment is made upon receipt.",
    phoneNumber: "Phone number",
    modalDescription: "Enter your phone number so a manager can call you.",
    send: "Send",
    cancel: "Cancel"
  },
  pl: {
    catalog: "Katalog",
    admin: "Admin",
    autoglass: "Szyba Samochodowa",
    headline: "AUTO SZYBA",
    intro: "Podstawowa strona główna — stąd możesz przejść do katalogu lub panelu admina.",
    orderCall: "Zamów rozmowę",
    viewCatalog: "Zobacz katalog",
    bannerTitle: "Dostarczamy szyby samochodowe w dowolne miejsce na Ukrainie dla wszystkich rodzajów pojazdów",
    aboutHeading: "O nas",
    aboutText: "Od 20 lat sprzedajemy i wymieniamy wysokiej jakości szyby samochodowe premium od światowych liderów.",
    fillForm: "Wypełnij formularz",
    contactIntro: "a nasz menedżer dobierze odpowiednie szyby samochodowe.",
    topbarRetailLabel: "Menedżer ds. sprzedaży detalicznej",
    topbarWholesaleLabel: "Menedżer ds. sprzedaży hurtowej",
    chooseHeading: "Dlaczego warto nas wybrać",
    feature1Text: "Od 20 lat sprzedajemy i wymieniamy szyby samochodowe",
    feature2Text: "Współpracujemy bezpośrednio z producentami",
    feature3Text: "Wszystkie produkty z logo firm i certyfikowane na Ukrainie i na świecie",
    feature4Text: "Sprzedaż detaliczna i hurtowa",
    feature5Text: "Darmowa konsultacja przy wyborze szyb samochodowych",
    feature6Text: "Sprzedaż i montaż szyb samochodowych z VAT",
    feature7Text: "Szyby premium od światowych liderów",
    partnersHeading: "Nasi partnerzy",
    contactsHeading: "Kontakt",
    contactsAddress: "Obwód wołyński, wieś Volia-Kovelska, ul. Centralna 1",
    contactRetailLabel: "Menedżer ds. sprzedaży detalicznej:",
    contactWholesaleLabel: "Menedżer ds. sprzedaży hurtowej:",
    contactEmailLabel: "E-mail:",
    scheduleLabel: "Godziny pracy:",
    scheduleWeekdays: "Pn-Pt: 09:00 - 18:00",
    scheduleWeekend: "Sobota, niedziela: zamknięte",
    consultTitle: "Uzyskaj konsultację",
    yourName: "Twoje imię",
    yourPhone: "Twój numer telefonu",
    yourCar: "Marka i model auta",
    namePlaceholder: "Imię",
    phonePlaceholder: "+380 67 000 00 00",
    carPlaceholder: "Na przykład: Toyota Range Rover",
    stepsHeading: "Jak pracujemy",
    step1Title: "Zgłoszenie",
    step1Description: "Zostawiasz zgłoszenie na stronie lub dzwonisz do nas: +38(067)-407-98-94",
    step2Title: "Telefon",
    step2Description: "Nasz menedżer kontaktuje się z Tobą w celu doprecyzowania szczegółów",
    step3Title: "Częściowa płatność",
    step3Description: "Opłacana jest część zamówienia, abyśmy wiedzieli, że odbierzesz towar.",
    step4Title: "Dostawa",
    step4Description: "Towar dostarczany jest przez firmę transportową do najbliższego dla Ciebie oddziału Nowej Poczty.",
    step5Title: "Płatność",
    step5Description: "Płatność dokonywana jest przy odbiorze.",
    phoneNumber: "Numer telefonu",
    modalDescription: "Wpisz numer telefonu, aby menedżer mógł do Ciebie zadzwonić.",
    send: "Wyślij",
    cancel: "Anuluj"
  }
};

function openModal() {
  callModal.classList.remove("hidden");
  callMessage.textContent = "";
}

function closeModalWindow() {
  callModal.classList.add("hidden");
  callForm.reset();
  callMessage.textContent = "";
}

function setActiveLanguage(lang) {
  languageButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === lang);
  });
}

function getCurrentLanguage() {
  const activeButton = document.querySelector(".lang-btn.active");
  return activeButton?.dataset.lang || "uk";
}

function handleLanguageChange(lang = getCurrentLanguage()) {
  setActiveLanguage(lang);
  const dataElements = document.querySelectorAll("[data-key], [data-placeholder]");
  dataElements.forEach((element) => {
    const key = element.getAttribute("data-key");
    if (key && translations[lang] && translations[lang][key]) {
      element.textContent = translations[lang][key];
    }
    const placeholderKey = element.getAttribute("data-placeholder");
    if (placeholderKey && translations[lang] && translations[lang][placeholderKey]) {
      element.setAttribute("placeholder", translations[lang][placeholderKey]);
    }
  });
}

const requestButton = document.getElementById("requestButton");

if (callButton) {
  callButton.addEventListener("click", openModal);
}

if (requestButton) {
  requestButton.addEventListener("click", openModal);
}

if (closeModal) {
  closeModal.addEventListener("click", closeModalWindow);
}

if (cancelButton) {
  cancelButton.addEventListener("click", closeModalWindow);
}

if (callForm) {
  callForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(callForm);
    const phone = data.get("phone")?.toString().trim();
    if (!phone) {
      callMessage.textContent = "Будь ласка, введіть номер телефону";
      return;
    }
    
    callMessage.textContent = "Відправляємо...";
    
    const result = await sendCallRequest({ phone });
    
    if (result.success) {
      callMessage.textContent = "Дякуємо! Ми зв'яжемося з вами найближчим часом.";
      callForm.reset();
      setTimeout(closeModalWindow, 1800);
    } else {
      callMessage.textContent = "Виникла помилка. Спробуйте ще раз.";
      console.error(result.error);
    }
  });
}

// Handle all contact forms
if (contactForms.length) {
  contactForms.forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      
      const formData = new FormData(form);
      const name = formData.get("name")?.toString().trim();
      const phone = formData.get("phone")?.toString().trim();
      const car = formData.get("car")?.toString().trim();
      
      // Validate
      if (!name || !phone || !car) {
        alert("Будь ласка, заповніть всі поля");
        return;
      }
      
      // Get submit button
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = "Відправляємо...";
      
      const result = await sendConsultationRequest({ name, phone, car });
      
      if (result.success) {
        submitButton.textContent = "✓ Відправлено!";
        form.reset();
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }, 2000);
      } else {
        alert("Виникла помилка. Спробуйте ще раз.");
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        console.error(result.error);
      }
    });
  });
}

if (languageButtons.length) {
  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleLanguageChange(button.dataset.lang);
    });
  });
  handleLanguageChange();
}
