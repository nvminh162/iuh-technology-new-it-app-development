const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use("/", require("./routes"))

app.listen(process.env.PORT || 3000, () => console.log(`Server running port: 3000: http://localhost:3000`))
