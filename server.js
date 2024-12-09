const express = require('express');

const app = express();

const PORT = process.env.DB_PORT || 5000; 
app.listen(PORT)
