const express = require('express');
const productRoute = express.Router();

//authorized route
const { isAuthorized } = require('../middleware/routeauthorised');

// connect product controller
const { getAllProducts,getLastIndexproduct,addProduct,updateProduct,getSingleProduct,deleteProduct } = require('../controller/modules/product/product');

productRoute.route('/products').get(getAllProducts);
productRoute.route('/productlastindex').get(getLastIndexproduct);
productRoute.route('/product/new').post(addProduct);
productRoute.route('/product/:id').get(getSingleProduct).put(updateProduct).delete(deleteProduct);

// connect unit controller
const { getAllUnits,addUnit,updateUnit,getSingleUnit,deleteUnit } = require('../controller/modules/product/unit');

productRoute.route('/units').get(getAllUnits);
productRoute.route('/unit/new').post(addUnit);
productRoute.route('/unit/:id').get(getSingleUnit).put(updateUnit).delete(deleteUnit);

// connect category controller
const { getAllCategories,addCategory,updateCategory,getSingleCategory,deleteCategory } = require('../controller/modules/product/category');

productRoute.route('/categories').get(getAllCategories);
productRoute.route('/category/new').post(addCategory);
productRoute.route('/category/:id').get(getSingleCategory).put(updateCategory).delete(deleteCategory);

module.exports = productRoute;
