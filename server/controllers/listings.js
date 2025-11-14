const pool = require('../db/pool')

// GET all listings
const getAllListings = async (req, res) => {
  try {
    const results = await pool.query(`
      SELECT l.*, u.username as seller_username, u.avatarurl as seller_avatar, c.name as category_name
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN categories c ON l.category_id = c.id
      ORDER BY l.created_at DESC
    `)
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET single listing
const getListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query(`
      SELECT l.*, u.username as seller_username, u.avatarurl as seller_avatar, c.name as category_name
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE l.id = $1
    `, [id])
    
    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST new listing
const createListing = async (req, res) => {
  try {
    const { title, description, price, category_id, pickup_notes, location, image_url } = req.body
    const seller_id = req.user ? req.user.id : null
    
    if (!seller_id) {
      return res.status(401).json({ error: 'Must be logged in to create listing' })
    }
    
    const results = await pool.query(`
      INSERT INTO listings (seller_id, category_id, title, description, price, pickup_notes, location, image_url, is_available)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true)
      RETURNING *
    `, [seller_id, category_id || null, title, description || '', price || 0, pickup_notes || '', location || '', image_url || ''])
    
    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// PATCH update listing
const updateListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const { title, description, price, category_id, pickup_notes, location, image_url, is_available } = req.body
    
    // Check ownership
    const ownerCheck = await pool.query('SELECT seller_id FROM listings WHERE id = $1', [id])
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    if (req.user && ownerCheck.rows[0].seller_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this listing' })
    }
    
    const results = await pool.query(`
      UPDATE listings
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          price = COALESCE($3, price),
          category_id = COALESCE($4, category_id),
          pickup_notes = COALESCE($5, pickup_notes),
          location = COALESCE($6, location),
          image_url = COALESCE($7, image_url),
          is_available = COALESCE($8, is_available)
      WHERE id = $9
      RETURNING *
    `, [title, description, price, category_id, pickup_notes, location, image_url, is_available, id])
    
    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// DELETE listing
const deleteListing = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    
    // Check ownership
    const ownerCheck = await pool.query('SELECT seller_id FROM listings WHERE id = $1', [id])
    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found' })
    }
    if (req.user && ownerCheck.rows[0].seller_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' })
    }
    
    // Delete associated favorites first
    await pool.query('DELETE FROM favorites WHERE listing_id = $1', [id])
    
    await pool.query('DELETE FROM listings WHERE id = $1', [id])
    
    res.status(200).json({ message: 'Listing deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET listings by seller
const getSellerListings = async (req, res) => {
  try {
    const seller_id = req.user ? req.user.id : null
    if (!seller_id) {
      return res.status(401).json({ error: 'Must be logged in' })
    }
    
    const results = await pool.query(`
      SELECT l.*, c.name as category_name
      FROM listings l
      LEFT JOIN categories c ON l.category_id = c.id
      WHERE l.seller_id = $1
      ORDER BY l.created_at DESC
    `, [seller_id])
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getSellerListings
}
