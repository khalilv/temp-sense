const format = RegExp('^sensor:(\\w)*//temperature:(\\d*\\.?\\d*)//humidity:(\\d*\\.?\\d*)$');

exports.processRequest = (body) => {
    if (format.test(body)){
        const values = body.split('//'); 
        const name = values[0].split(':')[1];
        const temperature = values[1].split(':')[1];
        const humidity = values[2].split(':')[1];
        return {
            name: name,
            temperature: temperature,
            humidity: humidity,
        };
    }else {
        throw (`Invalid request body ${body}`);
    }
};