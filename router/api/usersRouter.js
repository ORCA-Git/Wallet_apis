const router = require('express').Router();
const UsersController = require('../../controllers/UsersController');
const auth = require('../../utils/auth');
/**
   * @swagger
   * definitions:
   *   Users:
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
 * /users/{userId}:
 *   get:
 *     tags:
 *       - Users
 *     description: Return a specific user
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userId
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
router.get('/:id([0-9])', auth.isAuthenticated, UsersController.getUserById);
/**
 * @swagger
 * /users/signUp:
 *   post:
 *     tags:
 *       - Users
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       description: sign up using email and full name
 *       required: true
 *       schema:
 *         type: object
 *         required:
 *           - employeeCode
 *           - employeeName
 *           - idCard
 *           - username
 *           - password
 *         properties:
 *           username:
 *             type: string
 *           password:
 *             type: string
 *           employeeCode:
 *             type: string
 *           employeeName:
 *             type: string
 *           idCard:
 *             type: string
 *           nickName:
 *             type: string
 *           tel:
 *             type: string
 *           email:
 *             type: string
 *           birthDate:
 *             type: string
 *           age:
 *             type: string
 *           startJobDate:
 *             type: string
 *           Role:
 *             type: string
 *           Address:
 *             type: string
 *           remark:
 *             type: string
 *     responses:
 *       201:
 *         description: send an email to the user with the auto generated password and register him
 */


router.post('/signUp', UsersController.signUp);
/**
 * @swagger
 * /users/{userId}:
 *   delete:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *      - name: userId
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
router.delete('/:id([0-9])', UsersController.deleteById);

/**
 * @swagger
 * /users/profile:
 *   get:
 *     tags:
 *       - Users
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: return the user profile
 *         schema:
 *           $ref: '#/definitions/users'
 */
router.get('/profile', auth.isAuthenticated, UsersController.getProfile);


module.exports = router;
