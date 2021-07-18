const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
const sensors = require('./database/sensors');
const helpers = require('./helpers');
const sensorIPs = [];

mongoose.connect(db, { useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.text()); 

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.post('/', (req,res) => {
    const ip = sensorIPs.find(ip => req.ip.includes(ip));
    if (ip) {
        const dataPoint = helpers.extractDataPoint(req.body);
        try {
            sensors.saveDataPoint(ip, dataPoint, (result) => {
                if(result.nModified > 0){
                    res.json({success : true, result: 'Saved data point'});
                }else {
                    res.json({success : false, error: 'Failed to save data point', details: result });
                }
            });
        } catch (e) {
            res.json({success : false, error: e});
        }
    } else {
        res.json({success : false, error: 'IP address not recognized'});
    }
});

//ensure we have known sensor ips before starting
sensors.getSensorIPs(ips => {
    sensorIPs.push.apply(sensorIPs, ips);
    app.listen(port, () => {
        console.log(`Application listening at http://localhost:${port}`)
    });
})
