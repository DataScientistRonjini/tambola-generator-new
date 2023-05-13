const express = require('express')

const router = express.Router()
const {
  createTickets,
  getAllTickets
} = require('../controllers/tambola')

router.route('/create').post(createTickets)
router.route('/fetch').get(getAllTickets)

module.exports = router
