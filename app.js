// import Node modules
// dotenv
require("dotenv").config();
// path
const path = require("node:path");
// express
const express = require("express");

// App-level middleware
const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// router
app.get("/", (req, res) => {
    res.render("index", { title: "Homepage" });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));