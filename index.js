// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";
// import env from "dotenv";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import passport from "passport";
// import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
// import cookieParser from "cookie-parser";
// import axios from "axios";
// import { Strategy as LocalStrategy } from "passport-local";
// import { Strategy as GoogleStrategy } from "passport-google-oauth2";


// env.config();
// const app = express();
// const port = process.env.PORT || 3000;

// // Middle Wares
// app.use(express.static("public"));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(passport.initialize());
// app.use(cookieParser());

// const authenticateJWT = (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     jwt.verify(token, process.env.SECRET_JWT_STRING, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };



// // Constants
// const saltrounds = 10;

// //Database config
// const db = new pg.Client({
//   user: process.env.PG_USER,
//   host: process.env.PG_HOST,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD,
//   port: process.env.PG_PORT,
// });
// db.connect();



// app.get("/", (req, res) => {
//   // res.render("myreview.ejs");
//   // res.render("addreview.ejs");
//   res.render("main.ejs");
// });


// // -------------------  ADD REVIEW ROUTE -----------------------------

// // ISBN

// app.post("/addReview", authenticateJWT, async (req, res) => {
//   const isbn = req.body.isbn;
//   console.log(isbn);
//   const apiKey = "AIzaSyByCzoCIk83J8b7jEkR6CXgJYLj2z-XcME";

//   try {
//     const response = await axios.get(
//       "https://www.googleapis.com/books/v1/volumes",
//       {
//         params: {
//           q: `isbn:${isbn}`,
//           key: apiKey,
//         },
//       }
//     );
//     let countTotalItems = response.data.totalItems
//     if (countTotalItems > 0) {
//       const bookData = response.data.items[0].volumeInfo;

//       const bookDetails = {
//         title: bookData.title,
//         authors: bookData.authors ? bookData.authors.join(", ") : "N/A",
//         publishDate: bookData.publishedDate,
//         category: bookData.categories ? bookData.categories[0] : "N/A",
//         coverImage: null,
//       };

//       if (bookData.imageLinks && bookData.imageLinks.thumbnail) {
//         const imageUrl = bookData.imageLinks.thumbnail;
//         const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//         bookDetails.coverImage = await Buffer.from(imageResponse.data, 'binary').toString('base64');
//       }

//       // SQL query to insert book details and cover image into the database
//       const insertQuery = `
//             INSERT INTO books (isbn, title, authors, publish_date, cover_image, category)
//             VALUES ($1, $2, $3, $4, $5, $6)
//             RETURNING *;
//         `;
//       const values = [
//         isbn,
//         bookDetails.title,
//         bookDetails.authors,
//         bookDetails.publishDate,
//         bookDetails.coverImage,
//         bookDetails.category, // Include category in the values
//       ];

//       const result = await db.query(insertQuery, values);

//       res.render("addreview1.ejs", { book: result.rows[0] });
//     } else {
//       res.status(404).json({ message: "No book found with the given ISBN." });
//     }
//   } catch (error) {
//     console.error("Error fetching book details:", error);
//   }
//   res.render("addreview1.ejs");
// });




// // -------------------  ADD REVIEW 1 ROUTE -----------------------------

// app.get("/addReview", authenticateJWT, (req,res) => {
//   res.render("addreview.ejs");
// })

// app.post("/addReview/:isbn", authenticateJWT,async (req,res) => {
//   const isbn = req.params.isbn;
//   const data = req.body;
//   const { rating, review, pros, cons, notes } = req.body;
//   const user_id = req.user.id;
//   try {
//     const query = `
//       INSERT INTO reviews (isbn, user_id, rating, review, pros, cons, notes)
//       VALUES ($1, $2, $3, $4, $5, $6, $7)
//       RETURNING *;
//     `;
//     const values = [isbn, user_id, rating, review, pros, cons, notes];

//     const result = await db.query(query, values);

//     res.redirect('/allReviews');
//   } catch (error) {
//     console.error('Error adding review:', error);
//     res.status(500).json({ error: 'An error occurred while adding the review' });
//   }
// })




// // -------------------  FETCH ALL REVIEWS ROUTE -----------------------------

// app.get('/allReviews', authenticateJWT, async (req, res) => {
//   console.log(req.user);
//   try {
//     const query = `
//       SELECT 
//         books.isbn, books.title, books.authors, books.publish_date, books.cover_image, books.category,
//         reviews.id, reviews.user_id, reviews.rating, reviews.review, reviews.pros, reviews.cons, reviews.notes, reviews.created_at
//       FROM 
//         reviews
//       JOIN 
//         books 
//       ON 
//         reviews.isbn = books.isbn
//     `;
    
//     const reviews = await db.query(query);
//     res.render("main.ejs", { reviews: reviews.rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // -------------------  FETCH MY REVIEWS  ONLY ROUTE -----------------------------

