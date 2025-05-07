const express = require("express");

const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/authMiddleware");
const EmailHelper = require("../utils/emailHelper");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
// register a user



userRouter.post("/register", async (req, res) => {
  // /api/users/register
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }
    //const newUser = new User(req.body);
    
    // hash the password
     const saltRounds = 10; // the higher the number, the more secure but slower the hashing process
     const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
     const newUser = new User({
       ...req.body,
       password: hashedPassword,
     });
    await newUser.save();

    res.send({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// async function hashPassword(password) {
//   console.time("time taken");
//   const salt = await bcrypt.genSalt(14);
//   console.log("Salt:", salt);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   console.log("Hashed Password:", hashedPassword);
//   console.timeEnd("time taken");
//   console.log("*******************");
//   return hashPassword;
// }

userRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }); //{name:"Swapna", email:"swapna", password:"swapna"}
    if (!user) {
      return res.send({
        success: false,
        message: "User not found",
      });
    }

   // if (req.body.password !== user.password) {
     // return res.send({
      //  success: false,
      //  message: "Invalid password",
    //  });
    //}
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.send({
        success: false,
        message: "Invalid password",
      });
    }
   
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/get-current-user", auth, async (req, res) => {
  // console.log("URL:", req.url, req.method);
  // console.log("tokens", req.headers["authorization"]);
  const user = await User.findById(req.body.userId).select("-password");
  res.send({ success: true, message: "You are authenticated", data: user });
});

/**
  * otp - 1000000 - 9999999
  */
const otpGenerator = () => {
  return Math.floor(Math.random() * 900000 + 100000); // 100000 -> 999999
};

userRouter.patch("/forgetpassword", async (req, res) => {
  try {
    /**
     * 1. you can check for email
     * 2. check if the email is present or not
     * 3. if email is not present -> send a response -> user not found
     * 4. if email is present -> generate a random otp -> send to the email
     * 5. save the otp in the database
     */

    if (req.body.email === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user == null) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const otp = otpGenerator();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    // send the otp to the user
    await EmailHelper("otp.html", user.email, { name: user.name, otp: otp });
    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.patch("/reset/:email", async (req, res) => {
  // -> otp
  // new password
  // email -> params
  try {
    const resetDetails = req.body;
    if (!resetDetails.otp || !resetDetails.password) {
      return res.status(400).send({ message: "OTP and Password is required" });
    }
    const user = await User.findOne({ email: req.params.email });
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    // if otp is expired
    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (user.otp !== resetDetails.otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    user.password = resetDetails.password;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

module.exports = userRouter;