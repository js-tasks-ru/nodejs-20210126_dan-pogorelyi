const mongoose = require("mongoose");
const Product = require("../models/Product");

const getFormattedProduct = (product) => ({
  id: product.id,
  title: product.title,
  images: product.images,
  category: product.category,
  subcategory: product.subcategory,
  price: product.price,
  description: product.description,
});

const getFormattedProducts = (products) => products.map(getFormattedProduct);

module.exports.productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const query = ctx.query.subcategory;

  if (!query) {
    return next();
  }

  const products = await Product.find({ subcategory: query });
  let response = { products: [] };

  if (products) {
    response = { products: getFormattedProducts(products) };
  }

  ctx.body = response;
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();

  ctx.body = { products: getFormattedProducts(products) };
};

module.exports.productById = async function productById(ctx, next) {
  const productId = ctx.params.id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return ctx.throw(400, "Invalid id");
  }

  const product = await Product.findById(productId);

  if (!product) {
    return ctx.throw(404, "Not found");
  }

  ctx.body = { product: getFormattedProduct(product) };
};
