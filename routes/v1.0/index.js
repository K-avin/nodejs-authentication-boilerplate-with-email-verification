const express = require('express');
const router = express.Router();

//auth route
router.use('/auth', require('./routes/userRoutes'));

module.exports = router;