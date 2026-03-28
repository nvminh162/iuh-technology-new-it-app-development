const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", (req, res) => res.render('index'));
app.get("/album", (req, res) => res.render('album'));
app.get("/table", (req, res) => res.render('table'));
app.get("/form", (req, res) => res.render('form'));

app.listen(3000, () => console.log(`SERVER RUNNING ...`));
