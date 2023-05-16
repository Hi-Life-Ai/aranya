const Unit = require('../../../model/modules/product/unit');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Units => /api/units
exports.getAllUnits = catchAsyncErrors(async (req, res, next) => {
    let units;
    try{
        units = await Unit.find()
    }catch(err){
        console.log(err.message);
    }
    if(!units){
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({
        // count: units.length,
        units
    });
})
// Create new Unit => /api/unit/new
exports.addUnit = catchAsyncErrors(async (req, res, next) =>{

    let aunit = await Unit.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Signle Unit => /api/unit/:id
exports.getSingleUnit = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sunit = await Unit.findById(id);

    if(!sunit){
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({
        sunit
    })
})
// update Unit by id => /api/unit/:id
exports.updateUnit = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uunit = await Unit.findByIdAndUpdate(id, req.body);

    if (!uunit) {
      return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete Unit by id => /api/unit/:id
exports.deleteUnit = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dunit = await Unit.findByIdAndRemove(id);

    if(!dunit){
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})