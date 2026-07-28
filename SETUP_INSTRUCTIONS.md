# 🚀 Firebase + Telegram Integration Setup

Этот гайд поможет вам настроить автоматическую отправку заявок со своего сайта в Telegram бота через Firebase.

## ✅ Данные которые уже есть:

```
Telegram Chat ID: 5268549164
Telegram Bot Token: 8564455162:AAHWV9sIlaDFJZwTcUR3EUp03j99rXxLhBg
Firebase Project ID: avto-c8011
Firebase Web API Key: AIzaSyA3J8tDWIDtba3hq31yZFyR9hEqNcvbkDk
```

---

## 📝 Шаг 1: Настроить Firestore Security Rules

1. Откройте **Firebase Console**: https://console.firebase.google.com
2. Выберите проект `avto-c8011`
3. В левом меню: **Firestore Database** → вкладка **Rules**
4. Замените текущие правила на код из файла `FIREBASE_RULES.txt`
5. Нажмите **Publish**

✅ Это позволит анонимным пользователям отправлять форму без авторизации.

---

## 🤖 Шаг 2: Создать Cloud Function для отправки в Telegram

### 2.1 Откройте Cloud Functions

1. Firebase Console → Left menu → **Functions** (внизу, под Firestore)
2. Если это первый раз - нажмите **Get started** и следуйте инструкции
3. Проверьте что включен **Blaze plan** (платный) - это обязательно для functions

### 2.2 Создать новую функцию

1. Нажмите **Create function**
2. Заполните:
   - **Environment**: Node.js 20
   - **Function name**: `sendTelegramNotifications`
   - **Trigger type**: Cloud Firestore
   - **Event type**: On create
   - **Database**: (your-database)
   - **Document path**: `consultation_requests/{docId}`
   - **Authentication**: None (or Cloud Firestore)

3. Нажмите **Create and deploy**

### 2.3 Добавить код функции

1. В редакторе откройте вкладку **index.js**
2. Замените весь код на содержимое файла `firebase-cloud-function.js`
3. Также проверьте вкладку **package.json** - там должны быть:
   ```json
   {
     "firebase-functions": "^4.0.0",
     "firebase-admin": "^11.0.0"
   }
   ```
4. Нажмите **Deploy**

### 2.4 Проверить что функция работает

1. После развертывания, откройте Firestore Database
2. Создайте новую коллекцию `consultation_requests` с тестовым документом:
   ```json
   {
     "name": "Тест",
     "phone": "+380671234567",
     "car": "Toyota Corolla",
     "timestamp": now,
     "type": "consultation",
     "read": false
   }
   ```
3. Если всë правильно - вы должны получить сообщение в Telegram! ✅

---

## 💻 Шаг 3: Настроить фронтенд

Все уже готово! На вашем сайте:

- Файл `firebase-config.js` - конфигурация Firebase
- Файл `firebase-functions.js` - функции для отправки данных
- Файл `index.js` - уже обновлен для использования Firebase

### Что произойдет:

1. **Форма "Замовити дзвінок"** → отправит номер телефона в Firebase → Cloud Function отправит в Telegram
2. **Формы "Отримати консультацію"** (на странице) → отправит имя, телефон, авто → Firebase → Telegram

### Тестировать:

1. Откройте ваш сайт в браузере
2. Нажмите "Замовити дзвінок"
3. Введите номер телефона и отправьте
4. Проверьте Telegram - должна прийти заявка ✅

---

## 🔧 Важные файлы проекта

- 📄 **firebase-config.js** - Firebase конфигурация (НЕ изменяйте!)
- 📄 **firebase-functions.js** - Функции отправки
- 📄 **index.js** - Обновленный (с Firebase интеграцией)
- 📄 **firebase-cloud-function.js** - Cloud Function код (используйте в Firebase Console)
- 📄 **FIREBASE_RULES.txt** - Firestore Security Rules

---

## ⚠️ Проблемы и решения

### Проблема: "403 Unauthorized" в Telegram
**Решение**: Проверьте токен бота - скопируйте правильно из `firebase-cloud-function.js`:
```
8564455162:AAHWV9sIlaDFJZwTcUR3EUp03j99rXxLhBg
```

### Проблема: Данные не приходят в Telegram
**Решение**:
1. Проверьте что функция развернута (Firebase Console → Functions)
2. Откройте **Logs** и посмотрите есть ли ошибки
3. Проверьте что Firestore имеет правильные Rules
4. Убедитесь что Chat ID правильный: `5268549164`

### Проблема: Функция не запускается
**Решение**: Убедитесь что используется **Blaze plan** (платный), так как функции требуют исходящих HTTP запросов.

---

## 📞 Структура данных в Firestore

После отправки формы в Firestore создается документ:

```
consultation_requests/
├── document_id
├── name: "Иван"
├── phone: "+380671234567"
├── car: "Toyota Corolla"
├── timestamp: 2026-07-28 10:30:45
├── type: "consultation"
└── read: false

call_requests/
├── document_id
├── phone: "+380671234567"
├── timestamp: 2026-07-28 10:30:45
├── type: "call"
└── read: false
```

Это позже можно использовать для админ-панели чтения заявок!

---

## 🎉 Готово!

Теперь при каждой отправке формы вы будете получать уведомление в Telegram с данными клиента.

Если есть вопросы - используйте браузерный Developer Tools (F12) → Console, там вы видите все логи.
