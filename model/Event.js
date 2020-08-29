const mongoose = require('mongoose');
const slugify = require("slugify");

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
        maxlength: [100, "Name can not be more than 100 characters"],
    },
    image: {
        type: String
    },
    slug: String,
    details: {
        type: String,
    },
    date: {
        type: Date,
        required: true
    },


}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

//Create House slug from name
EventSchema.pre("save", function(next) {
    this.slug = slugify(this.name, { lower: true }) + "-" + Math.random() * (50 - 1) + 50;
    next();
});

module.exports = mongoose.model('Event', EventSchema);