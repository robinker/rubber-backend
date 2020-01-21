const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true});



app.use(cors({ origin: true,
    credentials: true}));
app.use(express.json());

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB is connected')
})

const usersRouter = require('./routes/users');
const transactionsRouter = require('./routes/transactions');

app.use('/users', usersRouter)
app.use('/transactions', transactionsRouter)

app.listen(port, () => {
    console.log('Server is running on port: ', port)
});
