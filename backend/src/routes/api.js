const express = require('express');

const router = express.Router();

const VideoController = require('../controller/VideoController');

router.route('/generateFrame').post(VideoController.store);
router.route('/:video/status').get(VideoController.status);

module.exports = router;
