const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const dataBase = require("./config/dataBase.js");
const authRouter = require("./routes/auth.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/", authRouter);

const PORT = 5000;

dataBase();
app.listen(PORT, () => {
  console.log("SERVER İS RUNNİNG", PORT);
});
