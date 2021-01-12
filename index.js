const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const api = require('./src/constants/api');
const permissionRoute = require('./src/routes/permission.route');
const roleRoute = require('./src/routes/role.route');
const userRoute = require('./src/routes/user.route');
const enterpriseRoute = require('./src/routes/enterprise.route');
const passwordRoute = require('./src/routes/password.route');
const commonRoute = require('./src/routes/common.route');

const { handleError } = require('./src/helper/error');
const swaggerDocument = require('./swagger.json');

//  port to listen for requests
const PORT = process.env.PORT || 3000;
const app = express();

// to parse requests of content-type - application/json
app.use(bodyParser.json());

// to parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(api.PERMISSIONS, permissionRoute);
app.use(api.ROLES, roleRoute);
app.use(api.USERS, userRoute);
app.use(api.ENTERPRISES, enterpriseRoute);
app.use(api.PASSWORDS, passwordRoute);
app.use(api.API, commonRoute);

app.get('/', (req, res) => {
  res.send('Your are connected to Node.js app');
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

app.listen(PORT, () => {
  console.log(`Listening to requests on http://localhost:${PORT}`);
});
