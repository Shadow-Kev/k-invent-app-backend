const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Veuillez saisir votre nom"],
    },
    email: {
      type: String,
      required: [true, "Veuillez saisir votre nom"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Veuillez saisir un email valide",
      ],
    },
    password: {
      type: String,
      required: [true, "Veuillez saisir le mot de passe"],
      minLength: [8, "Le mot de passe doit avoir au moins 8 caractères"],
      //maxLength: [23, "Le mot de passe ne doit pas dépasser 23 caractères"],
    },
    photo: {
      type: String,
      required: [true, "Veuillez choisir une photo"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+228",
    },
    bio: {
      type: String,
      maxLength: [250, "La bio ne doit pas dépasser 250 caractères"],
      default: "bio",
    },
  },
  { timestamps: true }
);

// Encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hasedPassword = await bcrypt.hash(this.password, salt);
  this.password = hasedPassword;
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
