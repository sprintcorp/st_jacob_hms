const upload = require("../utils/multer");
const express = require("express");
const url = require('url');
const querystring = require('querystring');
const { createEvent, getEvents, getEvent, getEventBySlug, getEventByRandom, updateEvent, deleteEvent } = require("../controller/event");

const Event = require("../model/Event");
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require("../middleware/advancedResults");


//Route links
router.post('/', protect, upload.single("image"), createEvent);
router.route('/').get(advancedResults(Event, {
    path: "user",
}), getEvents);
router.route('/:id').get(getEvent).delete(protect, deleteEvent).put(protect, upload.single("image"), updateEvent);
router.get('/_/random', getEventByRandom);
router.route('/_/:slug').get(getEventBySlug);
// router.get('/radius/:zipcode/:distance', getEventByRadius)

module.exports = router;