const express = require("express");
const multer = require("multer");
const { getAll, getId } = require("./controller");

const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", getAll);
app.get("/form", getId);
app.get("/form/:id", getId);

app.listen(3000, () => console.log(`SERVER RUNNING ...`));
