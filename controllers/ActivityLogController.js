const _ = require('lodash');
const BaseController = require('../controllers/BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class ActivityLogController extends BaseController {
		static async getAllActivity(req, res) {
				try {
						const logData = {
								action: 'get',
								description: `User ${req.decoded.payload.employeeCode} has request activity list`,
								user: req.decoded.payload.id,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.getList(req, 'activity_log');
						return requestHandler.sendSuccess(res, 'Partners Data Extracted')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}
}

module.exports = ActivityLogController;
