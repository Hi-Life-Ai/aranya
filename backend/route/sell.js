const express = require('express');
const sellRoute = express.Router();

// connect Drafts controller
const { getAllDrafts,addDraft,updateDraft,getSingleDraft,deleteDraft } = require('../controller/modules/sell/draft');

sellRoute.route('/drafts').get(getAllDrafts);
sellRoute.route('/draft/new').post(addDraft);
sellRoute.route('/draft/:id').get(getSingleDraft).put(updateDraft).delete(deleteDraft);

// connect Quoation controller
const { getAllQuotations,addQuotation,updateQuotation,getSingleQuotation,deleteQuotation } = require('../controller/modules/sell/quotation');

sellRoute.route('/quotations').get(getAllQuotations);
sellRoute.route('/quotation/new').post(addQuotation);
sellRoute.route('/quotation/:id').get(getSingleQuotation).put(updateQuotation).delete(deleteQuotation);

// pos bill
const { getAllPos,getAllProductSales,addPos,getSinglePos,updatePos,deletePos } = require('../controller/modules/sell/pos');

sellRoute.route('/pos').get(getAllPos);
sellRoute.route('/salesproducts').get(getAllProductSales);
sellRoute.route('/pos/new').post(addPos);
sellRoute.route('/pos/:id').get(getSinglePos).put(updatePos).delete(deletePos);


module.exports = sellRoute;