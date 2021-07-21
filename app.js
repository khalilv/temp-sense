const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const db = require('./config/keys').MongoURI;
const sensors = require('./database/sensors');
const helpers = require('./helpers');
const winston = require('winston');
const sensorIPs = [];

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

mongoose.connect(db, { useNewUrlParser: true,useUnifiedTopology: true })
    .then(() => logger.info("MongoDB connected"))
    .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.text()); 


app.get('/', (req, res) => {
    res.send('Welcome to the automated temperature and humidity monitoring server.');
});

app.post('/', (req,res) => {
    const ip = sensorIPs.find(ip => req.ip.includes(ip));
    if (ip) {
        const dataPoint = helpers.extractDataPoint(req.body);
        try {
            sensors.saveDataPoint(ip, dataPoint, (result) => {
                if(result.nModified > 0){
                    logger.info(`Saved data point from ip:${ip}`);
                }else {
                    logger.info(`Failed to save data point from ip:${ip}`);
                }
                res.end();
            });
        } catch (e) {
            logger.error(e);
            res.end()
        }
    } else {
        logger.warn(`Unknown post request from ${req.ip}`);
        res.end();
    }
});

//ensure we have known sensor ips before starting
sensors.getSensorIPs(ips => {
    sensorIPs.push.apply(sensorIPs, ips);
    app.listen(port, () => {
        logger.info(`Application listening on ${port}`)
    });
})
