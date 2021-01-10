const express = require('express');
const router = express.Router();
const { create } = require('../controllers/product');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { productById, read, remove, update, list, relatedList, listCategory } = require('../controllers/product');


router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.get('/product/:productId', read);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove);
router.post('/product/update/:productId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/products', list);
router.get('/products/related/:productId', relatedList);
router.get('/products/categories', listCategory);

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;