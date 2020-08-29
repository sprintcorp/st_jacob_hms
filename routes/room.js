const upload = require("../utils/multer");
const express = require("express");
const url = require('url');
const querystring = require('querystring');
const { createRoom, getRooms, getRoom, getRoomBySlug, getRoomByRandom, updateRoom, getRoomByRequirement, deleteRoom } = require("../controller/room");

const Room = require("../model/Room");
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require("../middleware/advancedResults");


//Route links
router.post('/', protect, upload.array("image"), authorize('admin'), createRoom);
router.route('/').get(advancedResults(Room, {
    path: "user",
}), getRooms);
router.route('/:id').get(getRoom).delete(protect, authorize('admin'), deleteRoom).put(protect, upload.array("image"), authorize('admin'), updateRoom);
router.get('/_/requirement', getRoomByRequirement);
router.get('/_/random', getRoomByRandom);
router.route('/_/:slug').get(getRoomBySlug);
// router.get('/radius/:zipcode/:distance', getRoomByRadius)

module.exports = router;