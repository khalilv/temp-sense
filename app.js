const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const db = process.env.MONGODB_URI
const sensors = require('./database/sensors');
const helpers = require('./helpers');
const winston = require('winston');
const knownSensors = [];

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
    try {
        const data = helpers.processRequest(req.body);
        const name = data.name;
        if (knownSensors.includes(name)){
            const dataPoint = {
                temperature: data.temperature,
                humidity: data.humidity, 
                date: Date.now(),
            };
            sensors.saveDataPoint(name, dataPoint, (result) => {
                if(result.nModified > 0){
                        logger.info(`Saved data point for sensor ${name}`);
                    }else {
                        logger.info(`Failed to save data point for sensor ${name}`);
                    }
                    res.end();
            });
        }else{
            logger.warn(`Encountered unknown sensor name when trying to save data point ${name}`);
            res.end();
        }
    } catch (e) {
        logger.error(e);
        res.end();
    }
});

//ensure we have known sensor ips before starting
sensors.getKnownSensors(names => {
    knownSensors.push.apply(knownSensors, names);
    app.listen(port, () => {
        logger.info(`Application listening on ${port}`)
    });
})
