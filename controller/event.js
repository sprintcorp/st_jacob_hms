const Event = require("../model/Event");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const _ = require("underscore");
const fs = require("fs");
const cloudinary = require('../utils/upload');


//@desc Get all Events
//@route GET /api/v1/events
//@accss Public
exports.getEvents = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc Get single Events
//@route GET /api/v1/events/:id
//@accss Public
exports.getEvent = asyncHandler(async(req, res, next) => {
    const event = await Event.findById(req.params.id);
    res.status(200).json({ success: true, data: event });
});

//@desc Get Events by slug
//@route GET /api/v1/events/_/:slug
//@accss Public
exports.getEventBySlug = asyncHandler(async(req, res, next) => {
    const event = await Event.find({
        slug: req.params.slug
    });
    res.status(200).json({ success: true, data: event });
});


//@desc Get Random Events
//@route GET /api/v1/events/_/random
//@accss Private
exports.getEventByRandom = asyncHandler(async(req, res, next) => {
    console.log(req.query.rand)
    let no = 2;
    if (req.query.rand == 3) {
        no = 3;
    }

    const event = await Event.aggregate([{ $sample: { size: no } }]);
    res.status(200).json({ success: true, length: Event.length, data: event });
});




//@desc  Create new Event
//@route POST /api/v1/events
//@accss Private
exports.createEvent = asyncHandler(async(req, res, next) => {

    if (req.file) {
        const files = req.file;
        try {
            let multiple = async(path) => await new cloudinary(path).upload();
            const { path } = files;
            console.log("path", files);
            const newPath = await multiple(path);
            fs.unlinkSync(path);
            req.body.image = newPath;
        } catch (e) {
            console.log("err :", e);
            return next(new ErrorResonse(e, 400));
        }
    }

    const event = await Event.create(req.body);
    res.status(201).json({ success: true, data: event });
});


//@desc  Update Event
//@route PUT /api/v1/events/:id
//@accss Private
exports.updateEvent = asyncHandler(async(req, res, next) => {
    const check = await Event.findById(req.params.id);
    req.body.image = check.image;
    // console.log()
    if (req.file) {
        // console.log(req.files.image)
        const files = req.file;
        try {
            let multiple = async(path) => await new cloudinary(path).upload();
            const { path } = files;
            console.log("path", files);
            const newPath = await multiple(path);
            fs.unlinkSync(path);
            req.body.image = newPath;
        } catch (e) {
            console.log("err :", e);
            return next(new ErrorResonse(e, 400));
        }
    }

    const event = await Event.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({ success: true, data: event });
});

//@desc  Delete Event
//@route DELETE /api/v1/events/:id
//@accss Private
exports.deleteEvent = asyncHandler(async(req, res, next) => {
    const checkIfEventExist = await Event.findById(req.params.id);
    if (!checkIfEventExist) {
        return next(
            new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
        );
    }
    const event = await Event.findByIdAndDelete(req.params.id)
    if (event) {
        res.status(200).json({ success: true, data: "Event Successfully deleted" });
    }
});