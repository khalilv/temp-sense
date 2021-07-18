const password = 'INSERT_PASSWORD'
const username = 'INSERT_USERNAME'
module.exports = {
    MongoURI : 'mongodb+srv://' + username + ':' + password + '@main.asvis.mongodb.net/TemperatureMonitoringDB?retryWrites=true&w=majority',
}