const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
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
						};
						Partners.hasOne(Wallets, { foreignKey: 'userId' });
						Wallets.belongsTo(Partners, { foreignKey: 'id' });
						const result = await req.app.get('db').Partners.findAll(options);
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
						const options = {
								where: { userId: req.params.id },
						};
						const wallet = await super.getByCustomOptions(req, 'Wallets', options);
						return requestHandler.sendSuccess(res, 'Partners Data Extracted')({ partner, wallet });
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
						const data = req.body;
						const schema = {
								partnerCode: Joi.string()
										.required(),
								partnerName: Joi.string()
										.required(),
						};

						const { error } = Joi.validate({
							partnerCode: data.partnerCode,
							partnerName: data.partnerName,
						}, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
						const options = { where: { username: data.username } };
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
						req.body.code = data.partnerCode;
						data.password = bcrypt.hashSync(req.body.password, config.auth.saltRounds);
						const createdUser = await super.create(req, 'Partners');
						if (!(_.isNull(createdUser))) {
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
						requestHandler.validateJoi(error, 400, 'bad Request', 'invalid Partner Id');
						await super.getById(req, 'Partners');
						delete req.body.password;
						req.body.updated_at = new Date();
						req.params.id = reqParam;
						req.body.code = req.body.partnerCode;
						req.body.uAddress = req.body.address;
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
}

module.exports = UsersController;
