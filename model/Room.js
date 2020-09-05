const mongoose = require('mongoose');
const slugify = require("slugify");

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, "Name can not be more than 100 characters"],
    },
    image: {
        type: []
    },
    slug: String,

    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    details: {
        type: String,
    },

    price: {
        type: Number,
    },
    features: {
        type: []
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Create House slug from name
RoomSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true }) + "-" + Math.random() * (50 - 1) + 50;
    next();
});

RoomSchema.virtual('room', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'room',
    justOne: false
});

// RoomSchema.virtual('category', {
//     ref: 'Category',
//     localField: '_id',
//     foreignField: 'category',
//     justOne: false
// });

module.exports = mongoose.model('Room', RoomSchema);