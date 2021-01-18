const Joi = require('joi');
const _ = require('lodash');
const BaseController = require('../controllers/BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class TransfersController extends BaseController {
		static async getAllTransfers(req, res) {
				try {
						const result = await super.getList(req, 'Transfers');
						return requestHandler.sendSuccess(res, 'Transfer Data Extracted')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getByTransferId(req, res) {
				try {
						const reqParam = req.params.id;
						const options = { where: { id: reqParam } };
						const result = await super.getByOptions(req, 'Transfers', options);
						return requestHandler.sendSuccess(res, 'Transfers Data Extracted')({ result });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async createTransfers(req, res) {
				try {
						const createdTransfers = await super.create(req, 'Transfers');
						if (!(_.isNull(createdTransfers))) {
								requestHandler.sendSuccess(res, 'Success Create Transfer', 201)();
						} else {
								requestHandler.throwError(422, 'Unprocessable Entity', 'unable to process the contained instructions')();
						}
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async deleteById(req, res) {
				try {
						const result = await super.deleteById(req, 'Transfers');
						return requestHandler.sendSuccess(res, 'Transfers Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}


		static async updateTransferById(req, res) {
				try {
						const data = {
								updated_at: new Date(),
								amount: req.body.amount,
						};
						req.body.updated_at = new Date();
						const recordID = req.params.id;
						try {
								await req.app.get('db')
										.Transfers
										.update(data, {
												where: {
														id: recordID,
												},
										})
										.then(
												requestHandler.throwIf(r => !r, 500, 'Internal server error', 'something went wrong couldnt update data'),
												requestHandler.throwError(500, 'sequelize error'),
										)
										.then(
												updatedRecored => Promise.resolve(updatedRecored),
										);
						} catch (err) {
								requestHandler.sendError(req, res, err);
						}
						requestHandler.sendSuccess(res, 'Success Update Partner', 200)();
				} catch (err) {
						requestHandler.sendError(req, res, err);
				}
		}
}

module.exports = TransfersController;
