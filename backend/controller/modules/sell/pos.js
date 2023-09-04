const Pos = require('../../../model/modules/sell/pos');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//  Datefield
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

// get All product => /api/products
exports.getAllPos = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result;

    try {
        result = await Pos.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('pos not found!', 404));
    }

    pos1 = result.filter((data, index) => {
        if (req.body.role == 'Admin') {
            return data
        } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })

    return res.status(200).json({
        // count: products.length,
        pos1
    });
})

// Pos datefilter.....
exports.getPosdatefilter = catchAsyncErrors(async (req, res, next) => {
    const { businesslocation, startdate, enddate } = req.body

    let pos1;


    try {
        pos1 = await Pos.find({ businessid: businesslocation, formatteddate: { $gte: startdate, $lte: enddate } })

    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Pos not found!', 404));
    }

    return res.status(200).json({
        pos1
    });
})

//pos today date.....
exports.getTodaypos = catchAsyncErrors(async (req, res, next) => {
    let today;
    let result;
    try {
        result = await Pos.find({ assignbusinessid: req.body.businessid, today: today })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Data not found!', 404));
    }
    today = result.filter((data, index) => {
        if (req.body.role == 'Admin') {
            return data
        } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })
    return res.status(200).json({
        today
    });
})
// get All Purchases => /api/productpurchases
exports.getAllProductSales = catchAsyncErrors(async (req, res, next) => {
    let sales = [];
    try {
        let req = await Pos.find();
        let datasales = req.map((data, index) => {
            return data.goods
        })
        datasales.forEach((value) => {
            value.forEach((valueData) => {

                sales.push(valueData);
            })
        })
    } catch (err) {
        console.log(err.message);
    }
    if (!sales) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        // count: purchases.length,
        sales
    });
})
// Create new product => /api/product/new
exports.addPos = catchAsyncErrors(async (req, res, next) => {
    let aproduct = await Pos.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle product => /api/product/:id
exports.getSinglePos = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spos = await Pos.findById(id);

    if (!spos) {
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
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete product by id => /api/product/:id
exports.deletePos = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpos = await Pos.findByIdAndRemove(id);

    if (!dpos) {
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})



exports.getDaywiseProfit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result


    const { userassignedlocation, role, businessid, location, selectdate } = req.body


    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, location: { $eq: location }, formatedate: { $lte: selectdate } })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);



    return res.status(200).json({
        filterpos
    });
})



exports.getMonthWiseProfit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result


    const { userassignedlocation, role, businessid, location, selectmonth } = req.body



    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, location: { $eq: location }, })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })


    let posdata = result.map((data, i) => {
        var monthdate = new Date(data.date).getMonth() + 1

        if (monthdate == selectmonth) {
            return data.goods
        } else {
            return []
        }


    })

    let filterpos = posdata.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return res.status(200).json({
        filterpos
    });
})



exports.getWeekWseProfit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result
    const { userassignedlocation, role, businessid, location, selectdate } = req.body
    const previousWeekDates = [];
    const currentDate = new Date(selectdate);
    for (let i = 1; i <= 7; i++) {
        const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 + i);
        previousWeekDates.push(moment(previousDate).utc().format('DD-MM-YYYY'));
    }





    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, location: { $eq: location }, })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })



    let weekprofit = result.map((data, index) => {
        let dateTrim = moment(data.date).utc().format('DD-MM-YYYY')
        if (previousWeekDates.includes(dateTrim)) {
            return data.goods
        } else {
            return []
        }

    })



    let filterpos = weekprofit.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return res.status(200).json({
        filterpos
    });
})







exports.getYearWiseProfit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result


    const { userassignedlocation, role, businessid, location, selectyear } = req.body



    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, location: { $eq: location }, })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })


    let posdata = result.map((data, i) => {
        var year = new Date(data.date).getFullYear()

        if (year == selectyear) {
            return data.goods
        } else {
            return []
        }


    })

    let filterpos = posdata.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return res.status(200).json({
        filterpos
    });
})






