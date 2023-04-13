const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description } = req.body;

  // Validation
  if (!name || !category || !quantity || !price || !description) {
    res.status(400);
    throw new Error("Veuillez remplir tous les champs");
  }

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Kinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("L'image ne peut pas être charger");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  //Create Product
  const product = await Product.create({
    user: req.user.id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });
  res.status(201).json(product);
});

// Get all Products
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user.id }).sort("-createdAt");
  res.status(200).json(products);
});

// Get single product
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // If product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error("Produit non trouvé");
  }

  // Match product to it's user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error(
      "Cet utilisateur n'est pas autorisé à accéder à cette ressource"
    );
  }

  res.status(200).json(product);
});

// Delete product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  // If product doesn't exist
  if (!product) {
    res.status(404);
    throw new Error("Produit non trouvé");
  }

  // Match product to it's user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error(
      "Cet utilisateur n'est pas autorisé à accéder à cette ressource"
    );
  }
  await product.remove();
  res.status(200).json({ message: "Produit supprimé avec succès." });
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, category, quantity, price, description } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("Produit non trouvé");
  }

  // Match product to it's user
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error(
      "Cet utilisateur n'est pas autorisé à accéder à cette ressource"
    );
  }
  // Handle Image upload
  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Kinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("L'image ne peut pas être charger");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  //Update Product
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      category,
      quantity,
      price,
      description,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});
module.exports = {
  createProduct,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
