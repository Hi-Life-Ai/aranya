const Department = require('../../../model/modules/user/department');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All departments => /api/departments
exports.getAllDepartment = catchAsyncErrors(async (req, res, next) => {
    let departments;

    try{
        departments = await Department.find()
    }catch(err){
        console.log(err.message);
    }

    if(!departments){
        return next(new ErrorHandler('Department not found!', 400));
    }

    return res.status(200).json({
        // count: roles.length,
        departments
    });
})

// Create new department => /api/department/new
exports.addDepartmrnt = catchAsyncErrors(async (req, res, next) =>{
    
    let adddepartment = await Department.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!'
     });
})

// get Signle department => /api/department/:id
exports.getSingleDepartment = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sdepartment = await Department.findById(id);

    if(!sdepartment){
        return next(new ErrorHandler('Department not found!', 400));
    }

    return res.status(200).json({
        sdepartment
    })
})

// update departments by id => /api/department/:id
exports.updateDepartment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let updepartment = await Department.findByIdAndUpdate(id, req.body);

    if (!updepartment) {
      return next(new ErrorHandler('Department not found!', 400));
    }
    return res.status(200).json({ 
        message: 'Updated Successfully!'
     });
})

// delete department by id => /api/department/:id
exports.deleteDepartment = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let ddepartment = await Department.findByIdAndRemove(id);

    if(!ddepartment){
        return next(new ErrorHandler('Department not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted Successfully!'
    });
})