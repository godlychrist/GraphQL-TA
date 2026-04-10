const { stripIgnoredCharacters } = require('graphql');
const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    brand: String,
    model: String,
    year: Number, // Numeric no existe
    price: Number,
    status: String,
    image: String,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }


})

module.exports = mongoose.model('Vehicle', vehicleSchema, 'vehicles')
