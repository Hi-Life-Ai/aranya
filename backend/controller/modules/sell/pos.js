const Pos = require('../../../model/modules/sell/pos');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const path = require('path')
var nodemailer = require('nodemailer');

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
//    let apos = await Pos.create(req.body); 
  
  let tableContent = '<table style="padding:10px;">';
  tableContent += '<tr><th>ITEM</th><th> MRP</th><th> UNIT PRICE</th><th> QUANTITY</th><th> NET PRICE</th><th> GST</th><th> HSN</th><th> TOTAL</th></tr>';
  
  req.body.goods.forEach(row => {
    tableContent += `<tr><td>${row.productname}</td><td>${' '+row.mrp}</td><td>${' '+row.sellingvalue}</td><td>${' '+row.quantity}</td><td>${' '+row.netrate}</td><td>${' '+row.taxtareval}</td><td>${'  '+row.hsn}</td><td>${'  '+row.subtotal}</td></tr>`;
  });
  
  tableContent += '</table>';
  
  const emailContent = `
    <h3>ARANYA INVOICE LAYOUT</h3>
    <div style="display:flex;">
        <div style="justify-content:flex-start;">
            <h4><b>COMPANY DETAILS</b><h4>
            <p><b>Name:</b>${req.body.company}</p>
            <p><b>Address:</b>${req.body.companyaddress}</p>
            <p><b>GSTN:</b>${req.body.gstn}</p>
            <p><b>Contact person:</b>${req.body.companycontactpersonname+'/'+req.body.companycontactpersonnumber}</p><br>
            <p><b>Order Number:</b>${req.body.referenceno}</p>
            <p><b>Order Date:</b>${req.body.date}</p>
            <p><b>Salesman:</b>${req.body.salesman+'/'+req.body.salesmannumber}</p>
        </div>
        <div style="justify-content:flex-end;">
            <h4><b>DELIVERY DETAILS</b></h4>
            <p><b>Name:</b>${req.body.location}</p>
            <p><b>Address:</b>${req.body.deliveryaddress}</p>
            <p><b>GSTN:</b>${req.body.deliverygstn}</p>
            <p><b>Contact person:</b>${req.body.deliverycontactpersonname+'/'+req.body.deliverycontactpersonnumber}</p><br>
            <h4><b>TRANSPORT DETAILS</b></h4>
            <p><b>Driver Name:</b>${req.body.drivername}</p>
            <p><b>No:</b>${req.body.drivernumber}</p>
            <p><b>Contact No:</b>${req.body.drivernphonenumber}</p><br>
            <p><b>Invoice Number:</b>${req.body.referenceno}</p>
            <p><b>Invoice Date:</b>${req.body.date}</p>
        </div>
    </div
    ${tableContent}
    <h3>Net Total: ${req.body.grandtotal}</h3>
    <div style="display:flex;">
        <div style="justify-content:flex-start;">
            <p><b>Net Tax:</b>${req.body.totalnettax}</p>
            <p><b>No. of Items:</b>${req.body.totalitems}</p>
            <p><b>Total Items:</b>${req.body.totalproducts}</p><br>
            <p><b>Bank Name:</b>${req.body.bankname}</p>
            <p><b>Acc No:</b>${req.body.accountnumber}</p>
            <p><b>IFSC Code:</b>${req.body.ifsccode}</p>
        </div>
        <div style="justify-content:flex-end;">
            <br><br><br><br><br><br><br><br>
            <img src=${req.body.signature}>
            <p><b>Authorized Signatory</b></p>
        </div>
    </div>
  `;

   // send mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cshankari27@gmail.com',
        pass: 'vqhzwuklzypwruyu',
    }
  });

  const mailOptions = {
    from: 'clockinout@example.com',
    to: "ragubyrenuga2000@gmail.com",
    subject: 'ARANYA HEALTHCARE | INVOICE',
    html: emailContent
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        res.status(500).send('Error sending email');
    } else {
        console.log('Email sent');
        res.status(200).send('Email sent successfully');
    }
});

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