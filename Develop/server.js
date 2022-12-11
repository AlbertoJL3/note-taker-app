const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const uuid = require('./helpers/uuid');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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


// POST request to add a Note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a review`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote= {
      title,
      text,
      review_id: uuid(),
    };

    // Obtain existing Notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new Note
        parsedNotes.push(newNote);

        // Write updated Notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated Notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note!');
  }
});

// DELETE request to delete a Note
app.delete('/api/notes/:review_id', (req, res) => {
  // Log that a DELETE request was received
  console.info(`${req.method} request received to delete a Note`);

  // Obtain existing Notes
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      // Convert string into JSON object
      const parsedNotes = JSON.parse(data);

      // Delete the specified Note
      const updatedNotes = parsedNotes.filter((note) => note.review_id !== req.params.review_id);

      // Write updated Notes back to the file
      fs.writeFile(
        './db/db.json',
        JSON.stringify(updatedNotes, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('Successfully deleted Note!')
      );

      res.status(200).json('Successfully deleted Note');
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.listen(3001, () => {
  console.log('Server listening on port http://localhost:3001');
});