var crypto = require('crypto');

// generate activation token which is used to send to the user email
const getActivationKey = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      const activeToken = buf.toString('hex');
      resolve(activeToken);
    });
  });
};

// generate salt
const genRandomString = function (length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
};

// generate hased password from user entered password
const hashFunction = function (password, salt) {
  var hash = crypto.createHmac('sha512', salt);
  hash.update(password);
  var value = hash.digest('hex');
  return {
    salt: salt,
    passwordHash: value
  };
};

const getHashedPassword = async (newPassword, salt) => {
  function saltHashPassword(userpassword, salt) {
    let passwordData = hashFunction(userpassword, salt);
    return passwordData.passwordHash;
  }

  const hashPassword_1 = saltHashPassword(newPassword, salt);
  const password = saltHashPassword(hashPassword_1, salt);
  return password;
};
module.exports = {
  getActivationKey: getActivationKey,
  getHashedPassword: getHashedPassword,
  genRandomString: genRandomString
};
