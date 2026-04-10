const db   = require('../db');
const mail = require('../mail');

// VIOLATION 1: uses .then() chains instead of async/await
function sendWelcomeEmail(userId) {
  return db.findOne({ id: userId })
    .then(user => {
      return mail.send({
        to:      user.email,
        subject: 'Welcome to PryCora',
        body:    'Thanks for signing up!'
      });
    })
    .then(result => {
      return result;
    })
    .catch(err => {
      console.error('Email failed:', err);
      return null;
    });
}

// VIOLATION 2: no try/catch, returns null on failure
async function sendPaymentReceipt(userId, amount) {
  const user = await db.findOne({ id: userId });
  if (!user) return null;
  const sent = await mail.send({
    to:      user.email,
    subject: 'Payment received',
    body:    `We received $${amount}`
  });
  return sent;
}

// VIOLATION 3: snake_case naming in a camelCase codebase
async function send_push_notification(user_id, message) {
  try {
    const user = await db.findOne({ id: user_id });
    await mail.push({ userId: user.id, message });
    return true;
  } catch (err) {
    throw new Error('Push failed: ' + err.message);
  }
}

module.exports = { sendWelcomeEmail, sendPaymentReceipt, send_push_notification };