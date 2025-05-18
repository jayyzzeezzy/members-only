const { Router } = require("express");
const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");
const db = require('../db/queries');
const usersController = require('../controllers/usersControllers');

const authRouter = Router();

// verify password
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.findUserByUsername(username);
    
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
// create user session and persist their login credentials 
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.findUserById(id);
        done(null, user);
    } catch(err) {
        done(err);
    }
});

// router middleware
authRouter.post('/log-in', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/'
}));
authRouter.get("/log-out", usersController.getLogOut);
authRouter.get("/sign-up", usersController.getSignUp);
authRouter.post("/sign-up", usersController.postSignUp);

module.exports = authRouter;