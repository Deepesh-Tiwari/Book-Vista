import { db } from "../config.js";

const Book = {
  create: async (isbn, bookDetails) => {
    const { title, authors, publishDate, coverImage, category } = bookDetails;
    const result = await db.query(`
      INSERT INTO books (isbn, title, authors, publish_date, cover_image, category)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [isbn, title, authors, publishDate, coverImage, category]);
    return result.rows[0];
  },
};

export default Book;
