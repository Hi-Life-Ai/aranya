const express = require('express');
const expenseRoute = express.Router();

// connect expense category controller
const { getAllECate, addECate, updateECate, getSingleECate, deleteECate, getAllECateById } = require('../controller/modules/expense/expensecategories');

expenseRoute.route('/expcategories').get(getAllECate);
expenseRoute.route('/expcategory/new').post(addECate);
expenseRoute.route('/expcategory/:id').get(getSingleECate).put(updateECate).delete(deleteECate);
expenseRoute.route('/expcategoriesbyid').post(getAllECateById);

// connect expense category controller
const { getAllExpense, addExpense, updateExpense, getSingleExpense, deleteExpense, getdatefilterexpense, getTodayexpense } = require('../controller/modules/expense/expense');

expenseRoute.route('/expenses').post(getAllExpense);
expenseRoute.route('/expense/new').post(addExpense);
expenseRoute.route('/expense/:id').get(getSingleExpense).put(updateExpense).delete(deleteExpense);
expenseRoute.route('/expensedatefilter').post(getdatefilterexpense);
expenseRoute.route('/expenseToday').post(getTodayexpense);

module.exports = expenseRoute;
