const Sensor = require('../models/Sensor'); 

exports.findAll = (callback) => {
    Sensor.find({}, {name: 1, ip: 1, data: 1}).lean().exec((err, sensors) => {
        if (err) {
            throw err; 
        }
        callback(sensors);
    });
};

exports.getSensorIPs = (callback) => {
    Sensor.find({}, {ip: 1}).lean().exec((err, sensors) => {
        if (err) {
            throw err; 
        }
        callback(sensors.map(sensor => sensor.ip));
    });
};

exports.saveDataPoint = (ip, dataPoint, callback) => {
    Sensor.updateOne({ip: ip}, {$push: {data: dataPoint}}, {upsert: false}, (err, result) => {
        if (err) {
            throw err;
        }
        callback(result); 
    });
}