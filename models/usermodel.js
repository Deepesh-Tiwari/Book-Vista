import { db } from "../config.js";

const User = {
  findByUsername: async (username) => {
    const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return result.rows[0];
  },
  create: async (username, password) => {
    const result = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [username, password]);
    return result.rows[0];
  },
};

export default User;
