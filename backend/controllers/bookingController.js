const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

//api post booking request (test = thunder client)
const createBookingRequest = async (req, res) => {
  try {
    const {
      combo_id,
      customer_name,
      email,
      phone,
      travel_date,
      number_of_people,
      message,
      request_type
    } = req.body;

    if (
      !combo_id ||
      !customer_name ||
      !email ||
      !phone ||
      !travel_date ||
      !number_of_people ||
      !request_type
    ) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const result = await pool.query(
      `INSERT INTO booking_requests
      (combo_id, customer_name, email, phone, travel_date, number_of_people, message, request_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        combo_id,
        customer_name,
        email,
        phone,
        travel_date,
        number_of_people,
        message || null,
        request_type
      ]
    );

    return successResponse(res, result.rows[0], 'Booking request created successfully', 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api get dsach booking request cho admin
//api xem toan bo booking request
const getBookingRequests = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM booking_requests ORDER BY request_id DESC'
    );
    return successResponse(res, result.rows, 'Booking requests fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api udate trang thai request (customer send request -> admin handle -> change status)
const updateBookingRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return errorResponse(res, 'Status is required', 400);
    }

    if (!['pending', 'contacted', 'closed'].includes(status)) {
      return errorResponse(res, 'Invalid status', 400);
    }

    const result = await pool.query(
      `UPDATE booking_requests
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE request_id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Request not found', 404);
    }

    return successResponse(res, result.rows[0], 'Booking request status updated successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

module.exports = {
  createBookingRequest,
  getBookingRequests,
  updateBookingRequestStatus,
};