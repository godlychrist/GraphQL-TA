const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    cedula: Number,
    nombre: String
})

module.exports = mongoose.model('User', userSchema, 'users');