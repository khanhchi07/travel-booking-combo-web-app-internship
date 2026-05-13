const pool = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');

//api search/filter cho user (chi lay combo active)
const getCombos = async (req, res) => {
  try {
    const {
      region,
      destination,
      minPrice,
      maxPrice,
      combo_type
    } = req.query;

    let query = "SELECT * FROM combos WHERE status = 'active'";
    let values = [];

    if (region) {
      values.push(region);
      query += ` AND region = $${values.length}`;
    }

    if (destination) {
      values.push(destination);
      query += ` AND destination = $${values.length}`;
    }

    // filter theo combo type
    if (combo_type) {
      values.push(combo_type);
      query += `
        AND LOWER(combo_type)
        = LOWER($${values.length})
      `;
    }

    if (minPrice) {
      values.push(minPrice);
      query += ` AND original_price >= $${values.length}`;
    }

    if (maxPrice) {
      values.push(maxPrice);
      query += ` AND original_price <= $${values.length}`;
    }

    query += ' ORDER BY combo_id DESC';

    const result = await pool.query(query, values);
    return successResponse(res, result.rows, 'Combos fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api lay toan bo combos cho admin (gom ca active va inactive)
const getAllCombosAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM combos ORDER BY combo_id DESC'
    );

    return successResponse(res, result.rows, 'All combos fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//get combo theo id kem danh sach promotions
const getComboById = async (req, res) => {
  try {
    const { id } = req.params;

    // lay thong tin combo
    const comboResult = await pool.query(
      `
      SELECT *
      FROM combos
      WHERE combo_id = $1
      `,
      [id]
    );

    if (comboResult.rows.length === 0) {
      return errorResponse(res, 'Combo not found', 404);
    }

    // lay danh sach promotion dang gan voi combo
    const promotionResult = await pool.query(
      `
      SELECT
        p.promotion_id,
        p.title,
        p.discount_type,
        p.discount_value,
        p.start_date,
        p.end_date,
        p.min_people,
        p.max_people,
        p.is_active
      FROM promotions p
      JOIN combo_promotions cp
        ON p.promotion_id = cp.promotion_id
      WHERE cp.combo_id = $1
      ORDER BY p.promotion_id DESC
      `,
      [id]
    );

    return successResponse(
      res,
      {
        combo: comboResult.rows[0],
        promotions: promotionResult.rows
      },
      'Combo fetched successfully'
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api lay combo kem promotion
const getCombosWithPromotions = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.combo_id,
        c.title AS combo_title,
        c.destination,
        c.region,
        c.original_price,
        p.promotion_id,
        p.title AS promotion_title,
        p.discount_type,
        p.discount_value,
        p.start_date,
        p.end_date,
        p.min_people,
        p.max_people,
        p.is_active
      FROM combos c
      LEFT JOIN combo_promotions cp ON c.combo_id = cp.combo_id
      LEFT JOIN promotions p ON cp.promotion_id = p.promotion_id
      ORDER BY c.combo_id DESC
    `);

    return successResponse(res, result.rows, 'Combos with promotions fetched successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api tinh gia combo theo so nguoi
const getFinalPrice = async (req, res) => {
  try {
    const { id } = req.params;
    const { number_of_people } = req.query;

    if (!number_of_people) {
      return errorResponse(res, 'number_of_people is required', 400);
    }

    const comboResult = await pool.query(
      'SELECT * FROM combos WHERE combo_id = $1',
      [id]
    );

    if (comboResult.rows.length === 0) {
      return errorResponse(res, 'Combo not found', 404);
    }

    const combo = comboResult.rows[0];

    const promoResult = await pool.query(
      `SELECT p.*
       FROM promotions p
       JOIN combo_promotions cp ON p.promotion_id = cp.promotion_id
       WHERE cp.combo_id = $1
         AND p.is_active = TRUE
         AND CURRENT_DATE BETWEEN p.start_date AND p.end_date
         AND p.min_people <= $2
         AND (p.max_people IS NULL OR p.max_people >= $2)
       ORDER BY p.discount_value DESC
       LIMIT 1`,
      [id, number_of_people]
    );

    let appliedPromotion = null;
    let discountAmount = 0;
    let finalPrice = Number(combo.original_price);

    if (promoResult.rows.length > 0) {
      appliedPromotion = promoResult.rows[0];

      if (appliedPromotion.discount_type === 'percentage') {
        discountAmount =
          (Number(combo.original_price) * Number(appliedPromotion.discount_value)) / 100;
      } else if (appliedPromotion.discount_type === 'fixed_amount') {
        discountAmount = Number(appliedPromotion.discount_value);
      }

      finalPrice = Number(combo.original_price) - discountAmount;
    }

    return successResponse(
      res,
      {
        combo_id: combo.combo_id,
        combo_title: combo.title,
        original_price: Number(combo.original_price),
        number_of_people: Number(number_of_people),
        applied_promotion: appliedPromotion,
        discount_amount: discountAmount,
        final_price: finalPrice
      },
      'Final price calculated successfully'
    );
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api create combo
const createCombo = async (req, res) => {
  try {
    const {
      title,
      destination,
      region,
      description,
      duration_days,
      duration_nights,
      accommodation_type,
      accommodation_name,
      original_price,
      image_url,
      status,
      created_by,

      // thong tin mo rong cua combo
      transportation,
      included_services,
      excluded_services,
      highlights,
      itinerary,
      combo_type
    } = req.body;

    // validate field bat buoc
    if (
      !title ||
      !destination ||
      !region ||
      !duration_days ||
      original_price == null
    ) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const result = await pool.query(
      `INSERT INTO combos
      (
        title,
        destination,
        region,
        description,
        duration_days,
        duration_nights,
        accommodation_type,
        accommodation_name,
        original_price,
        image_url,
        status,
        created_by,
        transportation,
        included_services,
        excluded_services,
        highlights,
        itinerary,
        combo_type
      )
      VALUES
      (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18
      )
      RETURNING *`,
      [
        title,
        destination,
        region,
        description || null,
        duration_days,
        duration_nights || null,
        accommodation_type || null,
        accommodation_name || null,
        original_price,
        image_url || null,
        status || 'active',
        created_by || null,
        transportation || null,
        included_services || null,
        excluded_services || null,
        highlights || null,
        itinerary || null,
        combo_type || null
      ]
    );

    return successResponse(res, result.rows[0], 'Combo created successfully', 201);
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api update combo
const updateCombo = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      destination,
      region,
      description,
      duration_days,
      duration_nights,
      accommodation_type,
      accommodation_name,
      original_price,
      image_url,
      status,

      // thong tin mo rong cua combo
      transportation,
      included_services,
      excluded_services,
      highlights,
      itinerary,
      combo_type
    } = req.body;

    // validate field bat buoc
    if (
      !title ||
      !destination ||
      !region ||
      !duration_days ||
      original_price == null
    ) {
      return errorResponse(res, 'Missing required fields', 400);
    }

    const result = await pool.query(
      `UPDATE combos
       SET title = $1,
           destination = $2,
           region = $3,
           description = $4,
           duration_days = $5,
           duration_nights = $6,
           accommodation_type = $7,
           accommodation_name = $8,
           original_price = $9,
           image_url = $10,
           status = $11,
           transportation = $12,
           included_services = $13,
           excluded_services = $14,
           highlights = $15,
           itinerary = $16,
           combo_type = $17,
           updated_at = CURRENT_TIMESTAMP
       WHERE combo_id = $18
       RETURNING *`,
      [
        title,
        destination,
        region,
        description || null,
        duration_days,
        duration_nights || null,
        accommodation_type || null,
        accommodation_name || null,
        original_price,
        image_url || null,
        status || 'active',
        transportation || null,
        included_services || null,
        excluded_services || null,
        highlights || null,
        itinerary || null,
        combo_type || null,
        id
      ]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Combo not found', 404);
    }

    return successResponse(res, result.rows[0], 'Combo updated successfully');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};

//api delete combo (soft delete -> set inactive)
const deleteCombo = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE combos
       SET status = 'inactive',
           updated_at = CURRENT_TIMESTAMP
       WHERE combo_id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 'Combo not found', 404);
    }

    return successResponse(res, result.rows[0], 'Combo deleted successfully (soft delete)');
  } catch (err) {
    console.error(err);
    return errorResponse(res, 'Server error', 500);
  }
};


module.exports = {
  getCombos,
  getAllCombosAdmin,
  getComboById,
  getCombosWithPromotions,
  getFinalPrice,
  createCombo,
  updateCombo,
  deleteCombo,
};
