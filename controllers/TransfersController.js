const _ = require('lodash');
const BaseController = require('../controllers/BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class TransfersController extends BaseController {
		static async getAllTransfers(req, res) {
				try {
						const logData = {
								action: 'get',
								description: `User ${req.decoded.payload.employeeCode} has request transfer list`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const { Partners } = req.app.get('db');
						const { Transfers } = req.app.get('db');
						Partners.hasOne(Partners, { foreignKey: 'id' });
						Transfers.belongsTo(Partners, { foreignKey: 'from_partner' });
						// const walletUser = await req.app.get('db').Wallets.findAll(options);
						const options = {
								include: [Partners],
						};
						const result = await req.app.get('db')
								.Transfers
								.findAll(options);
						// const result = await super.getList(req, 'Transfers');
						return requestHandler.sendSuccess(res, 'Transfer Data Extracted')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getByTransferId(req, res) {
				try {
						const logData = {
								action: 'get',
								description: `User ${req.decoded.payload.employeeCode} has request transfer ${req.params.id}`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const reqParam = req.params.id;
						const options = { where: { id: reqParam } };
						const result = await super.getByOptions(req, 'Transfers', options);
						return requestHandler.sendSuccess(res, 'Transfers Data Extracted')({ result });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		// eslint-disable-next-line consistent-return
		static async createTransfers(req, res) {
				try {
						const logData = {
								action: 'Add',
								description: `User ${req.decoded.payload.employeeCode} has request add transfer`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
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
						const logData = {
								action: 'Delete',
								description: `User ${req.decoded.payload.employeeCode} has request delete transfer ${req.params.id}`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.deleteById(req, 'Transfers');
						return requestHandler.sendSuccess(res, 'Transfers Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}


		static async updateTransferById(req, res) {
				try {
						const logData = {
								action: 'Update',
								description: `User ${req.decoded.payload.employeeCode} has request transfer update ${req.params.id}`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
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
												updatedRecord => Promise.resolve(updatedRecord),
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
