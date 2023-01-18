/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./apps/roots-api/src/app/app.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const app_service_1 = __webpack_require__("./apps/roots-api/src/app/app.service.ts");
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    // Get API welcome message
    getData() {
        return this.appService.getData();
    }
};
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], AppController.prototype, "getData", null);
AppController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./apps/roots-api/src/app/app.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const mailer_1 = __webpack_require__("@nestjs-modules/mailer");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const environment_1 = __webpack_require__("./apps/roots-api/src/environments/environment.ts");
const app_controller_1 = __webpack_require__("./apps/roots-api/src/app/app.controller.ts");
const app_service_1 = __webpack_require__("./apps/roots-api/src/app/app.service.ts");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const jwt_auth_guard_1 = __webpack_require__("./apps/roots-api/src/app/auth/jwt-auth.guard.ts");
const event_module_1 = __webpack_require__("./apps/roots-api/src/app/event/event.module.ts");
const log_module_1 = __webpack_require__("./apps/roots-api/src/app/log/log.module.ts");
const organization_module_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.module.ts");
const tag_module_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.module.ts");
const user_module_1 = __webpack_require__("./apps/roots-api/src/app/user/user.module.ts");
let AppModule = class AppModule {
};
AppModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(environment_1.environment.API_URL),
            user_module_1.UserModule,
            organization_module_1.OrganizationModule,
            event_module_1.EventModule,
            auth_module_1.AuthModule,
            tag_module_1.TagModule,
            log_module_1.LogModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: 'smtp.sendgrid.net',
                    auth: {
                        user: 'apikey',
                        pass: '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',
                    },
                    tls: {
                        rejectUnauthorized: false,
                    },
                },
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            app_service_1.AppService,
        ],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./apps/roots-api/src/app/app.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
let AppService = class AppService {
    // Get API welcome message
    getData() {
        return { message: 'Welkom bij de API van Roots!' };
    }
};
AppService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "./apps/roots-api/src/app/auth/auth.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const user_dto_1 = __webpack_require__("./apps/roots-api/src/app/user/user.dto.ts");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const auth_service_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.service.ts");
let AuthController = class AuthController {
    // Inject all dependencies
    constructor(authService) {
        this.authService = authService;
    }
    // Login user
    login(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.login(req.body);
        });
    }
    // Register user/organization
    register(UserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.register(UserDto);
        });
    }
    // Verify user
    verify(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.verify(body);
        });
    }
    // Resend verification mail
    resend(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.resendVerificationMail(body.emailAddress);
        });
    }
    // Send reset password mail
    forgotPassword(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.forgotPasswordMail(body.emailAddress);
        });
    }
    // Reset password
    resetPassword(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.authService.resetPassword(body.tokenId, body.password);
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('local')),
    (0, common_1.Post)('auth/login'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('auth/register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_b = typeof user_dto_1.UserDto !== "undefined" && user_dto_1.UserDto) === "function" ? _b : Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('auth/verify'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "verify", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('auth/resend'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "resend", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('auth/forgot_password'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('auth/reset_password'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),

/***/ "./apps/roots-api/src/app/auth/auth.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = exports.Public = exports.IS_PUBLIC_KEY = void 0;
const tslib_1 = __webpack_require__("tslib");
exports.IS_PUBLIC_KEY = 'isPublic';
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC_KEY, true);
exports.Public = Public;
const common_1 = __webpack_require__("@nestjs/common");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const passport_1 = __webpack_require__("@nestjs/passport");
const email_module_1 = __webpack_require__("./apps/roots-api/src/app/providers/email/email.module.ts");
const token_module_1 = __webpack_require__("./apps/roots-api/src/app/token/token.module.ts");
const user_module_1 = __webpack_require__("./apps/roots-api/src/app/user/user.module.ts");
const auth_controller_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.controller.ts");
const auth_service_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.service.ts");
const constants_1 = __webpack_require__("./apps/roots-api/src/app/auth/constants.ts");
const jwt_strategy_1 = __webpack_require__("./apps/roots-api/src/app/auth/jwt.strategy.ts");
const local_strategy_1 = __webpack_require__("./apps/roots-api/src/app/auth/local.strategy.ts");
let AuthModule = class AuthModule {
};
AuthModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            user_module_1.UserModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '2d' },
            }),
            email_module_1.MailModule,
            token_module_1.TokenModule,
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService],
        controllers: [auth_controller_1.AuthController],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./apps/roots-api/src/app/auth/auth.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const bcrypt = __webpack_require__("bcryptjs");
const email_service_1 = __webpack_require__("./apps/roots-api/src/app/providers/email/email.service.ts");
const ParseObjectIdPipe_1 = __webpack_require__("./apps/roots-api/src/app/shared/pipes/ParseObjectIdPipe.ts");
const token_service_1 = __webpack_require__("./apps/roots-api/src/app/token/token.service.ts");
const user_service_1 = __webpack_require__("./apps/roots-api/src/app/user/user.service.ts");
const constants_1 = __webpack_require__("./apps/roots-api/src/app/auth/constants.ts");
let AuthService = class AuthService {
    // Inject all dependencies
    constructor(userService, jwtService, mailService, tokenService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.mailService = mailService;
        this.tokenService = tokenService;
    }
    // Login user
    login(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const payload = { username: user.username || user.emailAddress };
            const loggedInUser = yield this.userService.findByEmailAddress(payload.username);
            return {
                _id: loggedInUser._id,
                firstname: loggedInUser.firstname,
                lastname: loggedInUser.lastname,
                emailAddress: loggedInUser.emailAddress,
                isVerified: loggedInUser.isVerified,
                organization: loggedInUser.organization,
                access_token: this.jwtService.sign(payload, constants_1.jwtConstants),
            };
        });
    }
    // Register new user/organization + create token + send verify mail
    register(UserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.create(UserDto);
            const token = yield this.tokenService.create('verification', user._id.toString());
            yield this.mailService.SendVerificationMail(user.emailAddress, user.firstname, token.verificationCode);
            return user;
        });
    }
    // Check if user is active
    validateUser(username, pass) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findByEmailAddress(username);
            if (user && (yield bcrypt.compareSync(pass, user.password))) {
                if (user.isActive === false) {
                    throw new common_1.HttpException(`Jouw account is gedeactiveerd!`, common_1.HttpStatus.BAD_REQUEST);
                }
                if (user.isVerified) {
                    yield this.userService.setLastLoginTimeStamp(user._id.toString());
                }
                return user;
            }
            throw new common_1.HttpException(`Incorrecte inloggegevens!`, common_1.HttpStatus.BAD_REQUEST);
        });
    }
    // Verify user
    verify(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //check if object id is valid
            if (!ParseObjectIdPipe_1.ParseObjectIdPipe.isValidObjectId(req.userId)) {
                throw new common_1.HttpException('Id is niet geldig!', common_1.HttpStatus.BAD_REQUEST);
            }
            //check if user exists (validation is elsewhere)
            const user = yield this.userService.getById(req.userId);
            //retrieve existing token
            const token = yield this.tokenService.getByUserId(req.userId, 'verification');
            //check if token is correct + not expired
            if (token.verificationCode === req.verificationCode &&
                token.expirationDate > new Date()) {
                //delete used token
                yield this.tokenService.delete(req.userId, 'verification');
                //change isVerified to true
                yield this.userService.verifyAccount(req.userId);
                //set first login timestamp
                yield this.userService.setLastLoginTimeStamp(req.userId);
                //login automatically
                return yield this.login({
                    username: user.emailAddress,
                    password: user.password,
                });
            }
            else {
                throw new common_1.HttpException('De verificatiecode is ongeldig!', common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
    // Resend verification mail
    resendVerificationMail(emailAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //retrieve user + check if exists
            const user = yield this.userService.findByEmailAddress(emailAddress);
            //delete previous token
            yield this.tokenService.delete(user._id.toString(), 'verification');
            //create new token
            const token = yield this.tokenService.create('verification', user._id.toString());
            //send email with new verificationcode
            yield this.mailService.SendVerificationMail(user.emailAddress, user.firstname, token.verificationCode);
            return {
                status: 200,
                message: 'Verification Email has been sent!',
            };
        });
    }
    // Send forgot password mail
    forgotPasswordMail(emailAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //retrieve user + check if exists
            const user = yield this.userService.findByEmailAddress(emailAddress);
            //delete previous tokens (if there are any)
            yield this.tokenService.delete(user._id.toString(), 'password_reset');
            //create new token
            const token = yield this.tokenService.create('password_reset', user._id.toString());
            //send email with link for password reset
            yield this.mailService.SendPasswordResetMail(user.emailAddress, user.firstname, token._id.toString());
            return {
                status: 200,
                message: 'Reset Password Email has been sent!',
            };
        });
    }
    // Reset password
    resetPassword(tokenId, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            //retrieve user + check if exists
            const token = yield this.tokenService.getById(tokenId);
            //delete previous tokens (if there are any)
            yield this.tokenService.delete(token.userId.toString(), 'password_reset');
            if (token.expirationDate > new Date()) {
                //reset password
                yield this.userService.setPassword(token.userId.toString(), password);
                return {
                    status: 200,
                    message: 'Password has been reset!',
                };
            }
            else {
                throw new common_1.HttpException('Token is ongeldig!', common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
};
AuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object, typeof (_b = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _b : Object, typeof (_c = typeof email_service_1.MailService !== "undefined" && email_service_1.MailService) === "function" ? _c : Object, typeof (_d = typeof token_service_1.TokenService !== "undefined" && token_service_1.TokenService) === "function" ? _d : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./apps/roots-api/src/app/auth/constants.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.jwtConstants = void 0;
exports.jwtConstants = {
    secret: 'secretKey',
};


/***/ }),

/***/ "./apps/roots-api/src/app/auth/jwt-auth.guard.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtAuthGuard = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const passport_1 = __webpack_require__("@nestjs/passport");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    // Create Guard to check if user is authenticated
    canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(auth_module_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
};
JwtAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),

