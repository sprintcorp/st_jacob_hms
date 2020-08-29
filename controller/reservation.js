const Reservation = require("../model/Reservation");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require('path');


//@desc Get all reservations
//@route GET /api/v1/reservations
//@access Private
exports.getReservations = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});


//@desc Get reservations
//@route GET /api/v1/reservations/:id
//@access Private
exports.getReservation = asyncHandler(async(req, res, next) => {
    const reservation = await Reservation.findById(req.params.id).populate('room');
    if (!reservation) {
        // res.status(404).json({success:false,data:error.message})
        return next(
            new ErrorResponse(`reservation not found with id of ${req.params.id}`, 404)
        );
    }
    res.status(200).json({ success: true, data: reservation });
});


//@desc  Create new reservations
//@route POST /api/v1/reservations
//@access Public
exports.createReservation = asyncHandler(async(req, res, next) => {
    const reservation = await Reservation.create(req.body);
    res.status(201).json({ success: true, data: reservation });
});


//@desc Delete reservations
//@route DELETE /api/v1/reservations/:id
//@access Private
exports.deleteReservation = asyncHandler(async(req, res, next) => {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
        return next(
            new ErrorResponse(`Reservation not found with id of ${req.params.id}`, 404)
        );
    }
    // Make ure user is an admin
    if (req.user.role !== 'admin') {
        return next(
            new ErrorResponse(`User is not authoried to update Reservation`, 403)
        );
    }
    reservation.remove();
    res
        .status(200)
        .json({ success: true, data: "Reservation Successfully deleted" });
});