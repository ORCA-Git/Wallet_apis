const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const fs = require('fs').promises;
const BaseController = require('../controllers/BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const auth = require('../utils/auth');
const config = require('../config/appconfig');


const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class UsersController extends BaseController {
		static async getAllPartner(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request partner list`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const { Partners } = req.app.get('db');
						const { Wallets } = req.app.get('db');
						const options = {
								include: [Wallets],
								order: [
										['joinDate', 'DESC'],
								],
						};
						Partners.hasOne(Wallets, { foreignKey: 'userId' });
						Wallets.belongsTo(Partners, { foreignKey: 'id' });
						const result = await super.getList(req, 'Partners', options);
						return requestHandler.sendSuccess(res, 'Partners Data Extracted')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getPartnerById(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request partner by id`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const reqParam = req.params.id;
						const schema = {
								id: Joi.number()
										.integer()
										.min(1),
						};
						const { error } = Joi.validate({ id: reqParam }, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', 'invalid Partner Id');

						const partner = await super.getById(req, 'Partners');
						const optionImg = {
								where: { partnerId: reqParam },
						};
						const resultImage = await super.getList(req, 'PartnerFiles', optionImg);
						const image = [];
						if (resultImage) {
								// eslint-disable-next-line no-restricted-syntax
								for (const data of resultImage) {
										// eslint-disable-next-line no-await-in-loop
										const contents = await fs.readFile(`uploads/${data.dataValues.fileName}`, { encoding: 'base64' });
										const imgContents = {
												id: data.dataValues.id,
												image: contents,
										};
										image.push(imgContents);
								}
						}
						const options = {
								where: { userId: req.params.id },
						};
						const wallet = await super.getByCustomOptions(req, 'Wallets', options);
						return requestHandler.sendSuccess(res, 'Partners Data Extracted')({ partner, wallet, image });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async deleteById(req, res) {
				try {
						const logData = {
								action: 'Delete',
								description: `User ${req.decoded.payload.employeeCode} has request delete partner list`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.deleteById(req, 'Partners');
						return requestHandler.sendSuccess(res, 'User Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getProfile(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has get Profile`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const tokenFromHeader = auth.getJwtToken(req);
						const user = jwt.decode(tokenFromHeader);
						const options = {
								where: { id: user.payload.id },
						};
						const userProfile = await super.getByCustomOptions(req, 'Partners', options);
						const profile = _.omit(userProfile.dataValues, ['createdAt', 'updatedAt', 'last_login_date', 'password']);
						return requestHandler.sendSuccess(res, 'Partners Profile fetched Successfully')({ profile });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async addPartner(req, res) {
				try {
						const logData = {
								action: 'Add',
								description: `User ${req.decoded.payload.employeeCode} has request add partner`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						req.body = JSON.parse(req.body.data);
						const schema = {
								partnerCode: Joi.string()
										.required(),
								partnerName: Joi.string()
										.required(),
						};
						delete req.body.document;
						const { error } = Joi.validate({
							partnerCode: req.body.partnerCode,
							partnerName: req.body.partnerName,
						}, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
						const options = { where: { username: req.body.username } };
						const user = await super.getByOptions(req, 'Partners', options);

						if (user) {
								requestHandler.throwError(400, 'bad request', 'invalid username already existed')();
						}
						if (req.body.joinDate === '') {
								delete req.body.joinDate;
						}
						if (req.body.expireDate === '') {
								delete req.body.expireDate;
						}
						req.body.code = req.body.partnerCode;
						req.body.Address = req.body.address;
						req.body.password = bcrypt.hashSync(req.body.password, config.auth.saltRounds);
						const createdUser = await super.create(req, 'Partners');
						if (!(_.isNull(createdUser))) {
								req.body.partnerId = createdUser.dataValues.id;
								if (req.files.length > 0) {
										// eslint-disable-next-line no-plusplus
										for (let i = 0; i < req.files.length; i++) {
												req.body.fileName = req.files[i].filename;
												// eslint-disable-next-line no-await-in-loop
												await super.create(req, 'PartnerFiles');
										}
								} else {
										delete req.body.document;
								}
								req.body.userId = createdUser.dataValues.id;
								req.body.amount = req.body.walletAmount;
								req.body.minTransaction = req.body.minAmtTransaction;
								req.body.maxTransaction = req.body.maxAmtTransaction;
								req.body.limitTransactionPerDay = req.body.limitTransaction;
								const createWallet = await super.create(req, 'Wallets');
								if (!(_.isNull(createWallet))) {
										requestHandler.sendSuccess(res, 'Success Create Partner', 201)();
								} else {
										requestHandler.throwError(422, 'Unprocessable Entity', 'unable to process the contained instructions')();
								}
								requestHandler.sendSuccess(res, 'Success Create Partner', 201)();
						} else {
								requestHandler.throwError(422, 'Unprocessable Entity', 'unable to process the contained instructions')();
						}
				} catch (err) {
						requestHandler.sendError(req, res, err);
				}
		}

		static async updatePartner(req, res) {
				try {
						const logData = {
								action: 'update',
								description: `User ${req.decoded.employeeCode} has request update partner ${req.params.id}`,
								user: req.decoded.payload.id,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const reqParam = req.params.id;
						const schema = {
								id: Joi.number()
										.integer()
										.min(1),
						};
						const { error } = Joi.validate({ id: reqParam }, schema);
						req.body = JSON.parse(req.body.data);
						requestHandler.validateJoi(error, 400, 'bad Request', 'invalid Partner Id');
						await super.getById(req, 'Partners');
						delete req.body.password;
						delete req.body.document;
						req.body.updated_at = new Date();
						req.params.id = reqParam;
						req.body.code = req.body.partnerCode;
						req.body.partnerId = reqParam;
						if (req.files.length > 0) {
								// eslint-disable-next-line no-plusplus
								for (let i = 0; i < req.files.length; i++) {
										req.body.fileName = req.files[i].filename;
										// eslint-disable-next-line no-await-in-loop
										await super.create(req, 'PartnerFiles');
								}
						} else {
								delete req.body.document;
						}
						await super.updateById(req, 'Partners', req.body);
						req.body.amount = req.body.walletAmount;
						req.body.minTransaction = req.body.minAmtTransaction;
						req.body.maxTransaction = req.body.maxAmtTransaction;
						req.body.limitTransactionPerDay = req.body.limitTransaction;
						const options = {
								userId: req.params.id,
						};
						await super.updateByOptions(req, 'Wallets', req.body, options);
						requestHandler.sendSuccess(res, 'Success Update Partner', 200)();
				} catch (err) {
						requestHandler.sendError(req, res, err);
				}
		}

		static async deletePartnerFile(req, res) {
				try {
						const logData = {
								action: 'Delete',
								description: `User ${req.decoded.payload.employeeCode} has request delete partner file`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.deleteById(req, 'PartnerFiles');
						return requestHandler.sendSuccess(res, 'User Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}
}

module.exports = UsersController;