// app.get('/myReviews', authenticateJWT, async (req, res) => {
//   console.log(req.user);
//   try {
//     const query = `
//       SELECT 
//         books.isbn, books.title, books.authors, books.publish_date, books.cover_image, books.category,
//         reviews.id, reviews.user_id, reviews.rating, reviews.review, reviews.pros, reviews.cons, reviews.notes, reviews.created_at
//       FROM 
//         reviews
//       JOIN 
//         books 
//       ON 
//         reviews.isbn = books.isbn
//       JOIN 
//         users
//       ON reviews.user_id = users.id
//       WHERE user_id = $1
//     `;
    
//     const reviews = await db.query(query,[req.user.id]);
//     res.render("myreviews.ejs", { reviews: reviews.rows });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // ------------------------FAQ AND ABOUT ---------------------------

// app.get("/faq",(req,res) => {
//   res.render("faq.ejs");
// });

// app.get("/about",(req,res) => {
//   res.render("about.ejs");
// });


// // -------------------      LOGIN ROUTES       -----------------------------


// const generateToken = (user) => {
//   return jwt.sign(user, process.env.SECRET_JWT_STRING, { expiresIn: '25d' });
// };


// app.get("/", (req, res) => {
//   res.render("home.ejs");
// });

// app.get("/login", (req, res) => {
//   res.render("login.ejs");
// });

// app.get("/register", (req, res) => {
//   res.render("register.ejs");
// });

// app.get("/logout", (req, res) => {
//   res.clearCookie("token");
//   res.redirect("/");
// });

// app.get("/secrets" , authenticateJWT, (req, res) => {
//   res.redirect("/allReviews");
// });

// app.get(
//   "/auth/google",
//   passport.authenticate("google", {
//     scope: ["profile", "email"],
//   })
// );

// app.get('/auth/google/secrets', (req, res, next) => {
//   passport.authenticate('google', (err, data, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!data) {
//       return res.redirect('/login');
//     }
//     const { user, token } = data;
//     res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//     return res.redirect('/secrets');
//   })(req, res, next);
// });

// app.post('/login', (req, res, next) => {
//   passport.authenticate('local', (err, data, info) => {
//     if (err) {
//       return next(err);
//     }
//     if (!data) {
//       return res.status(401).json({ message: info.message });
//     }
//     const { user, token } = data;
//     res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//     return res.redirect('/secrets');
//   })(req, res, next);
// });

// app.post("/register", async (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;

//   try {
//     const checkResult = await db.query("SELECT * FROM users WHERE username = $1", [username]);

//     if (checkResult.rows.length > 0) {
//       res.redirect("/login");
//     } else {
//       bcrypt.hash(password, saltRounds, async (err, hash) => {
//         if (err) {
//           console.error("Error hashing password:", err);
//         } else {
//           const result = await db.query(
//             "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
//             [username, hash]
//           );
//           const user = result.rows[0];
//           const token = generateToken({ username: user.username });
//           res.cookie("token", token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             sameSite: "Strict",
//           });
//           res.redirect("/secrets");
//         }
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// });

// passport.use(
//   "local",
//   new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
//     try {
//       const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
//       if (result.rows.length > 0) {
//         const user = result.rows[0];
//         const storedHashedPassword = user.password;
//         const isValid = await bcrypt.compare(password, storedHashedPassword);
//         if (isValid) {
//           const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_JWT_STRING, { expiresIn: '1h' });
//           return done(null, { user, token });
//         } else {
//           return done(null, false, { message: 'Incorrect password' });
//         }
//       } else {
//         return done(null, false, { message: 'User not found' });
//       }
//     } catch (err) {
//       return done(err);
//     }
//   })
// );


// passport.use(
//   new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   }, async (accessToken, refreshToken, profile, done) => {
//     try {
//       const result = await db.query("SELECT * FROM users WHERE username = $1", [profile.email]);
//       let user;
//       if (result.rows.length === 0) {
//         const newUser = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [profile.email, 'google']);
//         user = newUser.rows[0];
//       } else {
//         user = result.rows[0];
//       }
//       const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_JWT_STRING, { expiresIn: '1h' });
//       return done(null, { user, token });
//     } catch (err) {
//       return done(err);
//     }
//   })
// );




// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { db } from "./config.js";
import jwt from "jsonwebtoken";

import authRoutes from "./routes/authRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import general from "./routes/generalRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SECRET_JWT_STRING, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Set up routes
app.use("/auth", authRoutes);
app.use("/reviews", authenticateJWT, reviewRoutes);
app.use("/books", authenticateJWT, bookRoutes);
app.use("/general",authenticateJWT, general);

// Default route
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

