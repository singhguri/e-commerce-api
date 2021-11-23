const mongoose = require("mongoose");
require("dotenv").config();

const mongo = mongoose
  .connect(process.env.MONGO_URI)
  .catch((err) => console.error(err));

module.exports = mongo;
