const express = require('express');
const connectDB = require("./config/db");


const app = express();

// Todo 1: Connect to Database
connectDB();

// Todo A: Initialize Middleware
app.use(express.json({extended: false}));  //? no need to download a separate package for body-parser 2019

// Todo 2: Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.get("/", (req, res) => res.send('API running'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));