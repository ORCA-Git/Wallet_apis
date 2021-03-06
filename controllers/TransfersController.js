const _ = require('lodash');
const fs = require('fs').promises;
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
						const options = {
								include: [Partners],
								order: [
										['transaction_date', 'DESC'],
								],
						};
						Partners.hasMany(Transfers, { foreignKey: 'id', targetKey: 'id' });
						Transfers.belongsTo(Partners, { foreignKey: 'partnerId' });
						const result = await super.getList(req, 'Transfers', options);
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
						const { Wallets } = req.app.get('db');
						const { Transfers } = req.app.get('db');
						const reqParam = req.params.id;
						const options = {
								include: [Wallets],
								where: { id: reqParam },
								order: [
										['transaction_date', 'DESC'],
								],
						};
						Transfers.belongsTo(Wallets, { foreignKey: 'partnerId', targetKey: 'userId' });
						const result = await super.getByOptions(req, 'Transfers', options);
						const optionImg = {
								where: { tranferId: reqParam },
						};
						const resultImage = await super.getList(req, 'TransferFile', optionImg);
						const image = [];
						if (resultImage) {
								for (const data of resultImage) {
										const contents = await fs.readFile(`uploads/${data.dataValues.fileName}`, { encoding: 'base64' });
										image.push(contents);
								}
						}


						return requestHandler.sendSuccess(res, 'Transfers Data Extracted')({ result, image });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}


		// eslint-disable-next-line consistent-return
		static async createTransfers(req, res) {
				req.body = JSON.parse(req.body.data);
				req.body.from_partner = req.body.partnerCode;
				delete req.body.slip;
				try {
						const logData = {
								action: 'Add',
								description: `User ${req.decoded.payload.employeeCode} has request add transfer`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						req.body.status = 'APPROVED';
						req.body.submited = req.body.submitted;
						const createdTransfers = await super.create(req, 'Transfers');
						if (!(_.isNull(createdTransfers))) {
								req.body.tranferId = createdTransfers.dataValues.id;
								if (req.files.length > 0) {
										// eslint-disable-next-line no-plusplus
										for (let i = 0; i < req.files.length; i++) {
												req.body.fileName = req.files[i].filename;
												// eslint-disable-next-line no-await-in-loop
												await super.create(req, 'TransferFile');
										}
								} else {
										delete req.body.slip;
								}
								const optionsDeduct = {
										where: {
												userId: req.body.partnerId,
												walletId: req.body.walletID,
										},
								};
								req.params.id = req.body.partnerId;
								await super.getById(req, 'Partners');
								const result = await super.getByOptions(req, 'Wallets', optionsDeduct);
								let balance = result.dataValues.amount;
								balance -= Number(req.body.amount);
								const data = {
										updated_at: new Date(),
										amount: balance,
								};
								await req.app.get('db')
										.Wallets
										.update(data, {
												where: {
														userId: req.body.partnerId,
														walletId: req.body.walletID,
												},
										})
										.then(
												requestHandler.throwIf(r => !r, 500, 'Internal server error', 'something went wrong couldn\'t update data'),
												requestHandler.throwError(500, 'sequelize error'),
										)
										.then(
												updatedRecord => Promise.resolve(updatedRecord),
										);
								const	logTopup = {
										walletId: req.body.walletID,
										typeData: 'DEDUCT TRANSACTION',
										amount: req.body.amount,
										user: req.decoded.payload.id,
										createdDate: new Date(),
								};
								await super.create(req, 'Wallet_history', logTopup);
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
						req.body.status = 'CANCEL';
						await super.updateById(req, 'Transfers', req.body);
						const val = await super.getById(req, 'Transfers');
						const optionsRefund = {
								where: {
										userId: val.dataValues.partnerId,
								},
						};
						const result = await super.getByOptions(req, 'Wallets', optionsRefund);
						let balance = result.dataValues.amount;
						balance += Number(val.dataValues.amount);
						const data = {
								updated_at: new Date(),
								amount: balance,
						};
						await req.app.get('db')
								.Wallets
								.update(data, {
										where: {
												userId: val.dataValues.partnerId,
										},
								})
								.then(
										requestHandler.throwIf(r => !r, 500, 'Internal server error', 'something went wrong couldn\'t update data'),
										requestHandler.throwError(500, 'sequelize error'),
								)
								.then(
										updatedRecord => Promise.resolve(updatedRecord),
								);
						const	logTopup = {
								walletId: result.dataValues.walletId,
								typeData: 'REFUND',
								amount: val.dataValues.amount,
								user: req.decoded.payload.id,
								createdDate: new Date(),
						};
						await super.create(req, 'Wallet_history', logTopup);
						await super.create(req, 'activity_log', logData);
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
