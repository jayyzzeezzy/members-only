const pool = require("./pool");

async function insertNewUser(firstName, lastName, username, password) {
    await pool.query(
        "INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4)", 
        [firstName, lastName, username, password]
    );
}

async function findUserByUsername(username) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return rows[0];
}

async function findUserById(id) {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [id]
    );
    return rows[0];
}

async function makeMember(id) {
    await pool.query(
        "UPDATE users SET membership = true WHERE id = $1",
        [id]
    );
}

async function makeAdmin(id) {
    await pool.query(
        "UPDATE users SET isAdmin = true WHERE id = $1",
        [id]
    );
}

async function postNewMessage(id, postTitle, newMessage) {
    await pool.query(
        "INSERT INTO posts (author_id, title, message) VALUES ($1, $2, $3)", 
        [id, postTitle, newMessage]
    );
}

async function getAllMessages() {
    const { rows } = await pool.query("SELECT * FROM posts ORDER BY time DESC");
    return rows;
}

module.exports = {
    insertNewUser,
    findUserByUsername,
    findUserById,
    makeMember,
    postNewMessage,
    getAllMessages,
    makeAdmin,
}