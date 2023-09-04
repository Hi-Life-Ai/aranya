const Transfer = require('../../../model/modules/stock/transfer');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//  Datefield
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

// get All Transfers => /api/transfers
exports.getAllTransfers = catchAsyncErrors(async (req, res, next) => {
    let transfers;
    try {
        transfers = await Transfer.find()
    } catch (err) {
        console.log(err.message);
    }
    if (!transfers) {
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
    try {
        transferss = await Transfer.find();
        transfersstatus = transferss.filter((data, index) => {
            return data.status == false
        })
    } catch (err) {
        console.log(err.message);
    }
    if (!transferss) {
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
exports.getSingleTransfer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let stransfer = await Transfer.findById(id);

    if (!stransfer) {
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
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Transfer by id => /api/transfer/:id
exports.deleteTransfer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dtransfer = await Transfer.findByIdAndRemove(id);

    if (!dtransfer) {
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getTransferReport = catchAsyncErrors(async (req, res, next) => {

    let transferreports;
    let result;
    const { userassignedlocation, role, businessid, startdate, enddate, location } = req.body

    try {
        result = await Transfer.find({ assignbusinessid: businessid, date: { $gte: startdate, $lte: enddate }, fromlocation: { $eq: location } })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('stock not found!', 404));
    }

    return res.status(200).json({
        result
    });
})

exports.getTransferReporttoday = catchAsyncErrors(async (req, res, next) => {

    let todaytransfers;

    const { businessid, } = req.body

    try {
        todaytransfers = await Transfer.find({ assignbusinessid: businessid, date: today })
    } catch (err) {
        console.log(err.message);
    }
    if (!todaytransfers) {
        return next(new ErrorHandler('stock not found!', 404));
    }

    return res.status(200).json({
        todaytransfers
    });
})


exports.getAdjustReport = catchAsyncErrors(async (req, res, next) => {

    let adjustreports;
    let result;
    const { businessid, startdate, enddate, location } = req.body

    try {
        result = await Transfer.find({ assignbusinessid: businessid, date: { $gte: startdate, $lte: enddate } })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('stock not found!', 404));
    }

    adjustreports = result.filter((data) => {
        if (data.tobusinesslocations.includes(location)) {
            return data
        } else {
            []
        }
    })

    return res.status(200).json({
        adjustreports
    });
})



exports.getAdjustReportToday = catchAsyncErrors(async (req, res, next) => {

    let todayadjusts;
    const { businessid } = req.body

    try {
        todayadjusts = await Transfer.find({ assignbusinessid: businessid, date: today })
    } catch (err) {
        console.log(err.message);
    }
    if (!todayadjusts) {
        return next(new ErrorHandler('stock not found!', 404));
    }

    return res.status(200).json({
        todayadjusts
    });
})



exports.getRejectReport = catchAsyncErrors(async (req, res, next) => {

    let rejectreport;
    let result;
    const { businessid, startdate, enddate, location } = req.body

    try {
        result = await Transfer.find({ assignbusinessid: businessid, date: { $gte: startdate, $lte: enddate }, reject: true })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('stock not found!', 404));
    }

    rejectreport = result.filter((data) => {
        if (data.tobusinesslocations.includes(location)) {
            return data
        } else {
            []
        }
    })

    return res.status(200).json({
        rejectreport
    });
})

exports.getRejectReportToday = catchAsyncErrors(async (req, res, next) => {

    let todayreject;
    const { businessid } = req.body

    try {
        todayreject = await Transfer.find({ assignbusinessid: businessid, date: today, reject: true })
    } catch (err) {
        console.log(err.message);
    }
    if (!todayreject) {
        return next(new ErrorHandler('stock not found!', 404));
    }

    return res.status(200).json({
        todayreject
    });
})

// get All Transfers location and id and role => /api/transferlocationwise
exports.getAllLocaTransfer = catchAsyncErrors(async (req, res, next) => {
    let transfers;
    let result;
    const { businessid, userassignedlocation, role } = req.body;
    try {
        transfers = await Transfer.find({ assignbusinessid: businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!transfers) {
        return next(new ErrorHandler('Data not found!', 404));
    }

    result = transfers.map((data, index) => {
        if (role == 'Admin') {
            return data
        } else if (userassignedlocation.includes(data.tobusinesslocations)) {
            return data
        }
    })

    return res.status(200).json({
        transfers: result
    });
})

// Transfer data
exports.getAllTransfersData = catchAsyncErrors(async (req, res, next) => {
    let alltransfers = [];
    let result;
    let userLocations = req.body.userassignedlocation;
    let filteredDataTransfer = [];
    let products = []


    try {
        result = await Transfer.find({ assignbusinessid: req.body.businessid, status: false, reject: false })

        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }

        if (req.body.role == "Admin") {
            alltransfers = result?.filter((data, index) => {
                return data
            })
        } else {
            result.forEach((data, index) => {
                // let products = []
                data?.products?.forEach((product) => {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product?.locations?.filter((data, index) => {
                        if (userLocations.includes(data)) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        let productData = product
                        productData["quantity"] = quantity
                        productData["locations"] = locations

                        products.push(productData)

                    }

                })
                if (products.length != 0) {
                    let dataTransfer = data
                    dataTransfer["products"] = products
                    filteredDataTransfer.push(dataTransfer)

                }
            })
        }
        let allresult = req.body.role == "Admin" ? alltransfers : filteredDataTransfer
        return res.status(200).json({
            allresult
        });
    } catch (err) {
        console.log(err.message);
    }

})

// Adjust data
exports.getAllAdjustData = catchAsyncErrors(async (req, res, next) => {
    let alladjusts = [];
    let result;
    let userLocations = req.body.userassignedlocation;
    let filteredDataTransfer = [];
    let products = []


    try {
        result = await Transfer.find({ assignbusinessid: req.body.businessid, status: true, reject: false })

        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }

        if (req.body.role == "Admin") {
            alladjusts = result?.filter((data, index) => {
                return data
            })
        } else {
            result.forEach((data, index) => {
                // let products = []
                data?.products?.forEach((product) => {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product?.locations?.filter((data, index) => {
                        if (userLocations.includes(data)) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        let productData = product
                        productData["quantity"] = quantity
                        productData["locations"] = locations

                        products.push(productData)

                    }

                })
                if (products.length != 0) {
                    let dataTransfer = data
                    dataTransfer["products"] = products
                    filteredDataTransfer.push(dataTransfer)

                }
            })
        }
        let allresult = req.body.role == "Admin" ? alladjusts : filteredDataTransfer
        return res.status(200).json({
            allresult
        });
    } catch (err) {
        console.log(err.message);
    }

})