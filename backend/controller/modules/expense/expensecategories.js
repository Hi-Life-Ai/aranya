const Expcategory = require('../../../model/modules/expense/expensecategories');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Expcategory => /api/expcategorys

exports.getAllECate = catchAsyncErrors(async (req, res, next) => {
    let excategorys;

    try {
        excategorys = await Expcategory.find()
    } catch (err) {
        console.log(err.message);
    }

    if (!excategorys) {
        return next(new ErrorHandler('Expense Category not found!', 404));
    }

    return res.status(200).json({
        // count: excategorys.length,
        excategorys
    });
})

// Create new Expcategory => /api/expcategory/new

exports.addECate = catchAsyncErrors(async (req, res, next) => {

    let checkloc = await Expcategory.findOne({ categoryname: req.body.categoryname });

    if (checkloc) {
        return next(new ErrorHandler('Name already exist!', 400));
    }

    let checklog = await Expcategory.findOne({ categorycode: req.body.categorycode });

    if (checklog) {
        return next(new ErrorHandler('Code already exist!', 400));
    }
    let aexcategory = await Expcategory.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Expcategory => /api/expcategory/:id

exports.getSingleECate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sexcategory = await Expcategory.findById(id);

    if (!sexcategory) {
        return next(new ErrorHandler('Expense Category not found!', 404));
    }

    return res.status(200).json({
        sexcategory
    })
});

// update Expcategory by id => /api/expcategory/:id

exports.updateECate = catchAsyncErrors(async (req, res, next) => {

    let upexcategory = await Expcategory.findByIdAndUpdate(req.params.id);

    if (!upexcategory) {
        return next(new ErrorHandler('Expense Category not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Expcategory by id => /api/expcategory/:id

exports.deleteECate = catchAsyncErrors(async (req, res, next) => {
    let dexcategory = await Expcategory.findByIdAndRemove(req.params.id);

    if (!dexcategory) {
        return next(new ErrorHandler('Expense Category not found!', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getAllECateById = catchAsyncErrors(async (req, res, next) => {
    let excategorys;
    let result;
    const { businessid, userassignedlocation, role } = req.body;
    try {
        excategorys = await Expcategory.find({ assignbusinessid: businessid })
    } catch (err) {
        console.log(err.message);
    }

    if (!excategorys) {
        return next(new ErrorHandler('Expense Category not found!', 404));
    }

    result = excategorys.map((data, index) => {
        if (role == 'Admin') {
            return data
        }
        //  else if (userassignedlocation.includes(data.tobusinesslocations)) {
        //     return data
        // }
    })
    return res.status(200).json({
        // count: excategorys.length,
        excategorys: result
    });
})