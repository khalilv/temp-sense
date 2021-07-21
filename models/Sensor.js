const mongoose = require('mongoose'); 
const SensorSchema = new mongoose.Schema({ 
    name : {
        type : String, 
        required : true
    },
    data : [{
        temperature: Number,
        humidity: Number,
        date: Date,
    }]
}, { collection: 'sensors' });

const Sensor = mongoose.model('Sensor', SensorSchema);

module.exports = Sensor; 