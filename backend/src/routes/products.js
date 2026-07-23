const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public endpoints
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Temporary (development)
// We'll restore authentication after implementing admin login.
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;