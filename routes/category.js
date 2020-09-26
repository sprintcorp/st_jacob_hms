const express = require("express");
const {
    getCategories,
    getCategory,
    getCategoryBySlug,
    updateCategory,
    createCategory,
    deleteCategory
} = require('../controller/category');
const router = express.Router();
const Category = require('../model/Category');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(advancedResults(Category), getCategories).post(protect, createCategory);
router.route('/:id').get(getCategory).put(protect, updateCategory).delete(protect, deleteCategory);
router.route('/cat/:slug').get(getCategoryBySlug);

module.exports = router;