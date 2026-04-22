const express = require('express');
const router = express.Router();
const {
  getCombos,
  getComboById,
  getCombosWithPromotions,
  getFinalPrice,
  createCombo,
  updateCombo,
  deleteCombo,
} = require('../controllers/comboController');

//api create combo
router.post('/', createCombo);

//api update combo
router.put('/:id', updateCombo);

//api delete combo
router.delete('/:id', deleteCombo);

//api search/filter (important)
router.get('/', getCombos);

//api lay combo kem promotion
router.get('/with-promotions', getCombosWithPromotions);

//api tinh gia combo theo so nguoi
router.get('/:id/final-price', getFinalPrice);

//get combo theo id:
router.get('/:id', getComboById);

module.exports = router;