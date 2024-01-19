const express = require('express');
const router = express.Router();

//auth route
router.use('/auth', require('./routers/userRoutes'));

module.exports = router;