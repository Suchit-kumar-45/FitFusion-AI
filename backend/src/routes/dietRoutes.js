const express = require('express');

const router = express.Router();

const {
  createDiet,
} = require('../controllers/dietController');

router.post('/generate', createDiet);

module.exports = router;