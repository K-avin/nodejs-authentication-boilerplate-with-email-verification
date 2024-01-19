const express         = require('express');
const router          = express.Router();
const Role            = require('../../../config/role');
const authorize       = require('../../../middleware/authorize');
const userController  = require('../../../controllers/user.controller');

router.post('/login', userController.authenticateSchema, userController.authenticate);
router.post('/refresh-token', userController.refreshToken);
router.post('/revoke-token', authorize(), userController.revokeTokenSchema, userController.revokeToken);
router.post('/register', userController.registerSchema, userController.register);
router.post('/verify-email', userController.verifyEmailSchema, userController.verifyEmail);
router.post('/forgot-password', userController.forgotPasswordSchema, userController.forgotPassword);
router.post('/validate-reset-token', userController.validateResetTokenSchema, userController.validateResetToken);
router.post('/reset-password', userController.resetPasswordSchema, userController.resetPassword);
router.get('/users', authorize(Role.Admin), userController.getAll);
router.get('/:id', authorize(), userController.getById);
router.post('/', authorize(Role.Admin), userController.createSchema, userController.create);
router.put('/user/:id', authorize(), userController.updateSchema, userController.update);
router.delete('/user/:id', authorize(), userController._delete);

module.exports = router;