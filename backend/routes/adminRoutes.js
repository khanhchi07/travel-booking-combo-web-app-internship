const express = require('express');
const router = express.Router();

const { getAllCombosAdmin } = require('../controllers/comboController');
const { getAllPromotionsAdmin } = require('../controllers/promotionController');

//api lay toan bo combos cho admin
router.get('/combos', getAllCombosAdmin);

//api lay toan bo promotions cho admin
router.get('/promotions', getAllPromotionsAdmin);

module.exports = router;