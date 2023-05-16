const express = require('express');
const transferRoute = express.Router();

//Assigned Management 
const { getAllTransfers,getSingleTransfer,getAllTransfersStatus,deleteTransfer,updateTransfer,addTransfer} = require('../controller/modules/stock/transfer');
transferRoute.route('/transfers').get(getAllTransfers);
transferRoute.route('/transfersstatus').get(getAllTransfersStatus);
transferRoute.route('/transfer/new').post(addTransfer);
transferRoute.route('/transfer/:id').get(getSingleTransfer).put(updateTransfer).delete(deleteTransfer);

module.exports = transferRoute;