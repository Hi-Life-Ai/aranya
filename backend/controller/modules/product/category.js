const Category = require('../../../model/modules/product/category');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Categories => /api/brands
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
    //     let categories;
    //     let result;

    //     try{
    //         result = await Category.find({ assignbusinessid: req.body.businessid})
    //     }catch(err){
    //         console.log(err.message);
    //     }
    //     if(!categories){
    //         return next(new ErrorHandler('Category not found!', 404));
    //     }

    //     categories = result.filter((data, index) => {
    //         if (req.body.role == 'Admin') {
    //             return data
    //         } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
    //             return data
    //         }
    //     })
    //     return res.status(200).json({
    //         // count: categories.length,
    //         categories
    //     });
    // })
    let categories = await Category.find({ assignbusinessid: req.body.businessid })

    if (!categories) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({
        // count: categories.length,
        categories
    });
})


// Create new Brand => /api/brand/new
exports.addCategory = catchAsyncErrors(async (req, res, next) => {

    let acateogry = await Category.create(req.body)

    return res.status(201).json({ message: 'Successfully added!' });
})
// get Signle Brand => /api/brand/:id
exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let scategory = await Category.findById(id);


    if (!scategory) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({
        scategory
    })
})
// update Brand by id => /api/brand/:id
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ucategory = await Category.findByIdAndUpdate(id, req.body);

    if (!ucategory) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Brand by id => /api/brand/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dcategory = await Category.findByIdAndRemove(id);

    if (!dcategory) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})