const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(bodyParser());

app.use(cors());

if (!process.env.PORT) process.exit(1);

const PORT = process.env.PORT;
const JWT_SECRET = process.env.JWT_SECRET;

const Users = [
  {
    username: "node",
    password: "12345",
  },
  {
    username: "harry",
    password: "harry",
  },
];

app.listen(PORT, () => {
  console.log(`Server 🔥🔥🔥 up on port: ${PORT}`);
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null)
    return res
      .status(401)
      .json({ respStatus: false, respMsg: "Not Authorized" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(401).json({ respStatus: false, respMsg: err });
    req.user = user;
    next();
  });
};

app.get("/", (req, res) => {
  res.send("<h1> Hello World </h1>");
});

app.get("/dash", authenticateToken, (req, res) => {
  res.send("<h1> Dashboard </h1>");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // const user = await User.findOne({ username });
    const user = Users.filter((x) => x.username === username && x.password === password)[0];
    
    if (!user)
      return res
        .status(401)
        .json({ respStatus: false, respMsg: "Please enter a valid username." });
    const accessToken = jwt.sign({ username, id: user._id }, JWT_SECRET, {
      expiresIn: process.env.NODE_ENV === "production" ? "6h" : "2 days",
    });
    res
      .status(200)
      .json({ respStatus: true, respMsg: "User Logged in!", accessToken });
  } catch (err) {
    console.log(err);
    res.status(503).json({ respStatus: false, respMsg: "Server Error!" });
  }
});
