const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const RequestHandler = require('../utils/RequestHandler');
const Logger = require('../utils/logger');
const BaseController = require('../controllers/BaseController');
const config = require('../config/appconfig');
const auth = require('../utils/auth');

const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const tokenList = {};

class AuthController extends BaseController {
		static async login(req, res) {
				try {
						const schema = {
								username: Joi.string()
										.required(),
								password: Joi.string()
										.required(),
						};
						const { error } = Joi.validate({
								username: req.body.username,
								password: req.body.password,
						}, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
						const options = {
								where: { username: req.body.username },
						};
						const user = await super.getByCustomOptions(req, 'Users', options);
						if (!user) {
								requestHandler.throwError(400, 'bad request', 'invalid username')();
						}

						await bcrypt
								.compare(req.body.password, user.password)
								.then(
										requestHandler.throwIf(r => !r, 400, 'incorrect', 'failed to login bad credentials'),
										requestHandler.throwError(500, 'bcrypt error'),
								);
						const data = {
								last_login_date: new Date(),
						};
						req.params.id = user.id;
						await super.updateById(req, 'Users', data);
						const payload = _.omit(user.dataValues, ['createdAt', 'updatedAt', 'last_login_date', 'password', 'gender', 'mobile_number', 'user_image']);
						const token = jwt.sign({ payload }, config.auth.jwt_secret, {
								expiresIn: config.auth.jwt_expiresin,
								algorithm: 'HS512',
						});
						const refreshToken = jwt.sign({
								payload,
						}, config.auth.refresh_token_secret, {
								expiresIn: config.auth.refresh_token_expiresin,
						});
						tokenList[refreshToken] = {
								status: 'Logged in',
								token,
								refreshToken,
						};
						requestHandler.sendSuccess(res, 'User logged in Successfully')({
								token,
								refreshToken,
						});
				} catch (error) {
						requestHandler.sendError(req, res, error);
				}
		}

		static async loginPartner(req, res) {
				try {
						const schema = {
								username: Joi.string()
										.required(),
								password: Joi.string()
										.required(),
						};
						const { error } = Joi.validate({
								username: req.body.username,
								password: req.body.password,
						}, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
						const options = {
								where: { username: req.body.username },
						};
						const user = await super.getByCustomOptions(req, 'Partners', options);
						if (!user) {
								requestHandler.throwError(400, 'bad request', 'invalid Username')();
						}
						await bcrypt
								.compare(req.body.password, user.password)
								.then(
										requestHandler.throwIf(r => !r, 400, 'incorrect', 'failed to login bad credentials'),
										requestHandler.throwError(500, 'bcrypt error'),
								);
						const data = {
								last_login_date: new Date(),
						};
						req.params.id = user.id;
						await super.updateById(req, 'Partners', data);
						const payload = _.omit(user.dataValues, ['createdAt', 'updatedAt', 'last_login_date', 'password', 'gender', 'mobile_number', 'user_image']);
						const token = jwt.sign({ payload }, config.auth.jwt_secret, {
								expiresIn: config.auth.jwt_expiresin,
								algorithm: 'HS512',
						});
						const refreshToken = jwt.sign({
								payload,
						}, config.auth.refresh_token_secret, {
								expiresIn: config.auth.refresh_token_expiresin,
						});
						tokenList[refreshToken] = {
								status: 'Logged in',
								token,
								refreshToken,
						};
						requestHandler.sendSuccess(res, 'Partners logged in Successfully')({
								token,
								refreshToken,
						});
				} catch (error) {
						requestHandler.sendError(req, res, error);
				}
		}

		static async refreshToken(req, res) {
				try {
						const data = req.body;
						if (_.isNull(data)) {
								requestHandler.throwError(400, 'bad request', 'please provide the refresh token in request body')();
						}
						const schema = {
								refreshToken: Joi.string()
										.required(),
						};
						const { error } = Joi.validate({ refreshToken: req.body.refreshToken }, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');
						const tokenFromHeader = auth.getJwtToken(req);
						const user = jwt.decode(tokenFromHeader);

						if ((data.refreshToken) && (data.refreshToken in tokenList)) {
								const token = jwt.sign({ user }, config.auth.jwt_secret, {
										expiresIn: config.auth.jwt_expiresin,
										algorithm: 'HS512',
								});
								const response = {
										token,
								};
								// update the token in the list
								tokenList[data.refreshToken].token = token;
								requestHandler.sendSuccess(res, 'a new token is issued ', 200)(response);
						} else {
								requestHandler.throwError(400, 'bad request', 'no refresh token present in refresh token list')();
						}
				} catch (err) {
						requestHandler.sendError(req, res, err);
				}
		}

		static async logOut(req, res) {
				try {
						const schema = {
								platform: Joi.string()
										.valid('ios', 'android', 'web')
										.required(),
								fcmToken: Joi.string(),
						};
						const { error } = Joi.validate({
								platform: req.headers.platform,
								fcmToken: req.body.fcmToken,
						}, schema);
						requestHandler.validateJoi(error, 400, 'bad Request', error ? error.details[0].message : '');

						const tokenFromHeader = auth.getJwtToken(req);
						const user = jwt.decode(tokenFromHeader);
						const options = {
								where: {
										fcmToken: req.body.fcmToken,
										platform: req.headers.platform,
										user_id: user.payload.id,
								},
						};
						const fmcToken = await super.getByCustomOptions(req, 'UserTokens', options);
						req.params.id = fmcToken.dataValues.id;
						const deleteFcm = await super.deleteById(req, 'UserTokens');
						if (deleteFcm === 1) {
								requestHandler.sendSuccess(res, 'User Logged Out Successfully')();
						} else {
								requestHandler.throwError(400, 'bad request', 'User Already logged out Successfully')();
						}
				} catch (err) {
						requestHandler.sendError(req, res, err);
				}
		}
}

module.exports = AuthController;
