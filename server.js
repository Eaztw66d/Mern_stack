const express = require('express');
const connectDB = require("./config/db");


const app = express();

// Todo 1: Connect to Database
connectDB();

app.get("/", (req, res) => res.send('API running'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));