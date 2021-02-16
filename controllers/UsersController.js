const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const async = require('async');
const BaseController = require('../controllers/BaseController');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const auth = require('../utils/auth');
const stringUtil = require('../utils/stringUtil');
const email = require('../utils/email');
const config = require('../config/appconfig');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);

class UsersController extends BaseController {
		static async signUp(req, res) {
				try {
						const logData = {
								action: 'Add',
								description: 'User has signup',
								user: '',
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const data = req.body;
						const schema = {
								username: Joi.string()
										.required(),
								password: Joi.string()
										.required(),
								employeeCode: Joi.string()
										.required(),
								employeeName: Joi.string()
										.required(),
								idCard: Joi.string()
										.required(),
						};
						const randomString = stringUtil.generateString();

						const { error } = Joi.validate({
								username: data.username,
								password: data.password,
								employeeCode: data.employeeCode,
								employeeName: data.employeeName,
								idCard: data.idCard,
						}, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
						const options = { where: { username: data.username } };
						const user = await super.getByCustomOptions(req, 'Users', options);

						if (user) {
								requestHandler.throwError(400, 'bad request', 'invalid username already existed')();
						}

						async.parallel([
								function one(callback) {
										email.sendEmail(
												callback,
												config.sendgrid.from_email,
												[data.email],
												' WalletApi',
												`please consider the following as your password ${data.password}`,
												`<p style="font-size: 32px;">Hello ${data.employeeName}</p>  please consider the following as your password: ${randomString}`,
										);
								},
						], (err, results) => {
								if (err) {
										requestHandler.throwError(500, 'internal Server Error', 'failed to send password email')();
								} else {
										logger.log(`an email has been sent at: ${new Date()} to : ${data.email} with the following results ${results}`, 'info');
								}
						});

						data.password = bcrypt.hashSync(data.password, config.auth.saltRounds);
						const createdUser = await super.create(req, 'Users');
						if (!(_.isNull(createdUser))) {
								requestHandler.sendSuccess(res, `Your Password is ${randomString}`, 201)();
						} else {
								requestHandler.throwError(422, 'Unprocessable Entity', 'unable to process the contained instructions')();
						}
				} catch (err) {
						requestHandler.sendError(req, res, err);
				}
		}

    static async getAllUser(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request List Admin User`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.getList(req, 'Users');
						return requestHandler.sendSuccess(res, 'User Data Extracted')({ result });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async getUserById(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request user ${req.params.id}`,
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
						requestHandler.validateJoi(error, 400, 'bad Request', 'invalid User Id222');

						const result = await super.getById(req, 'Users');
						return requestHandler.sendSuccess(res, 'User Data Extracted')({ result });
				} catch (error) {
						return requestHandler.sendError(req, res, error);
				}
		}

		static async deleteById(req, res) {
				try {
						const logData = {
								action: 'Delete',
								description: `User ${req.decoded.payload.employeeCode} has request delete user ${req.params.id}`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const result = await super.deleteById(req, 'Users');
						return requestHandler.sendSuccess(res, 'User Deleted Successfully')({ result });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}

		static async getProfile(req, res) {
				try {
						const logData = {
								action: 'Get',
								description: `User ${req.decoded.payload.employeeCode} has request user profile`,
								user: req.decoded.payload.employeeCode,
								date: new Date(),
						};
						await super.create(req, 'activity_log', logData);
						const tokenFromHeader = auth.getJwtToken(req);
						const user = jwt.decode(tokenFromHeader);
						console.log(user);
						const options = {
								where: { id: user.payload.id },
						};
						const userProfile = await super.getByCustomOptions(req, 'Users', options);
						const profile = _.omit(userProfile.dataValues, ['createdAt', 'updatedAt', 'last_login_date', 'password']);
						return requestHandler.sendSuccess(res, 'User Profile fetched Successfully')({ profile });
				} catch (err) {
						return requestHandler.sendError(req, res, err);
				}
		}
}

module.exports = UsersController;
