const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', menuController.getMenus);          // getAll (+ ?keyword=&typeId=)
router.get('/:id', menuController.getMenuById);    // getById
router.post('/', verifyToken, isAdmin, menuController.createMenu);       // Create (admin)
router.put('/:id', verifyToken, isAdmin, menuController.updateMenu);     // Update (admin)
router.delete('/:id', verifyToken, isAdmin, menuController.deleteMenu);  // Delete (admin)

module.exports = router;
