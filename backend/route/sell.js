const express = require('express');
const sellRoute = express.Router();

// connect Drafts controller
const { getAllDrafts, addDraft, updateDraft, getSingleDraft, deleteDraft } = require('../controller/modules/sell/draft');

sellRoute.route('/drafts').post(getAllDrafts);
sellRoute.route('/draft/new').post(addDraft);
sellRoute.route('/draft/:id').get(getSingleDraft).put(updateDraft).delete(deleteDraft);

// connect Quoation controller
const { getAllQuotations, addQuotation, updateQuotation, getSingleQuotation, deleteQuotation } = require('../controller/modules/sell/quotation');

sellRoute.route('/quotations').post(getAllQuotations);
sellRoute.route('/quotation/new').post(addQuotation);
sellRoute.route('/quotation/:id').get(getSingleQuotation).put(updateQuotation).delete(deleteQuotation);

// pos bill
const { getAllPos, getAllProductSales, addPos, getSinglePos, updatePos, deletePos, getItemProduct, getItemSearchProducts, getItemLocation, getlocationprofitindivdual, getSubCategoryprofit, getCategoryWiseprofit, getCurrentYearwiseprofit, getYearWiseProfit, getWeekWseProfit, getMonthWiseProfit, getDaywiseProfit, getAllPosCategory,
    getPosdatefilter, getTodaypos } = require('../controller/modules/sell/pos');

sellRoute.route('/pos').post(getAllPos);
sellRoute.route('/salesproducts').get(getAllProductSales);
sellRoute.route('/pos/new').post(addPos);
sellRoute.route('/pos/:id').get(getSinglePos).put(updatePos).delete(deletePos);
sellRoute.route('/itemproduct').post(getItemProduct);
sellRoute.route('/itemsearch').post(getItemSearchProducts);
sellRoute.route('/itemwiselocation').post(getItemLocation);
sellRoute.route('/locindiprofit').post(getlocationprofitindivdual);
sellRoute.route('/subcateprofit').post(getSubCategoryprofit);
sellRoute.route('/catewiseprofit').post(getCategoryWiseprofit);
sellRoute.route('/currentyearprofit').post(getCurrentYearwiseprofit);
sellRoute.route('/yearwiseprofit').post(getYearWiseProfit);
sellRoute.route('/weekwiseprofit').post(getWeekWseProfit);
sellRoute.route('/monthwiseprofit').post(getMonthWiseProfit);
sellRoute.route('/daywiseprofit').post(getDaywiseProfit);
sellRoute.route('/poscatefilter').post(getAllPosCategory);
sellRoute.route('/posdatefilter').post(getPosdatefilter);
sellRoute.route('/postoday').post(getTodaypos);


module.exports = sellRoute;