

const router = require('express').Router();

router.use('/users', require('./usersRouter'));
router.use('/partners', require('./partnersRouter'));
router.use('/wallets', require('./walletsRouter'));
router.use('/email', require('./sendEmail'));

router.use('/', require('./authRouter'));

module.exports = router;
