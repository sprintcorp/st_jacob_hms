const express = require("express");
const {
    getReservations,
    getReservation,
    createReservation,
    deleteReservation
} = require('../controller/reservation');
const router = express.Router();
const Reservation = require('../model/Reservation');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), advancedResults(Reservation, 'room'), getReservations).post(createReservation);
router.route('/:id').get(protect, authorize('admin'), getReservation).delete(protect, authorize('admin'), deleteReservation);


module.exports = router;