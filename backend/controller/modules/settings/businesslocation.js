const Businesslocation = require('../../../model/modules/settings/businesslocation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Businesslocation => /api/busilocations
exports.getAllBusinessloc = catchAsyncErrors(async (req, res, next) => {
    let busilocations;

    try{
        busilocations = await Businesslocation.find()
    }catch(err){
        console.log(err.message);
    }

    if(!busilocations){
        return next(new ErrorHandler('Business location not found!', 400));
    }

    return res.status(200).json({
        // count: busilocations.length,
        busilocations
    });
})

// Create new Businesslocation => /api/busilocation/new
exports.addBusinessloc = catchAsyncErrors(async (req, res, next) =>{

    // let checkloc = await Businesslocation.findOne({ email: req.body.email });

    //     if(checkloc){
    //         return next(new ErrorHandler('Email already exist!', 400));
    //     }

    let abusilocation = await Businesslocation.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!' });
})

// get Signle Businesslocation => /api/busilocation/:id
exports.getSingleBusinessloc = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sbusilocation = await Businesslocation.findById(id);

    if(!sbusilocation){
        return next(new ErrorHandler('Business location not found!', 400));
    }

    return res.status(200).json({
        sbusilocation
    })
})

// update Businesslocation by id => /api/busilocation/:id
exports.updateBusinessloc = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upbusilocation = await Businesslocation.findByIdAndUpdate(id, req.body);

    if (!upbusilocation) {
      return next(new ErrorHandler('Business location not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Businesslocation by id => /api/busilocation/:id
exports.deleteBusinessloc = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dbusilocation = await Businesslocation.findByIdAndRemove(id);

    if(!dbusilocation){
        return next(new ErrorHandler('Business location not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted successfully'
    });
})