if (process.platform !== "win32") {
  global.TextEncoder = require("util").TextEncoder;
  global.TextDecoder = require("util").TextDecoder;
}
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
require("./db/db");
const Product = require("./models/products");

const app = express();

app.use(bodyParser());

app.use(cors());

if (!process.env.PORT) process.exit(1);

const PORT = process.env.PORT;

require("./routes/routes")(app, Product);

app.listen(PORT, () => {
  console.log(`Server 🔥🔥🔥 up on port: ${PORT}`);
});
