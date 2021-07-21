const Sensor = require('../models/Sensor'); 

exports.findAll = (callback) => {
    Sensor.find({}, {name: 1, data: 1}).lean().exec((err, sensors) => {
        if (err) {
            throw err; 
        }
        callback(sensors);
    });
};

exports.getKnownSensors = (callback) => {
    Sensor.find({}, {name: 1}).lean().exec((err, sensors) => {
        if (err) {
            throw err; 
        }
        callback(sensors.map(sensor => sensor.name));
    });
};

exports.saveDataPoint = (name, dataPoint, callback) => {
    Sensor.updateOne({name: name}, {$push: {data: dataPoint}}, {upsert: false}, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result); 
    });
}