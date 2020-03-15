const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const cookie = require('cookie-parser');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});



app.use(cors({ origin: true,
    credentials: true}));
app.use(express.json());

// app.use(cookie());

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB is connected')
})

const usersRouter = require('./routes/users');
const gardensRouter = require('./routes/gardens')
const transactionsRouter = require('./routes/transactions');

app.use('/users', usersRouter)
app.use('/gardens', gardensRouter)
app.use('/transactions', transactionsRouter)

app.listen(port, () => {
    console.log('Server is running on port: ', port)
});
