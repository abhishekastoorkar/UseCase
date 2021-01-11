const schema = require('./validationSchema');
const _ = require('lodash');

const validationOptions = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true
};

const validate = (type, property) => {
  const sc = _.get(schema, type);

  return (req, res, next) => {
    const { error } = sc.validate(req[property], validationOptions);
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
