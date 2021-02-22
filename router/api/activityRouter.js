const router = require('express')
		.Router();
const auth = require('../../utils/auth');
const ActivityController = require('../../controllers/ActivityLogController');
/**
 * @swagger
 * definitions:
 *   Activity:
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: integer
 */

/**
 * @swagger
 * /activity:
 *   get:
 *     tags:
 *       - Activity
 *     description: Activity list
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     parameters:
 *     - name: page
 *       description: integer of page
 *       in: query
 *       schema:
 *         type: string
 *     responses:
 *       200:
 *         description: list of partner wallet object
 *         schema:
 *           $ref: '#/definitions/partnersObject'
 */
router.get('/', auth.isAuthenticated, ActivityController.getAllActivity);


module.exports = router;
