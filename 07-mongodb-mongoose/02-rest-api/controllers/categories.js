const Categories = require("../models/Category");

const getFormattedCategories = (categories) =>
  categories.map((category) => ({
    id: category.id,
    title: category.title,
    subcategories: getFormattedSubCategories(category.subcategories),
  }));

const getFormattedSubCategories = (subCategories) =>
  subCategories.map((subCategory) => ({
    id: subCategory.id,
    title: subCategory.title,
  }));

module.exports.categoryList = async function categoryList(ctx) {
  const categories = await Categories.find();

  ctx.body = { categories: getFormattedCategories(categories) };
};