/***/ "./apps/roots-api/src/app/auth/jwt.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JwtStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const passport_jwt_1 = __webpack_require__("passport-jwt");
const user_service_1 = __webpack_require__("./apps/roots-api/src/app/user/user.service.ts");
const constants_1 = __webpack_require__("./apps/roots-api/src/app/auth/constants.ts");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(userService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
        this.userService = userService;
    }
    // Check if user JWT token is valid
    validate(payload) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.findByEmailAddress(payload.username);
            if (user) {
                return user;
            }
            else {
                throw new common_1.HttpException('Login is verlopen!', common_1.HttpStatus.UNAUTHORIZED);
            }
        });
    }
};
JwtStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),

/***/ "./apps/roots-api/src/app/auth/local.strategy.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const passport_local_1 = __webpack_require__("passport-local");
const auth_service_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super();
        this.authService = authService;
    }
    // Check if user exists
    validate(username, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.authService.validateUser(username, password);
            if (!user) {
                throw new common_1.HttpException(`Er is geen gebruiker gevonden met het opgegeven e-mailadres!`, common_1.HttpStatus.NOT_FOUND);
            }
            return user;
        });
    }
};
LocalStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),

/***/ "./apps/roots-api/src/app/event/event.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const event_dto_1 = __webpack_require__("./apps/roots-api/src/app/event/event.dto.ts");
const event_service_1 = __webpack_require__("./apps/roots-api/src/app/event/event.service.ts");
let EventController = class EventController {
    // Inject all dependencies
    constructor(eventService) {
        this.eventService = eventService;
    }
    // Get all events
    getAllEvents(organizationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log('Retrieving all events (READ)');
            return yield this.eventService.getAll(organizationId);
        });
    }
    // Get an amount of events to show on page
    getEventsPerPage(organizationId, query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log('Retrieving events with filter (READ)');
            return yield this.eventService.getPerPage(query, organizationId);
        });
    }
    // Get event by ID
    getEventById(eventId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Retrieve event with id: ${eventId} (READ)`);
                return yield this.eventService.getById(eventId);
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
        });
    }
    // Create new event
    createEvent(companyId, eventDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Create event (POST)`);
                const event = yield this.eventService.create(companyId, eventDto);
                return {
                    status: 201,
                    message: 'De gebeurtenis is succesvol aangemaakt!',
                };
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
        });
    }
    // Update event
    updateEvent(companyId, eventId, eventDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Update event ${eventId} from company ${companyId} (PUT)`);
                const event = yield this.eventService.update(eventId, eventDto);
                return {
                    status: 200,
                    message: 'De gebeurtenis is succesvol aangepast!',
                };
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_MODIFIED);
            }
        });
    }
    // Archive/Dearchive event
    archiveEvent(companyId, eventId, isActive) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(isActive
                    ? 'Archiveren'
                    : 'Dearchiveren' + ` event  from ${eventId} from company ${companyId}`);
                return yield this.eventService.archive(eventId, isActive);
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_MODIFIED);
            }
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)('/organization/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], EventController.prototype, "getAllEvents", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)(':id/filter'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], EventController.prototype, "getEventsPerPage", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], EventController.prototype, "getEventById", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('new/:companyId')
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    tslib_1.__param(0, (0, common_1.Param)('companyId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_e = typeof event_dto_1.EventDto !== "undefined" && event_dto_1.EventDto) === "function" ? _e : Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], EventController.prototype, "createEvent", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Put)(':companyId/:eventId/edit')
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    tslib_1.__param(0, (0, common_1.Param)('companyId')),
    tslib_1.__param(1, (0, common_1.Param)('eventId')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, typeof (_g = typeof event_dto_1.EventDto !== "undefined" && event_dto_1.EventDto) === "function" ? _g : Object]),
    tslib_1.__metadata("design:returntype", typeof (_h = typeof Promise !== "undefined" && Promise) === "function" ? _h : Object)
], EventController.prototype, "updateEvent", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Put)(':companyId/:eventId/archive'),
    tslib_1.__param(0, (0, common_1.Param)('companyId')),
    tslib_1.__param(1, (0, common_1.Param)('eventId')),
    tslib_1.__param(2, (0, common_1.Query)('isActive')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Boolean]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], EventController.prototype, "archiveEvent", null);
EventController = tslib_1.__decorate([
    (0, common_1.Controller)('events'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof event_service_1.EventService !== "undefined" && event_service_1.EventService) === "function" ? _a : Object])
], EventController);
exports.EventController = EventController;


/***/ }),

/***/ "./apps/roots-api/src/app/event/event.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class EventDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Titel moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Titel is verplicht!' }),
    (0, class_validator_1.MaxLength)(75, { message: 'Titel mag maximaal 75 karakters bevatten!' }),
    tslib_1.__metadata("design:type", String)
], EventDto.prototype, "title", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Beschrijving moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Beschrijving is verplicht!' }),
    (0, class_validator_1.MaxLength)(150, { message: 'Beschrijving mag maximaal 150 karakters bevatten!' }),
    tslib_1.__metadata("design:type", String)
], EventDto.prototype, "description", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Inhoud moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Inhoud is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], EventDto.prototype, "content", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsDefined)({ message: 'Gebeurtenisdatum is verplicht!' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], EventDto.prototype, "eventDate", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsBoolean)({ message: 'IsActive moet van het type boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], EventDto.prototype, "isActive", void 0);
exports.EventDto = EventDto;


/***/ }),

/***/ "./apps/roots-api/src/app/event/event.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
const event_controller_1 = __webpack_require__("./apps/roots-api/src/app/event/event.controller.ts");
const event_schema_1 = __webpack_require__("./apps/roots-api/src/app/event/event.schema.ts");
const event_service_1 = __webpack_require__("./apps/roots-api/src/app/event/event.service.ts");
let EventModule = class EventModule {
};
EventModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: Event.name, schema: event_schema_1.EventSchema },
                { name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema }
            ]),
        ],
        providers: [event_service_1.EventService],
        controllers: [event_controller_1.EventController],
        exports: [event_service_1.EventService],
    })
], EventModule);
exports.EventModule = EventModule;


/***/ }),

/***/ "./apps/roots-api/src/app/event/event.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventSchema = exports.Event = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
let Event = class Event {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Titel is verplicht!'],
        maxLength: [75, 'Titel mag maximaal 75 karakters bevatten!']
    }),
    tslib_1.__metadata("design:type", String)
], Event.prototype, "title", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Beschrijving is verplicht!'],
        maxLength: [150, 'Beschrijving mag maximaal 150 karakters bevatten!']
    }),
    tslib_1.__metadata("design:type", String)
], Event.prototype, "description", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Inhoud is verplicht!']
    }),
    tslib_1.__metadata("design:type", String)
], Event.prototype, "content", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: [true, 'Gebeurtenisdatum is verplicht!']
    }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Event.prototype, "eventDate", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        default: [],
        type: [mongoose_2.Types.ObjectId]
    }),
    tslib_1.__metadata("design:type", Array)
], Event.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        default: true
    }),
    tslib_1.__metadata("design:type", Boolean)
], Event.prototype, "isActive", void 0);
Event = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Event);
exports.Event = Event;
exports.EventSchema = mongoose_1.SchemaFactory.createForClass(Event);


/***/ }),

/***/ "./apps/roots-api/src/app/event/event.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
const event_schema_1 = __webpack_require__("./apps/roots-api/src/app/event/event.schema.ts");
let EventService = class EventService {
    // Inject all dependencies
    constructor(eventModel, organizationModel) {
        this.eventModel = eventModel;
        this.organizationModel = organizationModel;
    }
    // Get all events
    getAll(organizationId) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const events = yield this.organizationModel.aggregate([
                {
                    $match: {
                        _id: new mongoose_2.Types.ObjectId(organizationId),
                    },
                },
                {
                    $unwind: {
                        path: '$events',
                    },
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events',
                    },
                },
                {
                    $sort: {
                        'events.eventDate': -1,
                    },
                },
                {
                    $group: {
                        _id: null,
                        events: {
                            $push: {
                                _id: {
                                    $first: '$events._id',
                                },
                                title: {
                                    $first: '$events.title',
                                },
                                description: {
                                    $first: '$events.description',
                                },
                                eventDate: {
                                    $first: '$events.eventDate',
                                },
                                isActive: {
                                    $first: '$events.isActive',
                                },
                                tags: {
                                    $first: '$events.tags',
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        events: 1,
                    },
                },
            ]);
            return (_a = events[0]) === null || _a === void 0 ? void 0 : _a.events;
        });
    }
    // Get amount of events per page + filter
    getPerPage(query, organizationId) {
        var _a, _b, _c, _d, _e, _f, _g;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const events = yield this.organizationModel.aggregate([
                {
                    $match: {
                        _id: new mongoose_2.Types.ObjectId(organizationId),
                    },
                },
                {
                    $unwind: {
                        path: '$events',
                    },
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events',
                    },
                },
                {
                    $sort: {
                        'events.eventDate': -1,
                    },
                },
                {
                    $group: {
                        _id: null,
                        events: {
                            $push: {
                                _id: {
                                    $first: '$events._id',
                                },
                                title: {
                                    $first: '$events.title',
                                },
                                description: {
                                    $first: '$events.description',
                                },
                                eventDate: {
                                    $first: '$events.eventDate',
                                },
                                isActive: {
                                    $first: '$events.isActive',
                                },
                                tags: {
                                    $first: '$events.tags',
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        events: 1,
                    },
                },
            ]);
            if (query.old_records &&
                query.new_records &&
                query.show_archived_events === 'true') {
                return (_a = events[0]) === null || _a === void 0 ? void 0 : _a.events.slice(Number(query.old_records), Number(query.new_records) + Number(query.old_records));
            }
            else if (query.old_records &&
                query.new_records &&
                query.show_archived_events === 'false') {
                const activeEvents = [];
                (_c = (_b = events[0]) === null || _b === void 0 ? void 0 : _b.events) === null || _c === void 0 ? void 0 : _c.forEach((event) => {
                    if (event.isActive) {
                        activeEvents.push(event);
                    }
                });
                return activeEvents.slice(Number(query.old_records), Number(query.new_records) + Number(query.old_records));
            }
            else if (query.term && query.show_archived_events === 'true') {
                const matchingEvents = [];
                (_e = (_d = events[0]) === null || _d === void 0 ? void 0 : _d.events) === null || _e === void 0 ? void 0 : _e.forEach((event) => {
                    if (event.title.includes(query.term)) {
                        matchingEvents.push(event);
                    }
                });
                return matchingEvents;
            }
            else if (query.term && query.show_archived_events === 'false') {
                const matchingEvents = [];
                (_g = (_f = events[0]) === null || _f === void 0 ? void 0 : _f.events) === null || _g === void 0 ? void 0 : _g.forEach((event) => {
                    if (event.title.includes(query.term) && event.isActive) {
                        matchingEvents.push(event);
                    }
                });
                return matchingEvents;
            }
        });
    }
    // Get event by ID
    getById(id) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const event = yield this.organizationModel.aggregate([
                {
                    $unwind: {
                        path: '$events',
                    },
                },
                {
                    $lookup: {
                        from: 'events',
                        localField: 'events',
                        foreignField: '_id',
                        as: 'events',
                    },
                },
                {
                    $match: {
                        'events._id': new mongoose_2.default.Types.ObjectId(id),
                    },
                },
                {
                    $project: {
                        _id: 0,
                        events: 1,
                    },
                },
            ]);
            if (event.length === 0)
                throw new common_1.HttpException(`Deze gebeurtenis bestaat niet!`, common_1.HttpStatus.NOT_FOUND);
            return (_a = event[0]) === null || _a === void 0 ? void 0 : _a.events[0];
        });
    }
    // Create new organization
    create(organizationId, eventDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const event = yield this.eventModel.create(eventDto);
            const updatedOrganizationEvents = yield this.organizationModel.findOneAndUpdate({ _id: organizationId }, { $push: { events: event._id } }, {
                new: true,
                runValidators: true,
            });
            if (!updatedOrganizationEvents)
                throw new common_1.HttpException(`Dit bedrijf bestaat niet!`, common_1.HttpStatus.NOT_FOUND);
            return updatedOrganizationEvents;
        });
    }
    // Update organization
    update(eventId, eventDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updatedEventFromOrganization = yield this.eventModel.findOneAndUpdate({ _id: eventId }, {
                $set: {
                    title: eventDto === null || eventDto === void 0 ? void 0 : eventDto.title,
                    description: eventDto === null || eventDto === void 0 ? void 0 : eventDto.description,
                    content: eventDto === null || eventDto === void 0 ? void 0 : eventDto.content,
                    tags: eventDto === null || eventDto === void 0 ? void 0 : eventDto.tags,
                    eventDate: eventDto === null || eventDto === void 0 ? void 0 : eventDto.eventDate,
                },
            }, {
                new: true,
                runValidators: true,
            });
            if (!updatedEventFromOrganization)
                throw new common_1.HttpException(`Deze gebeurtenis bestaat niet!`, common_1.HttpStatus.NOT_FOUND);
            return updatedEventFromOrganization;
        });
    }
    // Archive/Dearchive event
    archive(eventId, isActive) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updatedArchive = yield this.eventModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(eventId) }, {
                $set: {
                    isActive: isActive,
                },
            }, {
                new: true,
                runValidators: true,
            });
            if (!updatedArchive)
                throw new common_1.HttpException(`Deze gebeurtenis bestaat niet!`, common_1.HttpStatus.NOT_FOUND);
            return yield this.getById(eventId);
        });
    }
};
EventService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], EventService);
exports.EventService = EventService;


/***/ }),

/***/ "./apps/roots-api/src/app/log/log.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const log_dto_1 = __webpack_require__("./apps/roots-api/src/app/log/log.dto.ts");
const log_service_1 = __webpack_require__("./apps/roots-api/src/app/log/log.service.ts");
let LogController = class LogController {
    constructor(logService) {
        this.logService = logService;
    }
    getAll(organizationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Retrieve logs (READ)`);
            return yield this.logService.getAll(organizationId);
        });
    }
    createLog(organizationId, logDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.logService.create(organizationId, logDto);
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)(':organizationId'),
    tslib_1.__param(0, (0, common_1.Param)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], LogController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Put)(':organizationId'),
    tslib_1.__param(0, (0, common_1.Param)('organizationId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_c = typeof log_dto_1.LogDTO !== "undefined" && log_dto_1.LogDTO) === "function" ? _c : Object]),
    tslib_1.__metadata("design:returntype", typeof (_d = typeof Promise !== "undefined" && Promise) === "function" ? _d : Object)
], LogController.prototype, "createLog", null);
LogController = tslib_1.__decorate([
    (0, common_1.Controller)('log'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof log_service_1.LogService !== "undefined" && log_service_1.LogService) === "function" ? _a : Object])
], LogController);
exports.LogController = LogController;


