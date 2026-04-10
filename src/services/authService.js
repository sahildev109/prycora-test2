const db      = require('../db');
const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');

async function login(email, password) {
  try {
    const user = await db.findOne({ email });
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return null;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    return { user, token };
  } catch (err) {
    throw new Error('Login failed: ' + err.message);
  }
}

async function logout(userId) {
  try {
    await db.update({ id: userId }, { sessionToken: null });
    return true;
  } catch (err) {
    throw new Error('Logout failed: ' + err.message);
  }
}

async function refreshToken(oldToken) {
  try {
    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET);
    const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET);
    return newToken;
  } catch (err) {
    throw new Error('Token refresh failed: ' + err.message);
  }
}

module.exports = { login, logout, refreshToken };