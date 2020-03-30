// Get dependencies
const express = require('express');
const path = require('path');
var xFrameOptions = require('x-frame-options')
const app = express();

app.use(xFrameOptions())
// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Frontend running on ${port}`));