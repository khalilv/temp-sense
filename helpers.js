const format = RegExp('^sensor:(\\w*)//temperature:(\\d*\\.?\\d*)//humidity:(\\d*\\.?\\d*)$');

exports.processPostRequest = (body) => {
    const data = body.match(format);
    if (data) {
        return { name: data[1], temperature: data[2], humidity: data[3] };
    } else {
        throw (`Invalid request body ${body}`);
    }
};