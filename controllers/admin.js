const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
    const {uname, password} = req.body;
    try {
        if (uname != process.env.ADMIN_UNAME || password != process.env.ADMIN_PASS ){
            const error = new Error('Incorrect credentials.');
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({
            role: 'admin',
        }, 
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_DURATION},
        );
        res.status(200).json({
            message: 'Welcome to admin dashboard',
            token
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};