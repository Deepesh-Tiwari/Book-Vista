import axios from "axios";
import Book from "../models/bookModel.js";

export const addBook = async (req, res) => {
  const { isbn } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await axios.get(
      "https://www.googleapis.com/books/v1/volumes",
      {
        params: { q: `isbn:${isbn}`, key: apiKey },
      }
    );

    if (response.data.totalItems > 0) {
      const bookData = response.data.items[0].volumeInfo;
      const bookDetails = {
        title: bookData.title,
        authors: bookData.authors ? bookData.authors.join(", ") : "N/A",
        publishDate: bookData.publishedDate,
        category: bookData.categories ? bookData.categories[0] : "N/A",
        coverImage: null,
      };

      if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
        const imageUrl = bookData.imageLinks.thumbnail;
        const imageResponse = await axios.get(imageUrl, {
          responseType: "arraybuffer",
        });
        bookDetails.coverImage = await Buffer.from(
          imageResponse.data,
          "binary"
        ).toString("base64");
      }

      const newBook = await Book.create(isbn, bookDetails);
      res.render("addreview1.ejs", { book: newBook });
    } else {
      res.status(404).json({ message: "No book found with the given ISBN." });
    }
  } catch (error) {
    console.error("Error fetching book details:", error);
    res.status(500).send("Error fetching book details");
  }
};

export const getaddBook = (req, res) => {
  res.render("addreview.ejs");
};