exports.getCurrentYearwiseprofit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result


    const { userassignedlocation, role, businessid, } = req.body


    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })


    let posdata = result.map((data, i) => {
        var year = new Date(data.date).getFullYear()
        let = new Date().getFullYear()
        if (year == year) {
            return data.goods
        } else {
            return []
        }


    })

    let currentprofit = posdata.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return res.status(200).json({
        currentprofit
    });
})


exports.getCategoryWiseprofit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result

    const { userassignedlocation, role, businessid, category } = req.body
    console.log(category);

    try {
        pos1 = await Pos.aggregate([
            {
                $match: { assignbusinessid: businessid },
            },
            {
                $unwind: "$goods",
            },
            {
                $match: { "goods.category": category },
            },
        ]);
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);



    return res.status(200).json({
        filterpos
    });
})



exports.getSubCategoryprofit = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result

    const { userassignedlocation, role, businessid, subcategory } = req.body


    try {
        pos1 = await Pos.aggregate([
            {
                $match: { assignbusinessid: businessid },
            },
            {
                $unwind: "$goods",
            },
            {
                $match: { "goods.subcategory": subcategory },
            },
        ]);
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);



    return res.status(200).json({
        filterpos
    });
})





exports.getlocationprofitindivdual = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result


    const { userassignedlocation, role, businessid, location } = req.body


    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, location: { $eq: location }, })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);



    return res.status(200).json({
        filterpos
    });
})




// exports.getItemSearchProducts = catchAsyncErrors(async (req, res, next) => {
//     let pos1;
//     let result
//     let startdate = new Date()
//     const formattedDate = moment(startdate).format('YYYY-MM-DD');

//     const { userassignedlocation, role, businessid, product, } = req.body


//     try {
//         pos1 = await Pos.find({  assignbusinessid: businessid,  formatedate: "2023-05-16", goods:[{ productname :  product}] })
//     } catch (err) {
//         console.log(err.message); 
//     }
//     if (!pos1) {
//         return next(new ErrorHandler('Sale not found!', 404));
//     }

//     result = pos1.map((data, index) => {
//         if (role == 'Admin') {
//             return data.goods
//         } else if (userassignedlocation.includes(data.businesslocation)) {
//             return data.goods
//         }
//     })

//     let filterpos = result.reduce((accumulator, currentArray) => {
//         return accumulator.concat(currentArray);
//     }, []);



//     return res.status(200).json({
//         filterpos
//     });
// })

exports.getItemSearchProducts = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result
    let startdate = new Date()
    const formattedDate = moment(startdate).format('YYYY-MM-DD');

    const { userassignedlocation, role, businessid, product, } = req.body

    try {
        pos1 = await Pos.aggregate([
            {
                $match: { assignbusinessid: businessid },
            },
            {
                $unwind: "$goods",
            },
            {
                $match: { "goods.productname": product },
            },
        ]);
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return res.status(200).json({
        filterpos
    });
})

exports.getItemLocation = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result

    const { userassignedlocation, role, businessid, location, } = req.body

    try {
        pos1 = await Pos.find({ assignbusinessid: businessid, location: { $eq: location } })
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);

    return res.status(200).json({
        filterpos
    });
})



exports.getItemProduct = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result

    const { userassignedlocation, role, businessid, product } = req.body

    try {
        pos1 = await Pos.aggregate([
            {
                $match: { assignbusinessid: businessid },
            },
            {
                $unwind: "$goods",
            },
            {
                $match: { "goods.productname": product },
            },

        ]);
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    result = pos1.map((data, index) => {
        if (role == 'Admin') {
            return data.goods
        } else if (userassignedlocation.includes(data.businesslocation)) {
            return data.goods
        }
    })

    let filterpos = result.reduce((accumulator, currentArray) => {
        return accumulator.concat(currentArray);
    }, []);



    return res.status(200).json({
        filterpos
    });
})

// get All Purchases => /api/productpurchases sellRoute.route('/poscatefilter').post(getAllPosCategory);
exports.getAllPosCategory = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    try {
        pos1 = await Pos.find({ location: { $eq: req.body.busilocation } })
        console.log(pos1);
    } catch (err) {
        console.log(err.message);
    }
    if (!pos1) {
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        pos1
    });
})