/***/ }),

/***/ "./apps/roots-api/src/app/log/log.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogDTO = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class LogDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Editor moet van het type string zijn!' }),
    tslib_1.__metadata("design:type", String)
], LogDTO.prototype, "editor", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Action moet van het type string zijn!' }),
    tslib_1.__metadata("design:type", String)
], LogDTO.prototype, "action", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Object moet van het type string zijn!' }),
    tslib_1.__metadata("design:type", String)
], LogDTO.prototype, "object", void 0);
exports.LogDTO = LogDTO;


/***/ }),

/***/ "./apps/roots-api/src/app/log/log.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const data_1 = __webpack_require__("./libs/data/src/index.ts");
const log_controller_1 = __webpack_require__("./apps/roots-api/src/app/log/log.controller.ts");
const log_service_1 = __webpack_require__("./apps/roots-api/src/app/log/log.service.ts");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
const log_schema_1 = __webpack_require__("./apps/roots-api/src/app/log/log.schema.ts");
let LogModule = class LogModule {
};
LogModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: log_schema_1.Log.name, schema: log_schema_1.LogSchema }, {
                    name: data_1.Organization.name, schema: organization_schema_1.OrganizationSchema
                }]),
        ],
        providers: [log_service_1.LogService],
        controllers: [log_controller_1.LogController],
        exports: [mongoose_1.MongooseModule, log_service_1.LogService],
    })
], LogModule);
exports.LogModule = LogModule;


