const express = require('express');
const app = express();
const port = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/', (req,res) => {
    console.log("RECIEVED");
    console.log(req.body);  
    res.send('Post request recieved'); 
});

app.listen(port, () => {
    console.log(`Application listening at http://localhost:${port}`)
});