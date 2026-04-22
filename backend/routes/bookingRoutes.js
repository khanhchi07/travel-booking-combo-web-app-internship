const express = require('express');
const router = express.Router();
const {
  createBookingRequest,
  getBookingRequests,
  updateBookingRequestStatus,
} = require('../controllers/bookingController');

//api post booking request (test = thunder client)
router.post('/', createBookingRequest);

//api get dsach booking request cho admin
//api xem toan bo booking request
router.get('/', getBookingRequests);

//api udate trang thai request (customer send request -> admin handle -> change status)
router.put('/:id/status', updateBookingRequestStatus);

module.exports = router;