/***/ }),

/***/ "./apps/roots-api/src/app/log/log.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogSchema = exports.Log = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const class_validator_1 = __webpack_require__("class-validator");
let Log = class Log {
};
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Editor moet van het type string zijn!' }),
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Log.prototype, "editor", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Action moet van het type string zijn!' }),
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Log.prototype, "action", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Object moet van het type string zijn!' }),
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Log.prototype, "object", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({ default: new Date() }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Log.prototype, "logStamp", void 0);
Log = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Log);
exports.Log = Log;
exports.LogSchema = mongoose_1.SchemaFactory.createForClass(Log);


/***/ }),

/***/ "./apps/roots-api/src/app/log/log.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const data_1 = __webpack_require__("./libs/data/src/index.ts");
const mongoose_2 = __webpack_require__("mongoose");
const log_schema_1 = __webpack_require__("./apps/roots-api/src/app/log/log.schema.ts");
let LogService = class LogService {
    constructor(LogModel, organizationModel) {
        this.LogModel = LogModel;
        this.organizationModel = organizationModel;
    }
    getAll(organizationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationModel.findOne({ _id: organizationId }, { logs: 1 });
        });
    }
    create(organizationId, logDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationModel.findOneAndUpdate({ _id: organizationId }, {
                $push: {
                    logs: logDto,
                },
            }, {
                new: true,
                runValidators: true,
            });
        });
    }
};
LogService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(log_schema_1.Log.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(data_1.Organization.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object])
], LogService);
exports.LogService = LogService;


/***/ }),

/***/ "./apps/roots-api/src/app/organization/organization.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const ParseObjectIdPipe_1 = __webpack_require__("./apps/roots-api/src/app/shared/pipes/ParseObjectIdPipe.ts");
const organization_dto_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.dto.ts");
const organization_service_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.service.ts");
let OrganizationController = class OrganizationController {
    // Inject all dependencies
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    // Get all organizations
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Retrieve organization (READ)`);
            return yield this.organizationService.getAll();
        });
    }
    // Get organization by ID
    getById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Retrieve organization with id: ${id} (READ)`);
            return yield this.organizationService.getById(id);
        });
    }
    // Create new organization
    createCommunity(createOrganizationDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationService.create(createOrganizationDto);
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)('organizations'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], OrganizationController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)('organizations/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], OrganizationController.prototype, "getById", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('organizations'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof organization_dto_1.CreateOrganizationDTO !== "undefined" && organization_dto_1.CreateOrganizationDTO) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], OrganizationController.prototype, "createCommunity", null);
OrganizationController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof organization_service_1.OrganizationService !== "undefined" && organization_service_1.OrganizationService) === "function" ? _a : Object])
], OrganizationController);
exports.OrganizationController = OrganizationController;


/***/ }),

/***/ "./apps/roots-api/src/app/organization/organization.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateOrganizationDTO = exports.CreateOrganizationDTO = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const class_validator_1 = __webpack_require__("class-validator");
class CreateOrganizationDTO {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Naam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Naam is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], CreateOrganizationDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Email domein moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Email domein is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], CreateOrganizationDTO.prototype, "emailDomain", void 0);
exports.CreateOrganizationDTO = CreateOrganizationDTO;
class UpdateOrganizationDTO {
}
tslib_1.__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)({ message: 'Naam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Naam is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, common_1.Optional)(),
    (0, class_validator_1.IsString)({ message: 'Email domein moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Email domein is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], UpdateOrganizationDTO.prototype, "emailDomain", void 0);
exports.UpdateOrganizationDTO = UpdateOrganizationDTO;


/***/ }),

/***/ "./apps/roots-api/src/app/organization/organization.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const organization_controller_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.controller.ts");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
const organization_service_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.service.ts");
let OrganizationModule = class OrganizationModule {
};
OrganizationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema }]),
        ],
        providers: [organization_service_1.OrganizationService],
        controllers: [organization_controller_1.OrganizationController],
        exports: [mongoose_1.MongooseModule, organization_service_1.OrganizationService],
    })
], OrganizationModule);
exports.OrganizationModule = OrganizationModule;


/***/ }),

/***/ "./apps/roots-api/src/app/organization/organization.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationSchema = exports.Organization = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const class_validator_1 = __webpack_require__("class-validator");
const mongoose_2 = __webpack_require__("mongoose");
const log_schema_1 = __webpack_require__("./apps/roots-api/src/app/log/log.schema.ts");
let Organization = class Organization {
};
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Naam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Naam is verplicht!' }),
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "name", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Email domein moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Email domein is verplicht!' }),
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Organization.prototype, "emailDomain", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        default: [],
        type: [mongoose_2.Types.ObjectId]
    }),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "events", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        default: [],
        type: [mongoose_2.Types.ObjectId]
    }),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        default: [],
        type: [log_schema_1.LogSchema]
    }),
    tslib_1.__metadata("design:type", Array)
], Organization.prototype, "logs", void 0);
Organization = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Organization);
exports.Organization = Organization;
exports.OrganizationSchema = mongoose_1.SchemaFactory.createForClass(Organization);


/***/ }),

/***/ "./apps/roots-api/src/app/organization/organization.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OrganizationService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
let OrganizationService = class OrganizationService {
    // Inject all dependencies
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }
    // Get organization by email domain
    getByEmailDomain(emailDomain) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const organization = yield this.organizationModel.findOne({ emailDomain });
            if (!organization)
                throw new common_1.HttpException('Er bestaat geen organisatie met het opgegeven email domein!', common_1.HttpStatus.NOT_FOUND);
            return organization;
        });
    }
    // Get organization by ID
    getById(_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const organization = yield this.organizationModel.findOne({ _id });
            if (!organization)
                throw new common_1.HttpException('Organisatie bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return organization;
        });
    }
    // Get all organizations
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationModel.find();
        });
    }
    // Create new organization
    create(createOrganizationDTO) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.validate(createOrganizationDTO);
            const newOrganization = new this.organizationModel(Object.assign({}, createOrganizationDTO));
            return yield this.organizationModel.create(newOrganization);
        });
    }
    // Check if organization already exists
    validate(organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((yield this.organizationModel.find({ name: organization.name })).length > 0) {
                throw new common_1.HttpException(`Er bestaat al een bedrijf met de opgegeven naam!`, common_1.HttpStatus.BAD_REQUEST);
            }
            if ((yield this.organizationModel.find({ emailDomain: organization.emailDomain })).length > 0) {
                throw new common_1.HttpException(`Er bestaat al een bedrijf met het opgegeven email domein!`, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
};
OrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], OrganizationService);
exports.OrganizationService = OrganizationService;


