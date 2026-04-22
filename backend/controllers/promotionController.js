const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

//api lay dsach promotion cho user (chi lay promotion active)
const getPromotions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM promotions WHERE is_active = true ORDER BY promotion_id DESC'
    );
    return successResponse(res, result.rows, 'Promotions fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api lay toan bo promotions cho admin (gom ca active va inactive)
const getAllPromotionsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM promotions ORDER BY promotion_id DESC'
    );
    return successResponse(res, result.rows, 'All promotions fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api create promotion
const createPromotion = async (req, res) => {
  try {
    const {
      title,
      discount_type,
      discount_value,
      start_date,
      end_date,
      min_people,
      max_people,
      is_active,
      created_by
    } = req.body;

    if (
      !title ||
      !discount_type ||
      discount_value == null ||
      !start_date ||
      !end_date ||
      min_people == null
    ) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    if (!['percentage', 'fixed_amount'].includes(discount_type)) {
      return errorResponse(res, 'Invalid discount_type', 400);
    }

    const result = await pool.query(
      `INSERT INTO promotions
      (title, discount_type, discount_value, start_date, end_date, min_people, max_people, is_active, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
      [
        title,
        discount_type,
        discount_value,
        start_date,
        end_date,
        min_people,
        max_people || null,
        is_active ?? true,
        created_by || null
      ]
    );

    return successResponse(res, result.rows[0], 'Promotion created successfully', 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api update promotion
const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      discount_type,
      discount_value,
      start_date,
      end_date,
      min_people,
      max_people,
      is_active
    } = req.body;

    if (
      !title ||
      !discount_type ||
      discount_value == null ||
      !start_date ||
      !end_date ||
      min_people == null
    ) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    if (!['percentage', 'fixed_amount'].includes(discount_type)) {
      return errorResponse(res, 'Invalid discount_type', 400);
    }

    const result = await pool.query(
      `UPDATE promotions
       SET title = $1,
           discount_type = $2,
           discount_value = $3,
           start_date = $4,
           end_date = $5,
           min_people = $6,
           max_people = $7,
           is_active = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE promotion_id = $9
       RETURNING *`,
      [
        title,
        discount_type,
        discount_value,
        start_date,
        end_date,
        min_people,
        max_people || null,
        is_active ?? true,
        id
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Promotion not found', 404);
    }

    return successResponse(res, result.rows[0], 'Promotion updated successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api delete promotion (soft delete -> set is_active = false)
const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE promotions
       SET is_active = false,
           updated_at = CURRENT_TIMESTAMP
       WHERE promotion_id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Promotion not found', 404);
    }

    return successResponse(res, result.rows[0], 'Promotion deleted successfully (soft delete)');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

module.exports = {
  getPromotions,
  getAllPromotionsAdmin,
  createPromotion,
  updatePromotion,
  deletePromotion,
};