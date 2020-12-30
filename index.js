const express = require('express');
const bodyParser = require('body-parser');

const api = require('./src/constants/api');
const permissionRoute = require('./src/routes/permission.route');
const roleRoute = require('./src/routes/role.route');
const { handleError } = require('./src/helper/error');
//port to listen for requests
const PORT = process.env.PORT || 3000;
const app = express();

// to parse requests of content-type - application/json
app.use(bodyParser.json());

// to parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(api.PERMISSIONS, permissionRoute);
app.use(api.API, roleRoute);
app.get('/', (req, res) => {
  res.send('Your are connected to Node.js app');
});
app.use((err, req, res, next) => {
  handleError(err, res);
});
app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}`);
});
