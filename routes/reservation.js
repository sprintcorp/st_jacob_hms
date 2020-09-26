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

router.route('/').get(protect, advancedResults(Reservation, 'room'), getReservations).post(createReservation);
router.route('/:id').get(protect, getReservation).delete(protect, deleteReservation);


module.exports = router;