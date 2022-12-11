const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();


app.use(express.static('public'))


app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Read the db.json file and return the saved notes as JSON
app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    res.json(JSON.parse(data));
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(3001, () => {
  console.log('Server listening on port http://localhost/3001');
});