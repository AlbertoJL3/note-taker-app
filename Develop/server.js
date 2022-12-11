const express = require('express');
const app = express();
const fs = require('fs');

app.use(express.static('public'))

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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

// Add a new note to the db.json file and return the new note to the client
app.post('/api/notes', (req, res) => {
  fs.readFile('./db.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    const notes = JSON.parse(data);
    const newNote = req.body;
    // Assign a unique id to the new note
    newNote
  })
});

app.listen(3001, () => {
  console.log('Server listening on port http://localhost/3001');
});