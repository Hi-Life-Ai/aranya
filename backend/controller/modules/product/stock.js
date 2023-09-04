const Stock = require('../../../model/modules/product/stock');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Stocks => /api/stocks
exports.getAllStocks = catchAsyncErrors(async (req, res, next) => {
    let stocks;
    try{
        stocks = await Stock.find()
    }catch(err){
        console.log(err.message);
    }
    if(!stocks){
        return next(new ErrorHandler('Stock not found!', 400));
    }
    return res.status(200).json({
        stocks
    });
})

// Create new Stock => /api/stock/new
exports.addStock = catchAsyncErrors(async (req, res, next) =>{

   let astock = await Stock.create(req.body)

    return res.status(201).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Stock => /api/stock/:id
exports.getSingleStock = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    
    let sstock = await Stock.findById(id);

    if(!sstock){
        return next(new ErrorHandler('Stock not found!', 404));
    }
    return res.status(200).json({
        sstock
    })
})

// update Stock by id => /api/stock/:id
exports.updateStock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ustock = await Stock.findByIdAndUpdate(id, req.body);

    if (!ustock) {
      return next(new ErrorHandler('Stock not found!', 404));
    }

    return res.status(200).json({
        message: 'Updated successfully!' 
    });
});


// delete Stock by id => /api/stock/:id
exports.deleteStock = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dstock = await Stock.findByIdAndRemove(id);

    if(!dstock){
        return next(new ErrorHandler('Stock not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})