const express = require('express');
const router = express.Router();
const {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} = require('../controllers/promotionController');

//api lay dsach promotion
router.get('/', getPromotions);

//api create promotion
router.post('/', createPromotion);

//api update promotion
router.put('/:id', updatePromotion);

//api delete promotion
router.delete('/:id', deletePromotion);

module.exports = router;