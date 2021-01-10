const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

require('dotenv/config');

// import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const categoryRoute = require('./routes/category');
const productRoute = require('./routes/product');

// App
const app = express()

// Connect to db
mongoose.connect(process.env.DATABASE, { 
	useNewUrlParser: true, 
	useUnifiedTopology: true 
}).then(() => console.log('DB connected'));


// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());

// routes middleware
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api', categoryRoute);
app.use('/api', productRoute);

const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`running on port ${port}`)
});