/***/ }),

/***/ "./apps/roots-api/src/app/providers/email/email.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const email_service_1 = __webpack_require__("./apps/roots-api/src/app/providers/email/email.service.ts");
let MailModule = class MailModule {
};
MailModule = tslib_1.__decorate([
    (0, common_1.Module)({
        providers: [email_service_1.MailService],
        exports: [email_service_1.MailService],
    })
], MailModule);
exports.MailModule = MailModule;


/***/ }),

/***/ "./apps/roots-api/src/app/providers/email/email.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailService = void 0;
const tslib_1 = __webpack_require__("tslib");
const mailer_1 = __webpack_require__("@nestjs-modules/mailer");
const common_1 = __webpack_require__("@nestjs/common");
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
const environment_1 = __webpack_require__("./apps/roots-api/src/environments/environment.ts");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
let MailService = class MailService {
    // Inject all dependencies
    constructor(mailService) {
        this.mailService = mailService;
    }
    // Send verification mail
    SendVerificationMail(email, receiverName, verificationCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.mailService.sendMail({
                to: email,
                from: environment_1.environment.EMAIL_SENDINGEMAIL,
                subject: 'Roots | E-mailverificatie',
                html: `<div style="font-family: Helvetica, sans-serif"> <h1 style="font-weight: bold">Welkom bij Roots, ${receiverName}!</h1> <p>Gebruik de onderstaande code om je account te verifiëren.</p> <p style="font-size:24px; color: #1353d9; font-weight:900;">${verificationCode}</p> <p style="font-size: 11px; font-style: italic; margin-top: 15px">De code is voor de volgende 24 uur geldig.</p> <p style="font-size: 14px; margin-top: 25px">Groetjes het Roots-team</p> </div>`,
            });
        });
    }
    // Send reset password mail
    SendPasswordResetMail(email, receiverName, tokenId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const link = environment_1.environment.APPLICATION_URL + '/password_reset/' + tokenId;
            yield this.mailService.sendMail({
                to: email,
                from: environment_1.environment.EMAIL_SENDINGEMAIL,
                subject: 'Roots | Wachtwoord resetten',
                html: `<div style="font-family: Helvetica, sans-serif"> <h1 style="font-weight: bold">Hallo ${receiverName}!</h1> <p style="padding-bottom:15px;">Druk op de onderstaande knop om je wachtwoord opnieuw in te stellen.</p> <a href="${link}" style="color: white; background: #1353d9; text-decoration: none; padding: 10px 28px;"> Wachtwoord instellen </a> <p style="font-size: 11px; font-style: italic; margin-top: 30px">De code is voor de volgende 24 uur geldig.</p> <p style="font-size: 14px; margin-top: 25px">Groetjes het Roots-team</p></div>`,
            });
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MailService.prototype, "SendVerificationMail", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], MailService.prototype, "SendPasswordResetMail", null);
MailService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mailer_1.MailerService !== "undefined" && mailer_1.MailerService) === "function" ? _a : Object])
], MailService);
exports.MailService = MailService;


/***/ }),

/***/ "./apps/roots-api/src/app/shared/filters/validation.exception.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationException = void 0;
const common_1 = __webpack_require__("@nestjs/common");
class ValidationException extends common_1.BadRequestException {
    constructor(validationErrors) {
        super();
        this.validationErrors = validationErrors;
    }
}
exports.ValidationException = ValidationException;


/***/ }),

/***/ "./apps/roots-api/src/app/shared/filters/validation.filter.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ValidationFilter = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const validation_exception_1 = __webpack_require__("./apps/roots-api/src/app/shared/filters/validation.exception.ts");
let ValidationFilter = class ValidationFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        return response.status(400).json({
            statusCode: 400,
            timestamp: new Date().toISOString(),
            errors: exception.validationErrors,
        });
    }
};
ValidationFilter = tslib_1.__decorate([
    (0, common_1.Catch)(validation_exception_1.ValidationException)
], ValidationFilter);
exports.ValidationFilter = ValidationFilter;


/***/ }),

/***/ "./apps/roots-api/src/app/shared/pipes/ParseObjectIdPipe.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParseObjectIdPipe = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongodb_1 = __webpack_require__("mongodb");
const validation_exception_1 = __webpack_require__("./apps/roots-api/src/app/shared/filters/validation.exception.ts");
let ParseObjectIdPipe = class ParseObjectIdPipe {
    transform(value) {
        try {
            const transformedObjectId = mongodb_1.ObjectId.createFromHexString(value);
            return transformedObjectId;
        }
        catch (error) {
            throw new validation_exception_1.ValidationException([
                `ObjectId has wrong value: ${value}, ObjectId is not valid!`,
            ]);
        }
    }
    static isValidObjectId(value) {
        try {
            mongodb_1.ObjectId.createFromHexString(value);
            return true;
        }
        catch (error) {
            return false;
        }
    }
};
ParseObjectIdPipe = tslib_1.__decorate([
    (0, common_1.Injectable)()
], ParseObjectIdPipe);
exports.ParseObjectIdPipe = ParseObjectIdPipe;


/***/ }),

