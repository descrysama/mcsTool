const bcrypt = require('bcryptjs');

function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

function comparePassword(password, hashedPassord) {
    return bcrypt.compareSync(password, hashedPassord);
}

module.exports = {
    hashPassword,
    comparePassword
}