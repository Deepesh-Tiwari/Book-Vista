import Review from "../models/reviewModel.js";
import Book from "../models/bookModel.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll();
    res.render("main.ejs", { reviews });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.findByUserId(req.user.id);
    res.render("myreviews.ejs", { reviews });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

export const addReview = async (req, res) => {
  const isbn = req.params.isbn;
  const { rating, review, pros, cons, notes } = req.body;
  const user_id = req.user.id;
  try {
    console.log(isbn);
    const newReview = await Review.create(isbn, user_id, rating, review, pros, cons, notes);
    res.redirect('/reviews/');
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'An error occurred while adding the review' });
  }
};
