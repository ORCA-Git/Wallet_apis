const router = require('express')
		.Router();
const PartnersController = require('../../controllers/PartnersController');
const auth = require('../../utils/auth');
/**
 * @swagger
 * definitions:
 *   Partners:
 *     required:
 *       - id
 *       - username
 *       - email
 *     properties:
 *       id:
 *         type: integer
 *       username:
 *         type: string
 *       email:
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
 * /partners:
 *   get:
 *     tags:
 *       - Partners
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: list of partner2 object
 *         schema:
 *           $ref: '#/definitions/partnersObject'
 */
router.get('/', auth.isAuthenticated, PartnersController.getAllPartner);

/**
 * @swagger
 * /partners:
 *   post:
 *     tags:
 *       - Partners
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       description: add partner to system
 *       required: true
 *       schema:
 *         type: object
 *         required:
 *           - partnerCode
 *           - partnerName
 *           - walletId
 *           - walletAmount
 *           - minAmtTransaction
 *           - maxAmtTransaction
 *           - limitTransaction
 *           - fee
 *           - username
 *           - password
 *           - secretKey
 *         properties:
 *           partnerCode:
 *             type: string
 *           partnerName:
 *             type: string
 *           contactName:
 *             type: string
 *           email:
 *             type: string
 *           tel:
 *             type: string
 *           country:
 *             type: string
 *           joinDate:
 *             type: string
 *           expireDate:
 *             type: string
 *           address:
 *             type: string
 *           remark:
 *             type: string
 *           walletAmount:
 *             type: string
 *           walletId:
 *             type: string
 *           minAmtTransaction:
 *             type: string
 *           maxAmtTransaction:
 *             type: string
 *           limitTransaction:
 *             type: string
 *           fee:
 *             type: string
 *           username:
 *             type: string
 *           password:
 *             type: string
 *           secretKey:
 *             type: string
 *     responses:
 *       201:
 *         description: create partner for authenticate to system
 * 		 404:
 * 		   description: the url you are trying to reach is not hosted on our server
 */


router.post('/', auth.isAuthenticated, PartnersController.addPartner);
/**
 * @swagger
 * /partners/{partnerId}:
 *   put:
 *     tags:
 *       - Partners
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: partnerId
 *       description: numeric id of the user to get
 *       in: path
 *       required: true
 *       type: integer
 *       minimum: 1
 *     - name: body
 *       in: body
 *       description: add partner to system
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           partnerCode:
 *             type: string
 *           partnerName:
 *             type: string
 *           contactName:
 *             type: string
 *           email:
 *             type: string
 *           tel:
 *             type: string
 *           country:
 *             type: string
 *           joinDate:
 *             type: string
 *           expireDate:
 *             type: string
 *           address:
 *             type: string
 *           remark:
 *             type: string
 *     responses:
 *       201:
 *         description: create partner for authenticate to system
 *       404:
 *         description: the url you are trying to reach is not hosted on our server
 */


router.put('/:id([0-9])', PartnersController.updatePartner, auth.isAuthenticated);
/**
 * @swagger
 * /partners/{partnerId}:
 *   get:
 *     tags:
 *       - Partners
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: partnerId
 *        description: numeric id of the user to get
 *        in: path
 *        required: true
 *        type: integer
 *        minimum: 1
 *     responses:
 *       200:
 *         description: a single user object
 *         schema:
 *           $ref: '#/definitions/users'
 */
router.get('/:id([0-9])', auth.isAuthenticated, PartnersController.getPartnerById);

/**
 * @swagger
 * /partners/{partnerId}:
 *   delete:
 *     tags:
 *       - Partners
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: partnerId
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
router.delete('/:id([0-9])', auth.isAuthenticated, PartnersController.deleteById);

module.exports = router;
