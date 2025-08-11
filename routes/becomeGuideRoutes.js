const express = require('express');
const becomeGuideController = require('../controllers/becomeGuideController');

const router = express.Router();

router.post('/application', becomeGuideController.submitApplication);

module.exports = router;
