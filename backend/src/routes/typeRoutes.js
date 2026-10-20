const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController');

router.get('/', typeController.getTypes);          // getAll
router.get('/:id', typeController.getTypeById);    // getById
router.post('/', typeController.createType);       // Create
router.put('/:id', typeController.updateType);     // Update
router.delete('/:id', typeController.deleteType); // Delete

module.exports = router;
