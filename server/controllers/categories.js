const pool = require('../db/pool')

// GET all categories
const getAllCategories = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM categories ORDER BY name ASC')
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST new category (admin only, but simplified for now)
const createCategory = async (req, res) => {
  try {
    const { name } = req.body
    const results = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    )
    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

module.exports = {
  getAllCategories,
  createCategory
}
