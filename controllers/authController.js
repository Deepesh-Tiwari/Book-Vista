import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config.js";
import User from "../models/usermodel.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";


passport.use(
  "local",
  new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, async (username, password, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [username]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const storedHashedPassword = user.password;
        const isValid = await bcrypt.compare(password, storedHashedPassword);
        if (isValid) {
          const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_JWT_STRING, { expiresIn: '1h' });
          return done(null, { user, token });
        } else {
          return done(null, false, { message: 'Incorrect password' });
        }
      } else {
        return done(null, false, { message: 'User not found' });
      }
    } catch (err) {
      return done(err);
    }
  })
);


passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const result = await db.query("SELECT * FROM users WHERE username = $1", [profile.email]);
      let user;
      if (result.rows.length === 0) {
        const newUser = await db.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *", [profile.email, 'google']);
        user = newUser.rows[0];
      } else {
        user = result.rows[0];
      }
      const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_JWT_STRING, { expiresIn: '1h' });
      return done(null, { user, token });
    } catch (err) {
      return done(err);
    }
  })
);

const saltRounds = 10;

const generateToken = (user) => {
  return jwt.sign(user, process.env.SECRET_JWT_STRING, { expiresIn: '25d' });
};

export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.redirect("/auth/login");
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create(username, hashedPassword);
    const token = generateToken({ username: newUser.username });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.redirect("/reviews/");
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
};

export const login = (req, res, next) => {
  passport.authenticate('local', (err, data, info) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      return res.status(401).json({ message: info.message });
    }
    const { user, token } = data;
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.redirect('/reviews');
  })(req, res, next);
};

export const googleAuth = (req, res, next) => {
  passport.authenticate('google', (err, data, info) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      return res.redirect('auth/login');
    }
    const { user, token } = data;
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    return res.redirect('/reviews');
  })(req, res, next);
};

export const getlogin = (req,res) => {
    res.render("login.ejs");
}

export const getregister = (req,res) => {
   res.render("register.ejs");
}

export const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};
