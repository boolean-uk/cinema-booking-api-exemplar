const express = require('express');
const app = express();

const cors = require('cors');
const morgan = require('morgan');

app.disable('x-powered-by');

// Add middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tell express to use your routers here
const customerRouter = require('./routers/customer');
const moviesRouter = require('./routers/movies')
const screensRouter = require('./routers/screens')
const ticketsRouter = require('./routers/tickets')

app.use('/customer', customerRouter);
app.use('/movies', moviesRouter)
app.use('/screens', screensRouter)
app.use('/tickets', ticketsRouter)

module.exports = app
