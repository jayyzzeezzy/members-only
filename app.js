// import Node modules/dependencies
require("dotenv").config();
const path = require("node:path");
const express = require("express");
const session = require("express-session");
// store session in a database / session persistence 
const pgSession = require('connect-pg-simple')(session);
const pgPool = require("./db/pool");
const passport = require("passport");

// import routers
const usersRouter = require("./routes/usersRouter");
const authRouter = require("./routes/authRouter");

const app = express();

// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ 
    store: new pgSession({
        pool: pgPool,
        tableNmae: 'sessions'
    }),
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// set up routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use("/", usersRouter);
app.use('/', authRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));