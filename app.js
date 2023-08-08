const express = require('express');
const bodyParser = require('body-parser');


const app = express();

const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, method');
    next();
});

app.use(bodyParser.json());

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
    res.status(status).json({
        message: message,
        data
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

app.listen(PORT);