const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/:itemKey', cartController.updateCartItem);
router.delete('/:itemKey', cartController.removeFromCart);

module.exports = router;