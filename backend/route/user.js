const express = require('express');
const userRoute = express.Router();

// connect role controller
const { getAllRoles,addRole,updateRole,getSingleRole,deleteRole } = require('../controller/modules/user/role');

userRoute.route('/roles').get(getAllRoles);
userRoute.route('/role/new').post(addRole);
userRoute.route('/role/:id').get(getSingleRole).put(updateRole).delete(deleteRole);

// connect role controller
const { getAllDepartment,addDepartmrnt,getSingleDepartment,updateDepartment,deleteDepartment } = require('../controller/modules/user/department');

userRoute.route('/departments').get(getAllDepartment);
userRoute.route('/department/new').post(addDepartmrnt);
userRoute.route('/department/:id').get(getSingleDepartment).put(updateDepartment).delete(deleteDepartment);

module.exports = userRoute;
