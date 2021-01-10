const express = require('express');
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { categoryById, create, read, update, remove, list } = require('../controllers/category');

router.post('/category/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/category/read/:categoryId', read);
router.put('/category/update/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/category/delete/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);
router.get('/category/list', list);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;