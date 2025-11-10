const path = require("path");
const express = require("express");
const app = express();
const fs = require("fs");
const { stringify } = require("querystring");

// main database
var data = JSON.parse(fs.readFileSync("public/datenJSON.json"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

// sends one object if requested
app.get('/data/:id/', (req, res) => {
    const datensatz = data.find(c => c.ID == req.params.id);
    if (!datensatz) {res.status(404).send("ID not found")};
    res.send(datensatz);
});

// sends all data
app.get("/data", (req, res) => {
    res.send(data);
});


// receives the put request from plakatBrowser.js editSave function and updates the database accordingly
/* app.put('/data/:id', (req, res) => {
    var object = data.find(c => c.ID == req.params.id);
    if (!object) {res.status(404).send("ID not found")};
    
    var index = data.findIndex(i => i.ID == object.ID);
    object = req.body;

    data[index] = object;
    fs.writeFileSync("public/datenJSON.json", JSON.stringify(data, null, 4));
    
    res.send(object);
}); */

const PORT = 8080;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

