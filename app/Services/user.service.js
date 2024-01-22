const config    = require('../../config/config');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcryptjs');
const crypto    = require("crypto");
const { Op }    = require('sequelize');
const mail      = require('../../config/mail')
const Role      = require('../../config/role');

const { User, refreshTokens } = require('../Models');

class UserService {
    async authenticate({ email, password, ipAddress }) {
        const user = await User.scope('withHash').findOne({ where: { email } });

        if (!user || !user.isVerified || !(await bcrypt.compare(password, user.password))) {
            throw 'Email or password is incorrect';
        }

        // authentication successful so generate jwt and refresh tokens
        const jwtToken     = generateJwtToken(user);
        const refreshToken = generateRefreshToken(user, ipAddress);

        // save refresh token
        await refreshToken.save();

        // return basic details and tokens
        return {
            ...basicDetails(user),
            jwtToken,
            refreshToken: refreshToken.token
        };
    }

    async refreshToken({ token, ipAddress }) {
        const refreshToken = await getRefreshToken(token);
        const user         = await refreshToken.getUser();

        // replace old refresh token with a new one and save
        const newRefreshToken        = generateRefreshToken(user, ipAddress);
        refreshToken.revoked         = Date.now();
        refreshToken.revokedByIp     = ipAddress;
        refreshToken.replacedByToken = newRefreshToken.token;
        await refreshToken.save();
        await newRefreshToken.save();

        // generate new jwt
        const jwtToken = generateJwtToken(user);

        // return basic details and tokens
        return {
            ...basicDetails(user),
            jwtToken,
            refreshToken: newRefreshToken.token
        };
    }

    async revokeToken({ token, ipAddress }) {
        const refreshToken = await getRefreshToken(token);

        // revoke token and save
        refreshToken.revoked     = Date.now();
        refreshToken.revokedByIp = ipAddress;
        await refreshToken.save();
    }

    async register(params, origin) {
        // validate
        if (await User.findOne({ where: { email: params.email } })) {
            // send already registered error in email to prevent user enumeration
            return await sendAlreadyRegisteredEmail(params.email, origin);
        }

        // create user object
        const user = new User(params);

        // first registered user is an admin
        const isFirstUser      = (await User.count()) === 0;
        user.role              = isFirstUser ? Role.Admin : Role.User;
        user.verificationToken = randomTokenString();
        user.password          = await hash(params.password);
        await user.save()

        // send email
        await sendVerificationEmail(user, origin);
    }

    async verifyEmail({ token }) {
        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) throw 'Verification failed';

        user.verified          = Date.now();
        user.verificationToken = null;
        await user.save()
    }

    async forgotPassword({ email }, origin) {
        const user = await User.findOne({ where: { email } });

        // always return ok response to prevent email enumeration
        if (!user) return;

        // create reset token that expires after 24 hours
        user.resetToken        = randomTokenString();
        user.resetTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save()

        // send email
        await sendPasswordResetEmail(user, origin);
    }

    async validateResetToken({ token }) {
        const user = await User.findOne({
            where: {
                resetToken: token,
                resetTokenExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) throw 'Invalid token';

        return user;
    }

    async resetPassword({ token, password }) {
        const user = await this.validateResetToken({ token });

        // update password and remove reset token
        user.password      = await hash(password);
        user.passwordReset = Date.now();
        user.resetToken    = null;
        await user.save()
    }

    async getAll() {
        const users = await User.findAll();
        return users.map(x => basicDetails(x));
    }

    async getById(id) {
        const user = await getUser(id);
        return basicDetails(user);
    }

    async create(params) {
        // validate
        if (await User.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already registered';
        }

        const user    = new User(params);
        user.verified = Date.now();
        user.password = await hash(params.password);
        await user.save()

        return basicDetails(user);
    }

    async update(id, params) {
        const user = await getUser(id);

        // validate (if email was changed)
        if (params.email && user.email !== params.email && await User.findOne({ where: { email: params.email } })) {
            throw 'Email "' + params.email + '" is already taken';
        }

        // hash password if it was entered
        if (params.password) {
            params.password = await hash(params.password);
        }

        // copy params to user and save
        Object.assign(user, params);
        user.updated = Date.now();
        await user.save()

        return basicDetails(user);
    }

    async delete(id) {
        const user = await getUser(id);
        await user.destroy();
    }
}

module.exports = new UserService();

// helpers
async function getUser(id) {
    const user = await User.findByPk(id);
    if (!user) throw 'User not found';
    return user;
}

async function getRefreshToken(token) {
    const refreshToken = await refreshTokens.findOne({ where: { token } });
    if (!refreshToken || !refreshToken.isActive) throw 'Invalid token';
    return refreshToken;
}

async function hash(password) {
    return await bcrypt.hash(password, 10);
}

function generateJwtToken(user) {
    // create a jwt token containing the user id that expires in 15 minutes
    return jwt.sign(
        {
            sub: user.id,
            id: user.id
        },
        config.jwtSecret, {
        expiresIn: '15m'
    }
    );
}

function generateRefreshToken(user, ipAddress) {
    // create a refresh token that expires in 7 days
    return new refreshTokens({
        userId     : user.id,
        token      : randomTokenString(),
        expires    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        createdByIp: ipAddress
    });
}

function randomTokenString() {
    return crypto.randomBytes(40).toString('hex');
}

function basicDetails(user) {
    const {
        id,
        firstName,
        lastName,
        email,
        role,
        created,
        updated,
        isVerified
    } = user;
    return {
        id,
        firstName,
        lastName,
        email,
        role,
        created,
        updated,
        isVerified
    };
}

async function sendVerificationEmail(user, origin) {
    let baseUrl;
    if (origin) { baseUrl = origin }
    else { baseUrl = config.baseUrl }
    
    await mail.verificationMail(user, baseUrl);
}

async function sendAlreadyRegisteredEmail(email, origin) {
    let baseUrl;
    if (origin) { baseUrl = origin }
    else { baseUrl = config.baseUrl }
    
    await mail.alreadyRegisteredMail(email, baseUrl);
}

async function sendPasswordResetEmail(user, origin) {
    let baseUrl;
    if (origin) { baseUrl = origin }
    else { baseUrl = config.baseUrl }
    
    await mail.resetPasswordMail(user, baseUrl);
}