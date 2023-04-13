const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const sendEmail = require("../utils/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error(
      "Cet utilisateur n'a pas été trouvé, veuillez vous connecter"
    );
  }

  // Validation
  if (!subject || !message) {
    res.status(400);
    throw new Error("Veuillez remplir tous les champs");
  }

  // Send email

  const sendTo = process.env.EMAIL_USER;
  const sentFrom = process.env.EMAIL_USER;
  const reply_to = user.email;
  try {
    await sendEmail(subject, message, sendTo, sentFrom, reply_to);
    res.status(200).json({ success: true, message: "Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("L'Email n'a pas été envoyé, veuillez réessayer");
  }
});

module.exports = {
  contactUs,
};
