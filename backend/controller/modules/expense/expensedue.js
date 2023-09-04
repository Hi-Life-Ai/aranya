const Expensedue = require('../../../model/modules/expense/expensedue');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
// get All expensedue => /api/expensedues
exports.getAllExpensedue = catchAsyncErrors(async (req, res, next) => {
    let expensedues;
    try{
        expensedues = await Expensedue.find()
    }catch(err){
        console.log(err.message);
    }
    if(!expensedues){
        return next(new ErrorHandler('Expensedue not found!', 404));
    }
    return res.status(200).json({
        // count: expensedues.length,
        expensedues
    });
})
// Create new expensedue => /api/expensedue/new
exports.addExpensedue = catchAsyncErrors(async (req, res, next) =>{
   let aexpensedue = await Expensedue.create(req.body)
    if(!aexpensedue){
        return next(new ErrorHandler('Expensedue not found!', 404));
    }
    return res.status(200).json({ message: 'Successfully added!' });
})
// get Signle expensedue => /api/expensedue/:id
exports.getSingleExpensedue = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let sexpensedue = await Expensedue.findById(id);
    if(!sexpensedue){
        return next(new ErrorHandler('Expensedue not found!', 404));
    }
    return res.status(200).json({
        sexpensedue
    })
})
// update expensedue by id => /api/expensedue/:id
exports.updateExpensedue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upexpensedue = await Expensedue.findByIdAndUpdate(id, req.body);
    if (!upexpensedue) {
      return next(new ErrorHandler('Expensedue not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
});
// delete expensedue by id => /api/expensedue/:id
exports.deleteExpensedue = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dexpensedue = await Expensedue.findByIdAndRemove(id);
    if(!dexpensedue){
        return next(new ErrorHandler('Expensedue not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})