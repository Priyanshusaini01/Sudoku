const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the web directory
app.use(express.static(path.join(__dirname, 'web')));

// Serve the main index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Sudoku server running at http://localhost:${PORT}`);
}); 