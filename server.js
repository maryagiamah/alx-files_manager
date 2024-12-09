import routes from './routes/index';

const express = require('express');

const app = express();
const PORT = process.env.DB_PORT || 5000;

app.use('/', routes);
app.listen(PORT);
