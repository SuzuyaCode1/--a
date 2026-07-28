/**
 * Firebase Cloud Function for sending Telegram notifications
 * 
 * HOW TO DEPLOY:
 * 1. Open Firebase Console: https://console.firebase.google.com
 * 2. Go to: Functions → Create function
 * 3. Set trigger: Cloud Firestore → Document create → collection: "consultation_requests"
 * 4. Copy all code from this file into the editor
 * 5. Deploy
 * 
 * The function will automatically send messages to Telegram when a new form is submitted.
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

const TELEGRAM_BOT_TOKEN = "8564455162:AAHWV9sIlaDFJZwTcUR3EUp03j99rXxLhBg";
const TELEGRAM_CHAT_ID = "5268549164";
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// ============= CONSULTATION REQUESTS =============
exports.sendConsultationTelegram = functions.firestore
  .document("consultation_requests/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const message = `
📋 <b>НОВА ЗАЯВКА НА КОНСУЛЬТАЦІЮ</b>

👤 <b>Ім'я:</b> ${escapeHtml(data.name)}
📱 <b>Телефон:</b> ${escapeHtml(data.phone)}
🚗 <b>Авто:</b> ${escapeHtml(data.car)}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}

`;
    
    try {
      await sendTelegramMessage(message);
      console.log("Consultation request sent to Telegram");
    } catch (error) {
      console.error("Error sending to Telegram:", error);
    }
  });

// ============= CALL REQUESTS =============
exports.sendCallTelegram = functions.firestore
  .document("call_requests/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const message = `
📞 <b>НОВА ЗАЯВКА НА ДЗВІНОК</b>

📱 <b>Телефон:</b> ${escapeHtml(data.phone)}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}

`;
    
    try {
      await sendTelegramMessage(message);
      console.log("Call request sent to Telegram");
    } catch (error) {
      console.error("Error sending to Telegram:", error);
    }
  });

// ============= PRODUCT ORDERS =============
exports.sendOrderTelegram = functions.firestore
  .document("product_orders/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    
    const message = `
📦 <b>НОВИЙ ЗАМОВЛЕННЯ</b>

🏷️ <b>Продукт:</b> ${escapeHtml(data.title || "N/A")}
🚗 <b>Авто:</b> ${escapeHtml(data.car || "N/A")}
💰 <b>Ціна:</b> ${data.price || "N/A"}
⏰ <b>Час:</b> ${new Date().toLocaleString('uk-UA')}

`;
    
    try {
      await sendTelegramMessage(message);
      console.log("Order sent to Telegram");
    } catch (error) {
      console.error("Error sending to Telegram:", error);
    }
  });

// ============= HELPER FUNCTIONS =============

async function sendTelegramMessage(text) {
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: text,
    parse_mode: "HTML"
  };
  
  const response = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.statusText}`);
  }
  
  return response.json();
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
