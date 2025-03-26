const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    userType: String
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
