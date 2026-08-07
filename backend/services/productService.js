const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

const getAllProducts = async (query = {}) => {
  const {
    keyword = "",
    category = "",
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = query;

  const filter = {};

  if (keyword) {
    filter.name = { $regex: keyword, $options: "i" };
  }
  if (category && category !== "All") {
    filter.category = category;
  }
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sort).skip(skip).limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const getCategories = async () => {
  return await Product.distinct("category");
};

const createProduct = async (data) => {
  return await Product.create(data);
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);
  if (!product) throw new ApiError(404, "Product not found");
  return { message: "Product deleted" };
};

module.exports = {
  getAllProducts,
  getProductById,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
