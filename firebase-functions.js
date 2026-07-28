// Firebase Functions for Form Submissions
import { db, collection, addDoc, serverTimestamp } from './firebase-config.js';

/**
 * Send consultation request to Firebase
 * @param {Object} data - { name, phone, car }
 */
export async function sendConsultationRequest(data) {
  try {
    const docRef = await addDoc(collection(db, "consultation_requests"), {
      name: data.name,
      phone: data.phone,
      car: data.car,
      timestamp: serverTimestamp(),
      type: "consultation",
      read: false
    });
    
    console.log("Consultation request sent with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error sending consultation request:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send call request to Firebase
 * @param {Object} data - { phone }
 */
export async function sendCallRequest(data) {
  try {
    const docRef = await addDoc(collection(db, "call_requests"), {
      phone: data.phone,
      timestamp: serverTimestamp(),
      type: "call",
      read: false
    });
    
    console.log("Call request sent with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error sending call request:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Send product order to Firebase (for admin panel)
 * @param {Object} data - product data
 */
export async function sendProductOrder(data) {
  try {
    const docRef = await addDoc(collection(db, "product_orders"), {
      ...data,
      timestamp: serverTimestamp(),
      status: "pending"
    });
    
    console.log("Product order sent with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error sending product order:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Format data for cleaner display
 */
export function formatSubmissionData(data) {
  const date = new Date().toLocaleString('uk-UA');
  let text = `📋 Нова заявка\n\n`;
  
  if (data.name) text += `👤 Ім'я: ${data.name}\n`;
  if (data.phone) text += `📱 Телефон: ${data.phone}\n`;
  if (data.car) text += `🚗 Авто: ${data.car}\n`;
  
  text += `⏰ Час: ${date}`;
  
  return text;
}