/***/ "./apps/roots-api/src/app/tag/tag.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagController = void 0;
const tslib_1 = __webpack_require__("tslib");
/* eslint-disable @typescript-eslint/ban-types */
const common_1 = __webpack_require__("@nestjs/common");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const ParseObjectIdPipe_1 = __webpack_require__("./apps/roots-api/src/app/shared/pipes/ParseObjectIdPipe.ts");
const tag_dto_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.dto.ts");
const tag_service_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.service.ts");
let TagController = class TagController {
    // Inject all dependencies
    constructor(tagService) {
        this.tagService = tagService;
    }
    // Get all tags from organization
    getAllTagsByOrganization(organizationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log('Retrieving all tags by organization (READ)');
            return yield this.tagService.getAllByOrganization(organizationId);
        });
    }
    // Get tag by id
    getTagById(tagId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Retrieve tag with id: ${tagId} (READ)`);
                return yield this.tagService.getById(tagId);
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
        });
    }
    // Create new event tag
    createTagInEvent(organizationId, eventId, tagDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Create tag (POST)`);
                yield this.tagService.createInEvent(organizationId, eventId, tagDto);
                return {
                    status: 201,
                    message: 'De tag is succesvol aangemaakt!',
                };
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
        });
    }
    // Create new organization tag
    createTagInOrganization(organizationId, tagDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Create tag (POST)`);
                const tag = yield this.tagService.createInOrganization(organizationId, tagDto);
                return {
                    status: 201,
                    message: 'De tag is succesvol aangemaakt!',
                };
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
        });
    }
    // Update tag
    updateTag(tagId, tagDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                common_1.Logger.log(`Update tag ${tagId} (PUT)`);
                const tag = yield this.tagService.update(tagId, tagDto);
                return {
                    status: 200,
                    message: 'De tag is succesvol aangepast!',
                };
            }
            catch (error) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_MODIFIED);
            }
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)('organizations/:organizationId'),
    tslib_1.__param(0, (0, common_1.Param)('organizationId', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], TagController.prototype, "getAllTagsByOrganization", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)(':tagId'),
    tslib_1.__param(0, (0, common_1.Param)('tagId', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], TagController.prototype, "getTagById", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('new/organizations/:organizationId/events/:eventId')
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    tslib_1.__param(0, (0, common_1.Param)('organizationId', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__param(1, (0, common_1.Param)('eventId', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, typeof (_d = typeof tag_dto_1.TagDto !== "undefined" && tag_dto_1.TagDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], TagController.prototype, "createTagInEvent", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Post)('new/organizations/:organizationId')
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    tslib_1.__param(0, (0, common_1.Param)('organizationId', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_f = typeof tag_dto_1.TagDto !== "undefined" && tag_dto_1.TagDto) === "function" ? _f : Object]),
    tslib_1.__metadata("design:returntype", typeof (_g = typeof Promise !== "undefined" && Promise) === "function" ? _g : Object)
], TagController.prototype, "createTagInOrganization", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Put)(':tagId')
    // eslint-disable-next-line @typescript-eslint/ban-types
    ,
    tslib_1.__param(0, (0, common_1.Param)('tagId', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, typeof (_h = typeof tag_dto_1.TagDto !== "undefined" && tag_dto_1.TagDto) === "function" ? _h : Object]),
    tslib_1.__metadata("design:returntype", typeof (_j = typeof Promise !== "undefined" && Promise) === "function" ? _j : Object)
], TagController.prototype, "updateTag", null);
TagController = tslib_1.__decorate([
    (0, common_1.Controller)('tags'),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof tag_service_1.TagService !== "undefined" && tag_service_1.TagService) === "function" ? _a : Object])
], TagController);
exports.TagController = TagController;


/***/ }),

/***/ "./apps/roots-api/src/app/tag/tag.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class TagDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Naam is verplicht!' }),
    (0, class_validator_1.IsDefined)({ message: 'Naam is verplicht!' }),
    (0, class_validator_1.MaxLength)(15, { message: 'Naam is te lang!' }),
    (0, class_validator_1.IsString)({ message: 'Name moet van het type string zijn!' }),
    tslib_1.__metadata("design:type", String)
], TagDto.prototype, "name", void 0);
exports.TagDto = TagDto;


/***/ }),

/***/ "./apps/roots-api/src/app/tag/tag.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const event_schema_1 = __webpack_require__("./apps/roots-api/src/app/event/event.schema.ts");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
const tag_controller_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.controller.ts");
const tag_schema_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.schema.ts");
const tag_service_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.service.ts");
let TagModule = class TagModule {
};
TagModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: tag_schema_1.Tag.name, schema: tag_schema_1.TagSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: organization_schema_1.Organization.name, schema: organization_schema_1.OrganizationSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: Event.name, schema: event_schema_1.EventSchema }])
        ],
        providers: [tag_service_1.TagService],
        controllers: [tag_controller_1.TagController],
        exports: [mongoose_1.MongooseModule, tag_service_1.TagService],
    })
], TagModule);
exports.TagModule = TagModule;


/***/ }),

/***/ "./apps/roots-api/src/app/tag/tag.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagSchema = exports.Tag = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
let Tag = class Tag {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true
    }),
    tslib_1.__metadata("design:type", String)
], Tag.prototype, "name", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId, required: true
    }),
    tslib_1.__metadata("design:type", typeof (_a = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _a : Object)
], Tag.prototype, "organization", void 0);
Tag = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Tag);
exports.Tag = Tag;
exports.TagSchema = mongoose_1.SchemaFactory.createForClass(Tag);


/***/ }),

/***/ "./apps/roots-api/src/app/tag/tag.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TagService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const organization_schema_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.schema.ts");
const tag_schema_1 = __webpack_require__("./apps/roots-api/src/app/tag/tag.schema.ts");
const event_schema_1 = __webpack_require__("./apps/roots-api/src/app/event/event.schema.ts");
let TagService = class TagService {
    // Inject all dependencies
    constructor(tagModel, organizationModel, eventModel) {
        this.tagModel = tagModel;
        this.organizationModel = organizationModel;
        this.eventModel = eventModel;
    }
    // Get all tags from organization
    getAllByOrganization(organizationId) {
        var e_1, _a;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const organizationTagIds = yield this.organizationModel.findOne({ _id: new mongoose_2.Types.ObjectId(organizationId) }, { tags: 1 });
            if (!organizationTagIds)
                throw new common_1.HttpException('Organisatie niet gevonden', common_1.HttpStatus.NOT_FOUND);
            // eslint-disable-next-line prefer-const
            let tags = [];
            try {
                for (var _b = tslib_1.__asyncValues(organizationTagIds.tags), _c; _c = yield _b.next(), !_c.done;) {
                    const tagId = _c.value;
                    const tag = yield this.tagModel.findOne({
                        _id: new mongoose_2.Types.ObjectId(tagId),
                    });
                    tags.push({
                        _id: tag._id,
                        name: tag.name,
                        organisation: tag.organization,
                    });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return tags;
        });
    }
    // Get tag by ID
    getById(tagId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const tag = yield this.tagModel.findOne({ _id: new mongoose_2.Types.ObjectId(tagId) });
            if (!tag)
                throw new common_1.HttpException('Tag niet gevonden', common_1.HttpStatus.NOT_FOUND);
            return tag;
        });
    }
    // Create event tag
    createInEvent(organizationId, eventId, tagDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // validation
            const organization = yield this.organizationModel.findOne({
                _id: new mongoose_2.Types.ObjectId(organizationId),
            });
            if (!organization)
                throw new common_1.HttpException('Organisatie niet gevonden', common_1.HttpStatus.NOT_FOUND);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const event = (yield organization).events
                .filter((p) => new mongoose_2.Types.ObjectId(p._id).equals(new mongoose_2.Types.ObjectId(eventId)))
                .at(0);
            if (!event)
                throw new common_1.HttpException(`Event niet gevonden van organisatie met id: ${organizationId}`, common_1.HttpStatus.NOT_FOUND);
            // new tag
            const newTag = new this.tagModel(Object.assign(Object.assign({}, tagDto), { organization: new mongoose_2.Types.ObjectId(organizationId) }));
            // create new tag in collection
            const tag = yield this.tagModel.create(newTag);
            if (!tag)
                throw new common_1.HttpException('Kan geen nieuwe tag aanmaken', common_1.HttpStatus.BAD_REQUEST);
            // push to organization
            yield this.organizationModel.updateOne({ _id: new mongoose_2.Types.ObjectId(organizationId) }, {
                $push: { tags: new mongoose_2.Types.ObjectId(tag._id) },
            }, {
                new: true,
            });
            // push to event
            yield this.eventModel.updateOne({
                _id: new mongoose_2.Types.ObjectId(eventId),
            }, { $push: { tags: new mongoose_2.Types.ObjectId(tag._id) } }, { new: true });
            return tag;
        });
    }
    // Create organization tag
    createInOrganization(organizationId, tagDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // validation
            const organization = this.organizationModel.findOne({
                _id: new mongoose_2.Types.ObjectId(organizationId),
            });
            if (!organization)
                throw new common_1.HttpException('Organisatie niet gevonden', common_1.HttpStatus.NOT_FOUND);
            // new tag
            const newTag = new this.tagModel(Object.assign(Object.assign({}, tagDto), { organization: new mongoose_2.Types.ObjectId(organizationId) }));
            // create new tag in collection
            const tag = yield this.tagModel.create(newTag);
            if (!tag)
                throw new common_1.HttpException('Kan geen nieuwe tag aanmaken', common_1.HttpStatus.BAD_REQUEST);
            // push to organization
            yield this.organizationModel.updateOne({ _id: new mongoose_2.Types.ObjectId(organizationId) }, {
                $push: { tags: new mongoose_2.Types.ObjectId(tag._id) },
            }, {
                new: true,
            });
            return tag;
        });
    }
    // Update tag
    update(tagId, tagDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const updatedTag = yield this.tagModel.findOneAndUpdate({ _id: new mongoose_2.Types.ObjectId(tagId) }, {
                $set: {
                    name: tagDto === null || tagDto === void 0 ? void 0 : tagDto.name,
                },
            }, {
                new: true,
                runValidators: true,
            });
            if (!updatedTag) {
                throw new common_1.HttpException('Deze tag bestaat niet', common_1.HttpStatus.NOT_FOUND);
            }
            return updatedTag;
        });
    }
};
TagService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(tag_schema_1.Tag.name)),
    tslib_1.__param(1, (0, mongoose_1.InjectModel)(organization_schema_1.Organization.name)),
    tslib_1.__param(2, (0, mongoose_1.InjectModel)(event_schema_1.Event.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _b : Object, typeof (_c = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _c : Object])
], TagService);
exports.TagService = TagService;


/***/ }),

/***/ "./apps/roots-api/src/app/token/token.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const token_schema_1 = __webpack_require__("./apps/roots-api/src/app/token/token.schema.ts");
const token_service_1 = __webpack_require__("./apps/roots-api/src/app/token/token.service.ts");
let TokenModule = class TokenModule {
};
TokenModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: token_schema_1.Token.name, schema: token_schema_1.TokenSchema }]),
        ],
        providers: [token_service_1.TokenService],
        exports: [mongoose_1.MongooseModule, token_service_1.TokenService],
    })
], TokenModule);
exports.TokenModule = TokenModule;


/***/ }),

/***/ "./apps/roots-api/src/app/token/token.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenSchema = exports.Token = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
let Token = class Token {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "type", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", String)
], Token.prototype, "verificationCode", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Token.prototype, "expirationDate", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        ref: 'User',
        type: mongoose_2.Types.ObjectId,
    }),
    tslib_1.__metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Token.prototype, "userId", void 0);
Token = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], Token);
exports.Token = Token;
exports.TokenSchema = mongoose_1.SchemaFactory.createForClass(Token);


/***/ }),

/***/ "./apps/roots-api/src/app/token/token.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TokenService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const mongoose_2 = __webpack_require__("mongoose");
const token_schema_1 = __webpack_require__("./apps/roots-api/src/app/token/token.schema.ts");
let TokenService = class TokenService {
    // Inject all dependencies
    constructor(tokenModel) {
        this.tokenModel = tokenModel;
    }
    // Get token by ID
    getById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenModel.findOne({ _id: id });
            if (!token)
                throw new common_1.HttpException('Token bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return token;
        });
    }
    // get user by ID from token
    getByUserId(userId, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const token = yield this.tokenModel.findOne({ userId, type });
            if (!token)
                throw new common_1.HttpException('Token bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return token;
        });
    }
    // Create new token
    create(type, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const newToken = {
                type: type,
                expirationDate: new Date(Date.now() + 3600 * 1000 * 24),
                userId: userId,
            };
            type === 'verification'
                ? (newToken.verificationCode = Math.floor(100000 + Math.random() * 900000))
                : (newToken.verificationCode = '');
            return yield this.tokenModel.create(newToken);
        });
    }
    // Delete token
    delete(userId, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.tokenModel.deleteMany({ userId, type });
        });
    }
};
TokenService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(token_schema_1.Token.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], TokenService);
exports.TokenService = TokenService;


/***/ }),

/***/ "./apps/roots-api/src/app/user/user.controller.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const auth_module_1 = __webpack_require__("./apps/roots-api/src/app/auth/auth.module.ts");
const ParseObjectIdPipe_1 = __webpack_require__("./apps/roots-api/src/app/shared/pipes/ParseObjectIdPipe.ts");
const user_dto_1 = __webpack_require__("./apps/roots-api/src/app/user/user.dto.ts");
const user_service_1 = __webpack_require__("./apps/roots-api/src/app/user/user.service.ts");
let UserController = class UserController {
    // Inject all dependencies
    constructor(userService) {
        this.userService = userService;
    }
    // Get all participants from organization
    getParticipants(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Retrieve participants (READ)`);
            return yield this.userService.getAllParticipants(id);
        });
    }
    // Get user by id
    getById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Retrieve user with id: ${id} (READ)`);
            return yield this.userService.getById(id);
        });
    }
    // Create new user
    create(UserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Creating user (CREATE)`);
            return yield this.userService.create(UserDto);
        });
    }
    // Get user status (activated/deactivated)
    status(id, req
    // eslint-disable-next-line @typescript-eslint/ban-types
    ) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            common_1.Logger.log(`Changing isActive status of user with an id of ${id} (POST)`);
            return yield this.userService.status(id, req);
        });
    }
};
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)('organizations/:id/participants'),
    tslib_1.__param(0, (0, common_1.Param)('id', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_b = typeof Promise !== "undefined" && Promise) === "function" ? _b : Object)
], UserController.prototype, "getParticipants", null);
tslib_1.__decorate([
    (0, auth_module_1.Public)(),
    (0, common_1.Get)('users/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", typeof (_c = typeof Promise !== "undefined" && Promise) === "function" ? _c : Object)
], UserController.prototype, "getById", null);
tslib_1.__decorate([
    (0, common_1.Post)('users/new'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [typeof (_d = typeof user_dto_1.UserDto !== "undefined" && user_dto_1.UserDto) === "function" ? _d : Object]),
    tslib_1.__metadata("design:returntype", typeof (_e = typeof Promise !== "undefined" && Promise) === "function" ? _e : Object)
], UserController.prototype, "create", null);
tslib_1.__decorate([
    (0, common_1.Post)('users/:id/status'),
    tslib_1.__param(0, (0, common_1.Param)('id', ParseObjectIdPipe_1.ParseObjectIdPipe)),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", typeof (_f = typeof Promise !== "undefined" && Promise) === "function" ? _f : Object)
], UserController.prototype, "status", null);
UserController = tslib_1.__decorate([
    (0, common_1.Controller)(),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof user_service_1.UserService !== "undefined" && user_service_1.UserService) === "function" ? _a : Object])
], UserController);
exports.UserController = UserController;


