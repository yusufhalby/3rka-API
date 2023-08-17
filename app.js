const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const mysql = require('mysql2/promise');

const sequelize = require('./util/database');
const Men = require('./models/men');
const Menfights = require('./models/menfights');
const Fights = require('./models/fights');

const arkaRoutes = require('./routes/arka');
const adminRoutes = require('./routes/admin');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
// Configure multer for handling file uploads
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = 'Uploads';
        if (!fs.existsSync(path)) fs.mkdir(path, err => {
            console.log(err)
        });
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, req.body.uname + '_' + Date.now() + '.' + file.mimetype.split("/")[1]);
    }
});

// Configure photos filter
const fileFilter = (req, file, cb) => {
    switch (file.mimetype) {
        case 'image/png':
        case 'image/jpg':
        case 'image/jpeg':
        case 'image/webp':
            cb(null, true); //accept the file
            break;
        default:
            cb(null, false); //reject the file
    }
};

app.use(multer({
    storage: fileStorage,
    fileFilter
}).single('usr_img'));
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, method');
    next();
});

app.use('/admin', adminRoutes);
app.use(arkaRoutes);

app.get('/', (req, res, next) => {
    res.status(200).send(`
        <h1>Welcome to server</h1>
    `);
});

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    if (req.file) {fs.unlink(path.join(__dirname, req.file.path), err => console.log(err)); console.log(req.file.path);}
    res.status(status).json({
        message: message,
        data
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

Menfights.belongsTo(Men, {
    foreignKey: 'ManID'
});
Menfights.belongsTo(Fights, {
    foreignKey: 'FightID'
});


try {
    mysql.createConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        })
        .then((connection) => {
            return connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_SCHEMA};`);
        }).then(result => {
            sequelize.sync({
                force: false
            });
            console.log('Connection has been established successfully.');
            app.listen(PORT);
            console.log('Server is on port: ', PORT);
        });
} catch (error) {
    console.error('Something went wrong with database:', error);
}