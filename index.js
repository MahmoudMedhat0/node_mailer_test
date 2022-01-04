const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoute");
const jwt = require("jsonwebtoken");
require("dotenv").config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);

app.get("*", function (req, res) {
  res.status(404).json({
    msg: "Api path not found.",
  });
});

app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
