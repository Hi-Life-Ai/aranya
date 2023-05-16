const Pos = require('../../../model/modules/sell/pos');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All product => /api/products
exports.getAllPos = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    try{
        pos1 = await Pos.find()
    }catch(err){
        console.log(err.message);
    }
    if(!pos1){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        pos1
    });
})
// get All Purchases => /api/productpurchases
exports.getAllProductSales = catchAsyncErrors(async (req, res, next) => {
    let sales = [];
    try{
       let req = await Pos.find();
        let datasales = req.map((data,index)=>{
        return data.goods
       })
       datasales.forEach((value)=>{
        value.forEach((valueData)=>{

            sales.push(valueData);
        })
       })
    }catch(err){
        console.log(err.message);
    }
    if(!sales){
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        // count: purchases.length,
        sales
    });
})
// Create new product => /api/product/new
exports.addPos = catchAsyncErrors(async (req, res, next) =>{
   let aproduct = await Pos.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Signle product => /api/product/:id
exports.getSinglePos = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let spos = await Pos.findById(id);

    if(!spos){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        spos
    })
})
// update product by id => /api/product/:id
exports.updatePos = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upos = await Pos.findByIdAndUpdate(id, req.body);

    if (!upos) {
      return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete product by id => /api/product/:id
exports.deletePos = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dpos = await Pos.findByIdAndRemove(id);

    if(!dpos){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})