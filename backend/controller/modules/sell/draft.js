const Draft = require('../../../model/modules/sell/draft');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Draft => /api/drafts
exports.getAllDrafts = catchAsyncErrors(async (req, res, next) => {
    let drafts;

    try{
        drafts = await Draft.find()
    }catch(err){
        console.log(err.message);
    }

    if(!drafts){
        return next(new ErrorHandler('Draft not found!', 400));
    }

    return res.status(200).json({
        // count: drafts.length,
        drafts
    });
})

// Create new Draft => /api/draft/new
exports.addDraft = catchAsyncErrors(async (req, res, next) =>{
   let adraft = await Draft.create(req.body)

   return res.status(200).json({ 
    message: 'Successfully added!' 
});
})

// get Signle Draft => /api/draft/:id
exports.getSingleDraft = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sdraft = await Draft.findById(id);

    if(!sdraft){
        return next(new ErrorHandler('Draft not found!', 400));
    }

    return res.status(200).json({
        sdraft
    })
})

// update Draft by id => /api/draft/:id
exports.updateDraft = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let udraft = await Draft.findByIdAndUpdate(id, req.body);

    if (!udraft) {
      return next(new ErrorHandler('Draft not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Draft by id => /api/draft/:id
exports.deleteDraft = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let ddraft = await Draft.findByIdAndRemove(id);

    if(!ddraft){
        return next(new ErrorHandler('Draft not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})