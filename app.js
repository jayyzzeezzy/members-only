// import Node modules
// dotenv
require("dotenv").config();
// path
const path = require("node:path");
// express
const express = require("express");
// session
const session = require("express-session");
// passport
const passport = require("passport");
// passport local strategy
const LocalStrategy = require('passport-local').Strategy;
// pool
const pool = require("./db/pool");
// bcryptjs
const bcrypt = require("bcryptjs");

const usersRouter = require("./routes/usersRouter");

// App-level middleware
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

// authentication
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
            const user = rows[0];
    
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
        const user = rows[0];
    
        done(null, user);
    } catch(err) {
        done(err);
    }
});

// router
app.use("/", usersRouter);
app.post(
    "/log-in",
    passport.authenticate("local", {
       successRedirect: "/",
       failureRedirect: "/"
    })
);  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));