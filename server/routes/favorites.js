const express = require('express')
const { getUserFavorites, addFavorite, removeFavorite } = require('../controllers/favorites')

const router = express.Router()

router.get('/', getUserFavorites)
router.post('/:listing_id', addFavorite)
router.delete('/:listing_id', removeFavorite)

module.exports = router
