const express = require('express')
const {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  getSellerListings
} = require('../controllers/listings')

const router = express.Router()

router.get('/', getAllListings)
router.get('/my-listings', getSellerListings)
router.get('/:id', getListing)
router.post('/', createListing)
router.patch('/:id', updateListing)
router.delete('/:id', deleteListing)

module.exports = router
