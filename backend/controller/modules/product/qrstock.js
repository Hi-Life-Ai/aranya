const Qrno = require('../../../model/modules/product/qrstock');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get all qr no => /api/qrcodes
exports.getAllQr = catchAsyncErrors(async (req, res, next) => {
    let qrnumber;
    try{
        qrnumber = await Qrno.find()
    }catch(err){
        console.log(err.message);
    }
    if(!qrnumber){
        return next(new ErrorHandler('Qrno not found!', 404));
    }
    return res.status(200).json({
        // count: units.length,
        qrnumber
    });
})

// add qrno => api/qrcode/new
exports.addQr = catchAsyncErrors(async (req, res, next) =>{

    let aqrno = await Qrno.create(req.body)
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// update qr by id => /api//qrcode/:id
exports.updateQr = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uQrno = await Qrno.findByIdAndUpdate(id, req.body);

    if (!uQrno) {
      return next(new ErrorHandler('Qrno not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Unit by id => /api/qrcode/:id
exports.deleteQr = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dQrno = await Qrno.findByIdAndRemove(id);
    if(!dQrno){
        return next(new ErrorHandler('Qrno not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})