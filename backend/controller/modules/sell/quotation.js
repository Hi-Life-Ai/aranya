const Quotation = require('../../../model/modules/sell/quotation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Quotation => /api/quotations
exports.getAllQuotations = catchAsyncErrors(async (req, res, next) => {
    let quotations;

    try{
        quotations = await Quotation.find()
    }catch(err){
        console.log(err.message);
    }

    if(!quotations){
        return next(new ErrorHandler('Quoation not found!', 400));
    }

    return res.status(200).json({
        // count: quotations.length,
        quotations
    });
})

// Create new Quotation => /api/quotation/new
exports.addQuotation = catchAsyncErrors(async (req, res, next) =>{
   let aquotation = await Quotation.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Quotation => /api/quotation/:id
exports.getSingleQuotation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let squotation = await Quotation.findById(id);

    if(!squotation){
        return next(new ErrorHandler('Quoation not found!', 400));
    }

    return res.status(200).json({
        squotation
    })
})

// update Quotation by id => /api/quotation/:id
exports.updateQuotation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uquotation = await Quotation.findByIdAndUpdate(id, req.body);

    if (!uquotation) {
      return next(new ErrorHandler('Quoation not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Quotation by id => /api/quotation/:id
exports.deleteQuotation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dquotation = await Quotation.findByIdAndRemove(id);

    if(!dquotation){
        return next(new ErrorHandler('Quoation not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})