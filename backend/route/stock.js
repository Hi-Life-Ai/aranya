const express = require('express');
const transferRoute = express.Router();

//Assigned Management 
const { getAllTransfers, getSingleTransfer, getAllTransfersStatus, deleteTransfer, updateTransfer, addTransfer, getTransferReporttoday, getAdjustReportToday, getRejectReport, getRejectReportToday, getTransferReport, getAdjustReport,
    getAllLocaTransfer, getAllTransfersData, getAllAdjustData } = require('../controller/modules/stock/transfer');
transferRoute.route('/transfers').get(getAllTransfers);
transferRoute.route('/transfersstatus').get(getAllTransfersStatus);
transferRoute.route('/transfer/new').post(addTransfer);
transferRoute.route('/transfer/:id').get(getSingleTransfer).put(updateTransfer).delete(deleteTransfer);
transferRoute.route('/todayadjust').post(getTransferReporttoday);
transferRoute.route('/todaytransfers').post(getAdjustReportToday);
transferRoute.route('/rejectreport').post(getRejectReport);
transferRoute.route('/todayreject').post(getRejectReportToday);
transferRoute.route('/transeferreport').post(getTransferReport);
transferRoute.route('/adjustreport').post(getAdjustReport);
transferRoute.route('/transferlocationwise').post(getAllLocaTransfer);
transferRoute.route('/alltransfers').post(getAllTransfersData);
transferRoute.route('/alladjusts').post(getAllAdjustData);

module.exports = transferRoute;