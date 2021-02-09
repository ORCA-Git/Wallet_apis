

const router = require('express').Router();

router.use('/users', require('./usersRouter'));
router.use('/partners', require('./partnersRouter'));
router.use('/wallets', require('./walletsRouter'));
router.use('/transfers', require('./transfersRouter'));
router.use('/email', require('./sendEmail'));

router.use('/', require('./authRouter'));

router.use('/activity', require('./activityRouter'));

module.exports = router;
