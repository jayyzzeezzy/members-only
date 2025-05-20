require("dotenv").config();
const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { json } = require("express");
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const alphaNumErr = "must only contain letters and/or numbers.";
const passwordErr = "must be between 5 and 20 characters.";

// validate user inputs
const validateUser = [
    body("firstName").trim().notEmpty()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim().notEmpty()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body("username").trim().notEmpty()
        .isAlphanumeric().withMessage(`username ${alphaNumErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`username ${lengthErr}`)
        // prevent duplicate username
        .custom(async value => {
            const user = await db.findUserByUsername(value);
            if (user) {
                throw new Error("Username already in use");
            }
        }),
        // -------------------------
    body("password").trim().notEmpty()
        .isLength({ min: 5, max: 20 }).withMessage(`password ${passwordErr}`),
    body("confirmPassword").trim().notEmpty()
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
];

const validateMembership = [
    body("secretCode")
        .custom((value, { req }) => value === req.user.last_name)
        .withMessage("Incorrect code. *Hint: it it part of your name*"),
];

exports.postSignUp = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up-form", {
                errors: errors.array(),
            });
        }
        const { firstName, lastName, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insertNewUser(firstName, lastName, username, hashedPassword);
        res.redirect("/");
    }
];

exports.getIndex = (req, res) => {
    // console.log(req.session);
    res.render("index", { user: req.user });
};

exports.getSignUp = (req, res) => {
    res.render("sign-up-form")
};

exports.getLogOut = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
};

exports.getMembership = (req, res) => {
    res.render("membership");
}

exports.postMembership = [
    validateMembership,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("membership", {
                errors: errors.array(),
            });
        }
        const { id } = req.user;
        await db.makeMember(id);
        res.redirect("/");
    }
];

exports.getHome = (req, res) => {
    res.render("home", { user: req.user });
}

exports.getNewPost = (req, res) => {
    res.render("newPost");
}

exports.postNewPost = async (req, res) => {
    const { id } = req.user;
    const { postTitle, newMessage } = req.body;
    await db.postNewMessage(id, postTitle, newMessage);
    res.redirect("/home");
}