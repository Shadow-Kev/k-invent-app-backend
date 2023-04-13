const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Veuillez saisir un nom"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      default: "SKU",
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Veuillez saisir la catégorie"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "Veuillez saisir la quantité"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Veuillez saisir le prix"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Veuillez saisir la description"],
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
