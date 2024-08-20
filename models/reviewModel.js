import { db } from "../config.js";

const Review = {
  findAll: async () => {
    const result = await db.query(`
      SELECT 
        books.isbn, books.title, books.authors, books.publish_date, books.cover_image, books.category,
        reviews.id, reviews.user_id, reviews.rating, reviews.review, reviews.pros, reviews.cons, reviews.notes, reviews.created_at
      FROM 
        reviews
      LEFT JOIN 
        books 
      ON 
        reviews.isbn = books.isbn
    `);
    return result.rows;
  },
  findByUserId: async (userId) => {
    const result = await db.query(`
      SELECT 
        books.isbn, books.title, books.authors, books.publish_date, books.cover_image, books.category,
        reviews.id, reviews.user_id, reviews.rating, reviews.review, reviews.pros, reviews.cons, reviews.notes, reviews.created_at
      FROM 
        reviews
      JOIN 
        books 
      ON 
        reviews.isbn = books.isbn
      JOIN 
        users
      ON reviews.user_id = users.id
      WHERE user_id = $1
    `, [userId]);
    return result.rows;
  },
  create: async (isbn, userId, rating, review, pros, cons, notes) => {
    const result = await db.query(`
      INSERT INTO reviews (isbn, user_id, rating, review, pros, cons, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `, [isbn, userId, rating, review, pros, cons, notes]);
    return result.rows[0];
  },
};

export default Review;
