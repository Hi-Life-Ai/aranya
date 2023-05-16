const Transfer = require('../../../model/modules/stock/transfer');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Transfers => /api/transfers
exports.getAllTransfers = catchAsyncErrors(async (req, res, next) => {
    let transfers;
    try{
        transfers = await Transfer.find()
    }catch(err){
        console.log(err.message);
    }
    if(!transfers){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        transfers
    });
})
// get status false => /api/transfersstatus
exports.getAllTransfersStatus = catchAsyncErrors(async (req, res, next) => {
    let transfersstatus;
    let transferss;
    try{
        transferss = await Transfer.find();
        transfersstatus = transferss.filter((data, index)=>{
            return data.status == false
        })
    }catch(err){
        console.log(err.message);
    }
    if(!transferss){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        count: transfersstatus.length,
        transferss,
        transfersstatus
    });
})
// Create new transfer => /api/transfer/new
exports.addTransfer = catchAsyncErrors(async (req, res, next) => {

    transfers = await Transfer.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle transfer => /api/transfer/:id
exports.getSingleTransfer = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let stransfer = await Transfer.findById(id);

    if(!stransfer){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        stransfer
    })
})
// update transfer by id => /api/transfer/:id
exports.updateTransfer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let utransfer = await Transfer.findByIdAndUpdate(id, req.body);

    if (!utransfer) {
      return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete Transfer by id => /api/transfer/:id
exports.deleteTransfer = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dtransfer = await Transfer.findByIdAndRemove(id);

    if(!dtransfer){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})