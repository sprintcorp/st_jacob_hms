const Room = require("../model/Room");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const _ = require("underscore");
const fs = require("fs");
const cloudinary = require('../utils/upload');


//@desc Get all rooms
//@route GET /api/v1/rooms
//@accss Public
exports.getRooms = asyncHandler(async(req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc Get single Rooms
//@route GET /api/v1/rooms/:id
//@accss Public
exports.getRoom = asyncHandler(async(req, res, next) => {
    const room = await Room.findById(req.params.id).populate('category');
    res.status(200).json({ success: true, data: room });
});

//@desc Get Rooms by slug
//@route GET /api/v1/rooms/_/:slug
//@accss Public
exports.getRoomBySlug = asyncHandler(async(req, res, next) => {
    const room = await Room.find({
        slug: req.params.slug
    });
    res.status(200).json({ success: true, data: room });
});


//@desc Get Rooms by value
//@route GET /api/v1/rooms/_/requirement
//@accss Private
exports.getRoomByRequirement = asyncHandler(async(req, res, next) => {
    console.log(req.query)
    const room = await Room.find({

        "price": { "$gte": req.query.min, "$lte": req.query.max },


    });
    res.status(200).json({ success: true, length: Room.length, data: room });
});

//@desc Get Random Rooms
//@route GET /api/v1/rooms/_/random
//@accss Private
exports.getRoomByRandom = asyncHandler(async(req, res, next) => {
    console.log(req.query.rand)
    let no = 2;
    if (req.query.rand == 3) {
        no = 3;
    }

    const room = await Room.aggregate([{ $sample: { size: no } }]);
    res.status(200).json({ success: true, length: Room.length, data: room });
});




//@desc  Create new Room
//@route POST /api/v1/rooms
//@accss Private
exports.createRoom = asyncHandler(async(req, res, next) => {
    // console.log(req.files);
    req.body.user = req.user.id;

    // req.body.features = req.body.features.split(',');
    if (!req.files || _.isEmpty(req.files)) {
        return next(new ErrorResponse(`No file uploaded`, 400));
    }
    const files = req.files
    try {
        let urls = [];
        let multiple = async(path) => await new cloudinary(path).upload();
        console.log(files);
        for (const file of files) {
            const { path } = file;
            console.log("path", file);

            const newPath = await multiple(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
        // console.log(urls);
        if (urls) {
            console.log(req.user)
            req.body.image = urls;
            const room = await Room.create(req.body);
            res.status(201).json({ success: true, data: room });

        }
        if (!urls) {
            return next(new ErrorResponse(`response not gotten from source`, 400));
        }
    } catch (e) {
        console.log("err :", e);
        return next(new ErrorResonse(e, 400));
    }
});


//@desc  Update Room
//@route PUT /api/v1/rooms/:id
//@accss Private
exports.updateRoom = asyncHandler(async(req, res, next) => {
    req.body.user = req.user.id;
    if (req.files) {
        const files = req.files
        let urls = [];
        let multiple = async(path) => await new cloudinary(path).upload();
        console.log(files);
        for (const file of files) {
            const { path } = file;
            console.log("path", file);

            const newPath = await multiple(path);
            urls.push(newPath);
            fs.unlinkSync(path);
        }
    }

    try {

        if (urls) {
            req.body.image = urls;
        } else {
            return next(new ErrorResponse(`response not gotten from source`, 400));
        }
        const room = await Room.findByIdAndUpdate(req.params.id, req.body);
        res.status(201).json({ success: true, data: room });

    } catch (e) {
        console.log("err :", e);
        return next(new ErrorResonse(e, 400));
    }
});

//@desc  Delete Room
//@route DELETE /api/v1/rooms/:id
//@accss Private
exports.deleteRoom = asyncHandler(async(req, res, next) => {
    const checkIfRoomExist = await Room.findById(req.params.id);
    if (!checkIfRoomExist) {
        return next(
            new ErrorResponse(`Room not found with id of ${req.params.id}`, 404)
        );
    }
    const room = await Room.findByIdAndDelete(req.params.id)
    if (Room) {
        res.status(200).json({ success: true, data: "Room Successfully deleted" });
    }
});