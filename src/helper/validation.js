const schemas = require('./validationSchema');
const _ = require('lodash');

const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true
};

// validation middleware
// type = validation schema depend upon which route is invoked.
// property = it can be [body, params, query]
const validate = (type, property) => {
  const schema = _.get(schemas, type);
  // schema will be depend upon type of route
  return (req, res, next) => {
    const { error } = schema.validate(req[property], validationOptions);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(',');
      res.status(422).json({ error: message.replace(/['"]/g, '') });
    }
  };
};

module.exports = validate;
