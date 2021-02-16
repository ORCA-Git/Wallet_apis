const jwt = require('jsonwebtoken');
const _ = require('lodash');
const BaseController = require('../controllers/BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const auth = require('../utils/auth');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class WalletsController extends BaseController {
		static async getByWalletId(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request wallet list`,
								user: req.decoded.payload.id,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const reqParam = req.params.id;
						const options = { where: { walletId: reqParam } };
						const result = await super.getByOptions(req, 'Wallets', options);
						return requestHandler.sendSuccess(res, 'Wallets Data Extracted')({ result });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async deleteById(req, res) {
				try {
						const logData = {
								action: 'Delete',
								description: `User ${req.decoded.payload.employeeCode} has request delete wallet by id ${req.params.id}`,
								user: req.decoded.payload.id,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.deleteById(req, 'Wallets');
						return requestHandler.sendSuccess(res, 'Wallet Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getAllWallet(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request wallet list`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const { Partners } = req.app.get('db');
						const { Wallets } = req.app.get('db');
						const options = {
								include: [Partners],
						};
						Partners.hasOne(Wallets, { foreignKey: 'id' });
						Wallets.belongsTo(Partners, { foreignKey: 'userId' });
						const walletUser = await req.app.get('db').Wallets.findAll(options);
						return requestHandler.sendSuccess(res, 'Wallet fetched Successfully')({ walletUser });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getProfileWallet(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request wallet by id ${req.params.id}`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const tokenFromHeader = auth.getJwtToken(req);
						const user = jwt.decode(tokenFromHeader);
						const options = {
								where: { userId: user.payload.id },
						};
						const walletUser = await req.app.get('db').Wallets.findAll(options);
						return requestHandler.sendSuccess(res, 'Wallet fetched Successfully')({ walletUser });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}


		static async updateWalletById(req, res) {
				try {
						const logData = {
								action: 'Update',
								description: `User ${req.decoded.payload.employeeCode} has request wallet by id ${req.params.id}`,
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
										.Wallets
										.update(data, {
												where: {
														walletId: recordID,
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

		static async topUpWalletById(req, res) {
				try {
						const logData = {
								action: 'Add',
								description: `User ${req.decoded.payload.employeeCode} has request topup wallet`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						try {
								const options = {
										where: {
												userId: req.body.partnerId,
												walletId: req.body.walletId,
										},
								};
								req.params.id = req.body.partnerId;
								await super.getById(req, 'Partners');
								const result = await super.getByOptions(req, 'Wallets', options);
								let balance = result.dataValues.amount;
								balance += Number(req.body.amount);
								const data = {
										updated_at: new Date(),
										amount: balance,
								};
								await req.app.get('db')
										.Wallets
										.update(data, {
												where: {
														userId: req.body.partnerId,
														walletId: req.body.walletId,
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

module.exports = WalletsController;
