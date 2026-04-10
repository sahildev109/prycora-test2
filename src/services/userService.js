const db = require('../db');

async function getUser(id) {
  try {
    const user = await db.findOne({ id });
    if (!user) return null;
    return user;
  } catch (err) {
    throw new Error('Failed to fetch user: ' + err.message);
  }
}

async function createUser(data) {
  try {
    const user = await db.create(data);
    return user;
  } catch (err) {
    throw new Error('Failed to create user: ' + err.message);
  }
}

async function updateUser(id, data) {
  try {
    const updated = await db.update({ id }, data);
    return updated;
  } catch (err) {
    throw new Error('Failed to update user: ' + err.message);
  }
}

async function deleteUser(id) {
  try {
    await db.delete({ id });
    return true;
  } catch (err) {
    throw new Error('Failed to delete user: ' + err.message);
  }
}

async function listUsers(filter) {
  try {
    const users = await db.find(filter);
    return users;
  } catch (err) {
    throw new Error('Failed to list users: ' + err.message);
  }
}

module.exports = { getUser, createUser, updateUser, deleteUser, listUsers };