const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Please add a firstname']
    },
    lastname: {
        type: String,
        required: [true, 'Please add a lastname']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: false,
        match: [
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please add a valid email",
        ],
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number can not be more than 20 characters"],
    },

    address: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },
    room: {
        type: mongoose.Schema.ObjectId,
        ref: 'Room',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});



// ReservationSchema.virtual('room', {
//     ref: 'Room',
//     localField: '_id',
//     foreignField: 'room',
//     justOne: false
// });

module.exports = mongoose.model('Reservation', ReservationSchema);