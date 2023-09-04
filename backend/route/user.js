const express = require('express');
const userRoute = express.Router();

// connect role controller
const { getAllRoles, getAllAuthRoles, addRole, updateRole, getSingleRole, deleteRole } = require('../controller/modules/user/role');

userRoute.route('/roles').post(getAllRoles);
userRoute.route('/role/new').post(addRole);
userRoute.route('/authrole').post(getAllAuthRoles);
userRoute.route('/role/:id').get(getSingleRole).put(updateRole).delete(deleteRole);

// connect role controller
const { getAllDepartment, addDepartmrnt, getSingleDepartment, updateDepartment, deleteDepartment } = require('../controller/modules/user/department');

userRoute.route('/departments').post(getAllDepartment);
userRoute.route('/department/new').post(addDepartmrnt);
userRoute.route('/department/:id').get(getSingleDepartment).put(updateDepartment).delete(deleteDepartment);

module.exports = userRoute;
