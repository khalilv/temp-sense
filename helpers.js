exports.extractDataPoint = (body) => {
    console.log(body);
    return {
        temperature: 20.3,
        humidity: 0.34,
        date: Date.now(),
    };
};