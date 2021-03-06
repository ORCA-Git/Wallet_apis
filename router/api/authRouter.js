const router = require('express').Router();
const AuthController = require('../../controllers/AuthController');
const auth = require('../../utils/auth');

/**
   * @swagger
   * definitions:
   *   users:
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
  * /login:
  *   post:
  *     tags:
  *       - Auth
  *     produces:
  *       - application/json
  *     parameters:
  *     - name: body
  *       in: body
  *       description: the login credentials
  *       required: true
  *       schema:
  *         type: object
  *         required:
  *           - username
  *           - password
  *         properties:
  *           username:
  *             type: string
  *           password:
  *             type: string
  *     responses:
  *       200:
  *         description: user logged in successfully
  */
router.post('/login', AuthController.login);
/**
 * @swagger
 * /token/issue:
 *   post:
 *     tags:
 *       - Auth
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       description: the login credentials for Partner
 *       required: true
 *       schema:
 *         type: object
 *         required:
 *           - username
 *           - password
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *     responses:
 *       200:
 *         description: partner logged in successfully
 */
router.post('/token/issue', AuthController.loginPartner);
/**
  * @swagger
  * /refreshToken:
  *   post:
  *     tags:
  *       - Auth
  *     security:
  *       - Bearer: []
  *     produces:
  *       - application/json
  *     parameters:
  *     - name: body
  *       in: body
  *       description: the refresh token
  *       required: true
  *       schema:
  *         type: object
  *         required:
  *           - refreshToken
  *         properties:
  *           refreshToken:
  *             type: string
  *     responses:
  *       200:
  *         description: a new jwt token with a new expiry date is issued
  */
router.post('/refreshToken', auth.isAuthenticated, AuthController.refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Auth
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: platform
 *       description: device platform
 *       in: header
 *       required: true
 *       type: string
 *     - name: body
 *       in: body
 *       description: the fcm token of the current logged in user
 *       required: true
 *       schema:
 *         type: object
 *         required:
 *           - fcmToken
 *         properties:
 *           fcmToken:
 *             type: string
 *     responses:
 *       200:
 *         description: log out from application
 *         schema:
 *           $ref: '#/definitions/users'
 */
router.post('/logout', auth.isAuthenticated, AuthController.logOut);

module.exports = router;
