const express = require('express');
const expenseRoute = express.Router();

// connect expense category controller
const { getAllECate,addECate,updateECate,getSingleECate,deleteECate } = require('../controller/modules/expense/expensecategories');

expenseRoute.route('/expcategories').get(getAllECate);
expenseRoute.route('/expcategory/new').post(addECate);
expenseRoute.route('/expcategory/:id').get(getSingleECate).put(updateECate).delete(deleteECate);
 
// connect expense category controller
const { getAllExpense,addExpense,updateExpense,getSingleExpense,deleteExpense } = require('../controller/modules/expense/expense');

expenseRoute.route('/expenses').get(getAllExpense);
expenseRoute.route('/expense/new').post(addExpense);
expenseRoute.route('/expense/:id').get(getSingleExpense).put(updateExpense).delete(deleteExpense);
 
module.exports = expenseRoute;
