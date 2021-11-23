const jwt = require("jsonwebtoken");

module.exports = (app, Product) => {
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

  // test endpoint
  app.get("/", (req, res) => {
    res.send("<h1> Hello World </h1>");
  });

  // test authorised endpoint
  app.get("/dash", authenticateToken, (req, res) => {
    res.send("<h1> Dashboard </h1>");
  });

  // login
  app.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      // const user = await User.findOne({ username });
      const user = Users.filter(
        (x) => x.username === username && x.password === password
      );
      console.log(user);
      if (!user)
        return res.status(401).json({
          respStatus: false,
          respMsg: "Please enter a valid username.",
        });
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

  // GetAll
  app.get("/getAllProducts", async (req, res) => {
    const products = await Product.find({});
    res.status(200).send(products);
  });

  // add product
  app.post("/addProduct", async (req, res) => {
    const product = new Product({});

    try {
      await product.save();
      res.status(201).send(product);
    } catch (err) {
      console.error(err);
    }
  });
};
