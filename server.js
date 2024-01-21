require('rootpath')();
const express      = require('express');
const app          = express();
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const cors         = require('cors');
const errorHandler = require('./app/Middleware/ErrorHandler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// allow cors requests from any origin and with credentials
app.use(cors({ origin: (origin, callback) => callback(null, true), credentials: true }));

// api routes
app.use('/api', require('./routes'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.APP_PORT || 80) : 4000;
app.listen(port, () => console.log('Server listening on port ' + port));
