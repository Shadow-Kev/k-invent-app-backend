const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Vous n'êtes pas autorisée ! Veuillez vous connecter");
    }

    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // Get user id form token
    const user = await User.findById(verified.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Utilisateur non trouvé");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Vous n'êtes pas autorisée ! Veuillez vous connecter");
  }
});

module.exports = protect;
