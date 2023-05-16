const Taxrate = require('../../../model/modules/settings/taxrate');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Taxrate => /api/taxrates
exports.getAllTaxrate = catchAsyncErrors(async (req, res, next) => {
    let taxrates;

    try{
        taxrates = await Taxrate.find()
    }catch(err){
        console.log(err.message);
    }

    if(!taxrates){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        // count: taxrates.length,
        taxrates
    });
})

// Create new Taxrate => /api/taxrate/new
exports.addTaxrate = catchAsyncErrors(async (req, res, next) =>{
    
    let ataxrate = await Taxrate.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Taxrate => /api/taxrate/:id
exports.getSingleTaxrate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let staxrate = await Taxrate.findById(id);

    if(!staxrate){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        staxrate
    })
})

// update Taxrate by id => /api/taxrate/:id
exports.updateTaxrate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uptaxrate = await Taxrate.findByIdAndUpdate(id, req.body);

    if (!uptaxrate) {
      return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        message: 'Updated successfully' 
    });
})

// delete Taxrate by id => /api/taxrate/:id
exports.deleteTaxrate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dtaxrate = await Taxrate.findByIdAndRemove(id);


    if(!dtaxrate){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})