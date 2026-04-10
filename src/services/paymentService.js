const db     = require('../db');
const stripe = require('stripe')(process.env.STRIPE_KEY);

async function createPayment(userId, amount, currency) {
  try {
    const intent = await stripe.paymentIntents.create({ amount, currency });
    await db.create({ userId, intentId: intent.id, amount, status: 'pending' });
    return intent;
  } catch (err) {
    throw new Error('Payment creation failed: ' + err.message);
  }
}

async function confirmPayment(intentId) {
  try {
    const intent = await stripe.paymentIntents.confirm(intentId);
    await db.update({ intentId }, { status: intent.status });
    return intent;
  } catch (err) {
    throw new Error('Payment confirmation failed: ' + err.message);
  }
}

async function refundPayment(intentId) {
  try {
    const refund = await stripe.refunds.create({ payment_intent: intentId });
    await db.update({ intentId }, { status: 'refunded' });
    return refund;
  } catch (err) {
    throw new Error('Refund failed: ' + err.message);
  }
}

module.exports = { createPayment, confirmPayment, refundPayment };