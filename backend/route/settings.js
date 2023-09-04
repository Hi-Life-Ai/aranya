const express = require('express');
const settingRoute = express.Router();

// connect business settings controller
const { getAllBusisetng, addBusisetng, updateBusisetng, deleteBusisetng, getSingleBusisetng, getSingleAuthBusisetng } = require('../controller/modules/settings/busisettings');

settingRoute.route('/busisetngs').get(getAllBusisetng);
settingRoute.route('/busisetng/new').post(addBusisetng);
settingRoute.route('/authbusisetng').post(getSingleAuthBusisetng);
settingRoute.route('/busisetng/:id').get(getSingleBusisetng).put(updateBusisetng).delete(deleteBusisetng);

// connect business location controller
const { getAllBusinessloc, addBusinessloc, updateBusinessloc, getSingleBusinessloc, deleteBusinessloc } = require('../controller/modules/settings/businesslocation');

settingRoute.route('/businesslocations').post(getAllBusinessloc);
settingRoute.route('/businesslocation/new').post(addBusinessloc);
settingRoute.route('/businesslocation/:id').get(getSingleBusinessloc).put(updateBusinessloc).delete(deleteBusinessloc);

// connect taxrate controller
const { getAllTaxrate, addTaxrate, updateTaxrate, getSingleTaxrate, deleteTaxrate } = require('../controller/modules/settings/taxrate');

settingRoute.route('/taxrates').post(getAllTaxrate);
settingRoute.route('/taxrate/new').post(addTaxrate);
settingRoute.route('/taxrate/:id').get(getSingleTaxrate).put(updateTaxrate).delete(deleteTaxrate);

module.exports = settingRoute;
