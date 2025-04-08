
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const dataFile = './data/zones.json';

app.get('/zones', (req, res) => {
  fs.readFile(dataFile, 'utf8', (err, data) => {
    res.json(JSON.parse(data || '{}'));
  });
});

app.post('/zones', (req, res) => {
  fs.writeFile(dataFile, JSON.stringify(req.body, null, 2), () => {
    res.sendStatus(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
