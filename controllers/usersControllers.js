const db = require("../db/queries");
const bcrypt = require("bcryptjs");

async function getIndex(req, res) {
    res.render("index", { title: "Homepage", user: req.user });
};

async function postSignUp(req, res, next) {
    try {
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // await pool.query("insert into users (username, password) values ($1, $2)", [req.body.username, hashedPassword]);
        const { firstName, lastName, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insertNewUser(firstName, lastName, username, hashedPassword);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        next(error);
    }
};

async function getSignUp(req, res) {
    res.render("sign-up-form")
};

async function getLogOut(req, res, next) {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

module.exports = {
    getIndex,
    postSignUp,
    getSignUp,
    getLogOut,
};