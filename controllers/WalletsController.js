const Joi = require('joi');
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
						const reqParam = req.params.id;
						console.log(reqParam);
						const options = { where: { walletId: reqParam } };
						const result = await super.getByOptions(req, 'Wallets', options);
						return requestHandler.sendSuccess(res, 'Wallets Data Extracted')({ result });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async deleteById(req, res) {
				try {
						const result = await super.deleteById(req, 'Wallets');
						return requestHandler.sendSuccess(res, 'Wallet Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getProfileWallet(req, res) {
				try {
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
						try {
								const options = {
										where: {
												id: req.body.partnerId,
												walletId: req.body.walletId,
										},
								};
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
														id: req.body.partnerId,
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
