const Product = require('../../../model/modules/product/product');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All product => /api/products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    let products;
    let result;
    try {
        result = await Product.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    products = result.filter((data, index) => {
        if (req.body.role == 'Admin') {
            return data
        } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })
    return res.status(200).json({
        // count: products.length,
        products
    });
})

// get All product => /api/products
exports.getLastIndexproduct = catchAsyncErrors(async (req, res, next) => {
    let products;
    try {
        products = await Product.find()
    } catch (err) {
        console.log(err.message);
    }

    let lastindex = products[products.length - 1];
    if (!lastindex) {
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        // products
        lastindex
    });
})

// Create new product => /api/product/new
exports.addProduct = catchAsyncErrors(async (req, res, next) => {

    let checkloc = await Product.findOne({ sku: req.body.sku });

    if (checkloc) {
        return next(new ErrorHandler('Sku/Code already exist!', 400));
    }

    let aproduct = await Product.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle product => /api/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sproduct = await Product.findById(id);

    if (!sproduct) {
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({
        sproduct
    })
})
// update product by id => /api/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uproduct = await Product.findByIdAndUpdate(id, req.body);

    if (!uproduct) {
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete product by id => /api/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dproduct = await Product.findByIdAndRemove(id);

    if (!dproduct) {
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})


// get All product with location wise and Assign Businessid => /api/products
exports.getAllProductsId = catchAsyncErrors(async (req, res, next) => {
    let products;
    const { businessid } = req.body;
    try {
        products = await Product.find({ assignbusinessid: businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({
        products
    });
})