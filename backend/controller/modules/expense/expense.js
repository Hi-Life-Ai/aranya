const Expense = require('../../../model/modules/expense/expense');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Expense => /api/expenses

exports.getAllExpense = catchAsyncErrors(async (req, res, next) => {
    let expenses;

    try{
        expenses = await Expense.find()
    }catch(err){
        console.log(err.message);
    }

    if(!expenses){
        return next(new ErrorHandler('Expense not found!', 404));
    }

    return res.status(200).json({
        // count: expenses.length,
        expenses
    });
})

// Create new Expense => /api/expense/new

exports.addExpense = catchAsyncErrors(async (req, res, next) =>{
   let aexpense = await Expense.create(req.body)

    return res.status(200).json({ message: 'Successfully added!' });
})

// get Signle Expense => /api/expense/:id

exports.getSingleExpense = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sexpense = await Expense.findById(id);

    if(!sexpense){
        return next(new ErrorHandler('Expense not found!', 404));
    }

    return res.status(200).json({
        sexpense
    })
})

// update Expense by id => /api/expense/:id

exports.updateExpense = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upexpense = await Expense.findByIdAndUpdate(id, req.body);

    if (!upexpense) {
      return next(new ErrorHandler('Expense not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
});

// delete Expense by id => /api/expense/:id

exports.deleteExpense = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dexpense = await Expense.findByIdAndRemove(id);

    if(!dexpense){
        return next(new ErrorHandler('Expense not found!', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})