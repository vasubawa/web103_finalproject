const express = require('express')
const { createTripUser, getTripUsers, getUserTrips } = require('../controllers/users-trips')

const router = express.Router()

router.post('/create/:trip_id', createTripUser)
router.get('/users/:trip_id', getTripUsers)
router.get('/trips/:username', getUserTrips)

module.exports = router
