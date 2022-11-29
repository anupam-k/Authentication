require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
var cookieParser = require("cookie-parser");

// custom middleware
const auth = require("./middleware/auth");

//import model - User
const User = require("./model/user");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello Auth System");
});

app.post("/register", async (req, res) => {
  try {
    // collect all information
    const { firstname, lastname, email, password } = req.body;

    // validate the data, if exits
    if (!(email && password && lastname && firstname)) {
      res.status(401).send("All fields are required");
    }

    // check if email is in correct format

    // check if user exists or not
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(401).send("User already found in database");
    }

    // Encrypt the password here
    const myEncyPassword = await bcrypt.hash(password, 10);

    // Create a new entry in Database
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: myEncyPassword,
    });

    // Create a token and send it to the user
    const token = jwt.sign(
      {
        id: user._id,
        email,
      },
      "shhhhh",
      { expiresIn: "2h" }
    );

    user.token = token;
    // don't want to send the password
    user.password = undefined;

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    console.log("Error is response route");
  }
});

app.post("/login", async (req, res) => {
  try {
    // collected information from frontend
    const { email, password } = req.body;
    // validate
    if (!(email && password)) {
      res.status(401).send("Email and Passwords is required");
    }
    // check user in database
    const user = await User.findOne({ email });

    // if user does not exist

    // match the password
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id, email }, "shhhhh", {
        expiresIn: "2h",
      });

      user.password = undefined;
      user.token = token;

      // Cookies
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }
    // create token and send
    res.sendStatus(400).send("Email or Password is incorrect!");
  } catch (error) {
    console.log(error);
  }
});

app.get("/dashboard", auth, (req, res) => {
  res.send("Welcome to the Dashboard");
});

app.get("/profile", (req, auth, res) => {
  // access to req.user = id, email
  // based on id, query to DB and get all information of user - findOne({id})
  // send a json response with all data
});

module.exports = app;