/***/ }),

/***/ "./apps/roots-api/src/app/user/user.dto.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDto = void 0;
const tslib_1 = __webpack_require__("tslib");
const class_validator_1 = __webpack_require__("class-validator");
class UserDto {
}
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Voornaam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Voornaam is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "firstname", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Achternaam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Achternaam is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "lastname", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)({ message: 'E-mailadres moet van het type string zijn!!' }),
    (0, class_validator_1.IsDefined)({ message: 'E-mailadres is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "emailAddress", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsString)({ message: 'Wachtwoord moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Wachtwoord is verplicht!' }),
    (0, class_validator_1.Matches)(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'), {
        message: 'Het wachtwoord is niet sterk genoeg! Het moet op zijn minst bestaan uit: 8 karakters, 1 hoofdletter, 1 kleine letter and 1 getal!',
    }),
    tslib_1.__metadata("design:type", String)
], UserDto.prototype, "password", void 0);
exports.UserDto = UserDto;


/***/ }),

/***/ "./apps/roots-api/src/app/user/user.module.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserModule = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const organization_module_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.module.ts");
const user_controller_1 = __webpack_require__("./apps/roots-api/src/app/user/user.controller.ts");
const user_schema_1 = __webpack_require__("./apps/roots-api/src/app/user/user.schema.ts");
const user_service_1 = __webpack_require__("./apps/roots-api/src/app/user/user.service.ts");
let UserModule = class UserModule {
};
UserModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]), organization_module_1.OrganizationModule
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    })
], UserModule);
exports.UserModule = UserModule;


/***/ }),

/***/ "./apps/roots-api/src/app/user/user.schema.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = void 0;
const tslib_1 = __webpack_require__("tslib");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const class_validator_1 = __webpack_require__("class-validator");
const mongoose_2 = __webpack_require__("mongoose");
let User = class User {
};
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    (0, class_validator_1.IsString)({ message: 'Voornaam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Voornaam is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "firstname", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    (0, class_validator_1.IsString)({ message: 'Achternaam moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Achternaam is verplicht!' }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "lastname", void 0);
tslib_1.__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsString)({ message: 'E-mailadres moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'E-mailadres is verplicht!' }),
    (0, mongoose_1.Prop)({
        required: true,
        unique: true,
        validate: class_validator_1.isEmail,
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "emailAddress", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        required: true,
    }),
    (0, class_validator_1.IsString)({ message: 'Wachtwoord moet van het type string zijn!' }),
    (0, class_validator_1.IsDefined)({ message: 'Wachtwoord is verplicht!' }),
    (0, class_validator_1.Matches)(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$'), {
        message: 'Het wachtwoord is niet sterk genoeg! Het moet op zijn minst bestaan uit: 8 karakters, 1 hoofdletter, 1 kleine letter and 1 getal!',
    }),
    tslib_1.__metadata("design:type", String)
], User.prototype, "password", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)(),
    tslib_1.__metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], User.prototype, "lastLoginTimestamp", void 0);
