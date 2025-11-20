const express = require('express');
const route = express.Router();
const userController = require('../controllers/userController');
const checkUserAuth = require('../middleware/auth-middleware');



route.post('/', userController.create);
route.put('/:id', userController.updateUser);
route.delete('/:id', userController.deleteUser);
route.get('/:id', userController.getUser);
// route.get('/', userController.getAllUsers);
route.get('/', userController.getUsers);
route.post('/login', userController.userLogin);
route.patch('/changepassword', checkUserAuth, userController.changepassword);

module.exports = route;