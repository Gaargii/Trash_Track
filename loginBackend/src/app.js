
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const multer = require("multer");

require("./db/conn");
const register = require("./models/registerss");
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const tempelates_path = path.join(__dirname, "../tempelates/views");
const partials_path = path.join(__dirname, "../tempelates/partials");
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set("view engine", "hbs");
app.set("views", tempelates_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/landing", (req, res) => {
  res.render("landing");
});

app.post("/register", async (req, res) => {
  try {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if (password === confirmpassword) {
      const resLogin = new register({
        name: name,
        username: username,
        email: email,
        password: password,
        confirmpassword: confirmpassword,
        type: "user", // Set the user type
      });
      const registered = await resLogin.save();
      res.status(200).render("login");
    } else {
      res.send(
        "<h1 style='color : red'>password not matching, please check it</h1>"
      );
    }
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.email) {
      // The email is already registered, so you can redirect to the login page
      res.status(200).render("login", { error: "Email already registered" });
    } else {
      res.status(400).send(error);
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const user = await register.findOne({ username: username });

    if (!user) {
      // User not found
      return res.status(401).json({ message: "Invalid Username or Password" });
    }

    if (user.password === password) {
      if (user.type === "user") {
        res.status(200).render("landing", { name: user.username });
      } else if (user.type === "admin") {
        // Handle admin login here
        const users = await register.find(
          { type: "user" },
          { username: 1, location: 1, image: 1 }
        );
        res.status(200).render("adminLanding", { users: users });
      }
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid Login Details" });
  }
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware to handle file uploads
app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Get the user's location if available
    const { long, lat } = req.body;

    const imageUrl = `/public/uploads/${req.file.filename}`;

    // Update the user's document with the image URL
    const user = await register.findOneAndUpdate(
      { username: req.body.username },
      {
        $set: {
          image: imageUrl,
        },
        $unset: { imageLocation: "" }, // Remove any existing image location
      },
      { new: true }
    );

    // Update the user's location if available
    if (long && lat) {
      user.location = {
        type: "Point",
        coordinates: [parseFloat(long), parseFloat(lat)],
      };
      await user.save();
    }

    res.status(200).render("landing");
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running at port number ${port}`);
});
