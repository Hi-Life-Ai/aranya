const Taxrate = require('../../../model/modules/settings/taxrate');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Taxrate => /api/taxrates
exports.getAllTaxrate = catchAsyncErrors(async (req, res, next) => {
    let taxrates;
    const { businessid } = req.body;

    try {
        taxrates = await Taxrate.find({ assignbusinessid: businessid })
    } catch (err) {
        console.log(err.message);
    }

    if (!taxrates) {
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        // count: taxrates.length,
        taxrates
    });
})

// get All taxrate/taxrategroup => /api/taxrate:taxtype
exports.getAllTaxtype = catchAsyncErrors(async (req, res, next) => {

    const taxtype = req.params.taxtype;
    let taxrates;
    try {
        taxrates = await Taxrate.find({ taxtype })

        if (taxtype === 'taxrate') {
            return res.status(200).json({
                count: taxrates.length,
                taxrates
            });
        } else if (taxtype === 'taxrategroup') {
            return res.status(200).json({
                count: taxrates.length,
                taxrates
            });
        } else {
            return next(new ErrorHandler('Taxrate not found!', 400));
        }

    } catch (err) {
        console.log(err.message);
    }
})

// Create new Taxrate => /api/taxrate/new
exports.addTaxrate = catchAsyncErrors(async (req, res, next) => {

    // let checkloc = await Taxrate.findOne({ taxname: req.body.taxname });

    //     if(checkloc){
    //         return next(new ErrorHandler('Name already exist!', 400));
    //     }

    let ataxrate = await Taxrate.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Taxrate => /api/taxrate/:id
exports.getSingleTaxrate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let staxrate = await Taxrate.findById(id);

    if (!staxrate) {
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        staxrate
    })
})

// update Taxrate by id => /api/taxrate/:id
exports.updateTaxrate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uptaxrate = await Taxrate.findByIdAndUpdate(id, req.body);

    if (!uptaxrate) {
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        message: 'Updated successfully'
    });
})

// delete Taxrate by id => /api/taxrate/:id
exports.deleteTaxrate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dtaxrate = await Taxrate.findByIdAndRemove(id);


    if (!dtaxrate) {
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
