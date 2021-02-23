const router = require('express')
		.Router();
const multer = require('multer');
const TransfersController = require('../../controllers/TransfersController');
const auth = require('../../utils/auth');

const storage = multer.diskStorage({
		destination(req, file, cb) {
				cb(null, 'uploads');
		},
		filename(req, file, cb) {
				const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
				cb(null, `${file.fieldname}-${uniqueSuffix}.jpg`);
		},
});
const upload = multer({ dest: 'uploads', storage });
/**
 * @swagger
 * definitions:
 *   Transfers:
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
 * /transfers:
 *   get:
 *     tags:
 *       - Transfers
 *     description: transfers list
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
router.get('/', auth.isAuthenticated, TransfersController.getAllTransfers);

/**
 * @swagger
 * /transfers:
 *   post:
 *     tags:
 *       - Transfers
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
 *         properties:
 *           order_no:
 *             type: string
 *           invoice:
 *             type: string
 *           transaction_date:
 *             type: string
 *           rate:
 *             type: string
 *           fee:
 *             type: string
 *           receipt_date:
 *             type: string
 *           to_customer:
 *             type: string
 *           from_partner:
 *             type: string
 *           reason:
 *             type: string
 *           submitted:
 *             type: string
 *           sms:
 *             type: string
 *           coupon:
 *             type: string
 *     responses:
 *       201:
 *         description: create transfer
 * 		 404:
 * 		   description: the url you are trying to reach is not hosted on our server
 */
router.post('/', auth.isAuthenticated, upload.any(), TransfersController.createTransfers);
/**
 * @swagger
 * /transfers/{transferId}:
 *   put:
 *     tags:
 *       - Transfers
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
router.put('/:id', auth.isAuthenticated, TransfersController.updateTransferById);

/**
 * @swagger
 * /transfers/{transferId}:
 *   get:
 *     tags:
 *       - Transfers
 *     description: get specify wallet
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: transferId
 *        description: string id of the wallet to get
 *        in: path
 *        required: true
 *        type: string
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/Transfers'
 */
router.get('/:id([0-9]+)', auth.isAuthenticated, TransfersController.getByTransferId);

/**
 * @swagger
 * /transfers/{transferId}:
 *   delete:
 *     tags:
 *       - Transfers
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: transferId
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
router.delete('/:id([0-9]+)', auth.isAuthenticated, TransfersController.deleteById);

module.exports = router;