tslib_1.__decorate([
    (0, mongoose_1.Prop)({
        ref: 'Organization',
        type: mongoose_2.Types.ObjectId,
    }),
    tslib_1.__metadata("design:type", typeof (_c = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _c : Object)
], User.prototype, "organization", void 0);
User = tslib_1.__decorate([
    (0, mongoose_1.Schema)()
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);


/***/ }),

/***/ "./apps/roots-api/src/app/user/user.service.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const bcrypt = __webpack_require__("bcryptjs");
const mongoose_2 = __webpack_require__("mongoose");
const organization_service_1 = __webpack_require__("./apps/roots-api/src/app/organization/organization.service.ts");
const user_schema_1 = __webpack_require__("./apps/roots-api/src/app/user/user.schema.ts");
let UserService = class UserService {
    // Inject all dependencies
    constructor(userModel, organizationService) {
        this.userModel = userModel;
        this.organizationService = organizationService;
    }
    // Find user by email address
    findByEmailAddress(emailAddress) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ emailAddress });
            if (!user)
                throw new common_1.HttpException('Gebruiker bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return user;
        });
    }
    // Find user by ID
    getById(_id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOne({ _id });
            if (!user)
                throw new common_1.HttpException('Gebruiker bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return user;
        });
    }
    // Get all participants from organization
    getAllParticipants(organizationId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.userModel.find({ organization: organizationId });
        });
    }
    // Create new user
    create(UserDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.validate(UserDto);
            const newUser = new this.userModel(Object.assign(Object.assign({}, UserDto), { password: yield bcrypt.hashSync(UserDto.password, 10), isActive: true, isVerified: false, createdAt: new Date(), organization: yield this.organizationService.getByEmailDomain(UserDto.emailAddress.split('@').at(1)) }));
            return yield this.userModel.create(newUser);
        });
    }
    // Set/Update last login timestamp
    setLastLoginTimeStamp(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOneAndUpdate({ _id: id }, [
                { $set: { lastLoginTimestamp: new Date() } },
            ]);
            if (!user)
                throw new common_1.HttpException('Gebruiker bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return user;
        });
    }
    // Set/Hash password
    setPassword(userId, password) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const encryptedPassword = yield bcrypt.hashSync(password, 10);
            const user = yield this.userModel.findOneAndUpdate({ _id: userId }, { password: encryptedPassword });
            if (!user)
                throw new common_1.HttpException('Gebruiker bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return user;
        });
    }
    // Verify new account
    verifyAccount(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = yield this.userModel.findOneAndUpdate({ _id: userId }, [
                { $set: { isVerified: true } },
            ]);
            if (!user)
                throw new common_1.HttpException('Gebruiker bestaat niet!', common_1.HttpStatus.NOT_FOUND);
            return user;
        });
    }
    // Change user status (activated/deactivated)
    status(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const targetUser = yield this.getById(id);
            if (targetUser.organization.toString() !== req.user.organization.toString()) {
                throw new common_1.HttpException(`Je mag alleen gebruikers van activeren/deactiveren van het bedrijf waar je werkt!`, common_1.HttpStatus.BAD_REQUEST);
            }
            if (id.toString() === req.user._id.toString()) {
                throw new common_1.HttpException(`Je mag jouw eigen account niet activeren/deactiveren!`, common_1.HttpStatus.BAD_REQUEST);
            }
            return yield this.userModel.findOneAndUpdate({ _id: id }, [{ $set: { isActive: { $not: '$isActive' } } }], { new: true });
        });
    }
    // Validate user
    validate(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if ((yield this.userModel.find({ emailAddress: user.emailAddress })).length >
                0) {
                throw new common_1.HttpException(`Het e-mailadres is al in gebruik!`, common_1.HttpStatus.BAD_REQUEST);
            }
        });
    }
};
UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof organization_service_1.OrganizationService !== "undefined" && organization_service_1.OrganizationService) === "function" ? _b : Object])
], UserService);
exports.UserService = UserService;


/***/ }),

/***/ "./apps/roots-api/src/environments/environment.ts":
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.environment = void 0;
exports.environment = {
    production: false,
    //local
    API_URL: 'mongodb://127.0.0.1:27017/roots',
    APPLICATION_URL: 'http://localhost:4200',
    //mailing
    EMAIL_HOST: 'smtp.sendgrid.net',
    EMAIL_USERNAME: 'apikey',
    EMAIL_API_KEY: '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',
    EMAIL_SENDINGEMAIL: 'roots.team.noreply@gmail.com',
};


/***/ }),

/***/ "./libs/data/src/index.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
tslib_1.__exportStar(__webpack_require__("./libs/data/src/lib/data.ts"), exports);


/***/ }),

/***/ "./libs/data/src/lib/data.ts":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Log = exports.Tag = exports.Event = exports.Organization = exports.User = void 0;
const mongoose_1 = __webpack_require__("mongoose");
// CLASSES
class User {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this.firstname = '';
        this.lastname = '';
        this.emailAddress = '';
        this.password = '';
        this.access_token = '';
        this.organization = new mongoose_1.Types.ObjectId();
        this.initials = '';
        this.isActive = true;
        this.isVerified = true;
    }
}
exports.User = User;
class Organization {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this.name = '';
        this.emailDomain = '';
        this.events = [];
        this.tags = [];
        this.logs = [];
    }
}
exports.Organization = Organization;
class Event {
    constructor() {
        this.title = '';
        this.description = '';
        this.content = '';
        this.eventDate = new Date();
        this._id = new mongoose_1.Types.ObjectId();
        this.tags = [];
        this.isActive = true;
    }
}
exports.Event = Event;
class Tag {
    constructor() {
        this._id = new mongoose_1.Types.ObjectId();
        this.name = '';
        this.organization = new mongoose_1.Types.ObjectId();
    }
}
exports.Tag = Tag;
class Log {
    constructor() {
        this.editor = '';
        this.action = '';
        this.object = '';
        this.logStamp = new Date();
    }
}
exports.Log = Log;


/***/ }),

/***/ "@nestjs-modules/mailer":
/***/ ((module) => {

module.exports = require("@nestjs-modules/mailer");

/***/ }),

/***/ "@nestjs/common":
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ ((module) => {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "bcryptjs":
/***/ ((module) => {

module.exports = require("bcryptjs");

/***/ }),

/***/ "class-validator":
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "express":
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "mongodb":
/***/ ((module) => {

module.exports = require("mongodb");

/***/ }),

/***/ "mongoose":
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-jwt":
/***/ ((module) => {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "tslib":
/***/ ((module) => {

module.exports = require("tslib");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__("tslib");
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const express_1 = __webpack_require__("express");
const app_module_1 = __webpack_require__("./apps/roots-api/src/app/app.module.ts");
const validation_exception_1 = __webpack_require__("./apps/roots-api/src/app/shared/filters/validation.exception.ts");
const validation_filter_1 = __webpack_require__("./apps/roots-api/src/app/shared/filters/validation.filter.ts");
function bootstrap() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule);
        const globalPrefix = 'api';
        app.setGlobalPrefix(globalPrefix);
        app.use((0, express_1.json)({ limit: '50mb' }));
        app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
        app.enableCors();
        const port = process.env.PORT || 9000;
        app.useGlobalFilters(new validation_filter_1.ValidationFilter());
        app.useGlobalPipes(new common_1.ValidationPipe({
            skipMissingProperties: true,
            exceptionFactory: (errors) => {
                const messages = errors.map((error) => `${error.property} has wrong value: ${error.value}, ${Object.values(error.constraints).join(', ')}`);
                return new validation_exception_1.ValidationException(messages);
            },
        }));
        yield app.listen(port);
        common_1.Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
    });
}
bootstrap();

})();

var __webpack_export_target__ = exports;
for(var i in __webpack_exports__) __webpack_export_target__[i] = __webpack_exports__[i];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;
//# sourceMappingURL=main.js.map