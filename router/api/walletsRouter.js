const router = require('express')
		.Router();
const WalletsController = require('../../controllers/WalletsController');
const auth = require('../../utils/auth');
/**
 * @swagger
 * definitions:
 *   Wallets:
 *     required:
 *       - id
 *       - userId
 *       - amount
 *     properties:
 *       id:
 *         type: integer
 *       userId:
 *         type: integer
 *       walletId:
 *         type: string
 *       amount:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   partnersObject:
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *           username:
 *             type: string
 *           email:
 *             type: string
 */

/**
 * @swagger
 * /wallets:
 *   get:
 *     tags:
 *       - Wallets
 *     description: partner get wallets
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of partner wallet object
 *         schema:
 *           $ref: '#/definitions/partnersObject'
 */
router.get('/', auth.isAuthenticated, WalletsController.getAllWallet);

/**
 * @swagger
 * /wallets:
 *   post:
 *     tags:
 *       - Wallets
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       description: add money to wallet partner
 *       required: true
 *       schema:
 *         type: object
 *         required:
 *           - partnerId
 *           - walletId
 *           - amount
 *         properties:
 *           partnerId:
 *             type: string
 *           walletId:
 *             type: string
 *           amount:
 *             type: string
 *     responses:
 *       201:
 *         description: create partner for authenticate to system
 * 		 404:
 * 		   description: the url you are trying to reach is not hosted on our server
 */
router.post('/', auth.isAuthenticated, WalletsController.topUpWalletById);
/**
 * @swagger
 * /wallets/{walletId}:
 *   put:
 *     tags:
 *       - Wallets
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: walletId
 *       description: string id of the wallet
 *       in: path
 *       required: true
 *       type: string
 *       minimum: 1
 *     - name: body
 *       in: body
 *       description: Edit Amount in Wallet
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           amount:
 *             type: string
 *     responses:
 *       201:
 *         description: edit amount in wallet
 *       404:
 *         description: the url you are trying to reach is not hosted on our server
 */
router.put('/:id', auth.isAuthenticated, WalletsController.updateWalletById);

/**
 * @swagger
 * /wallets/{walletId}:
 *   get:
 *     tags:
 *       - Wallets
 *     description: get specify wallet
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: walletId
 *        description: string id of the wallet to get
 *        in: path
 *        required: true
 *        type: string
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/wallets'
 */
router.get('/:id([a-zA-Z0-9!@#+=._-]+)', auth.isAuthenticated, WalletsController.getByWalletId);

router.get('/history/:id([a-zA-Z0-9!@#+=._-]+)', auth.isAuthenticated, WalletsController.getHistoryByWalletId);

/**
 * @swagger
 * /wallets/{walletId}:
 *   delete:
 *     tags:
 *       - Wallets
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: walletId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: delete user with id
 *         schema:
 *           $ref: '#/definitions/users'
 */
router.delete('/:id([0-9])', auth.isAuthenticated, WalletsController.deleteById);

module.exports = router;
