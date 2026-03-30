const express = require("express");
const multer = require("multer");
const { controller } = require("./controller");

const app = express();

app.use(express.urlencoded({ extended: true }));
const upload = multer({ storage: multer.memoryStorage() });

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/", controller.renderAll);
app.get("/form", controller.renderForm);
app.post("/items", upload.single("image"), controller.add);
app.post("/items/delete/:id", controller.deleteById);

app.listen(3000, () => console.log(`SERVER RUNNING ...`));
