const isAuth = require('./is-auth');

module.exports = [isAuth, (req, res, next) => {
    if(req.role !== 'admin'){
        const error = new Error('Not authenticated.')
        error.statusCode = 401;
        throw error;
    }
    next();
}];