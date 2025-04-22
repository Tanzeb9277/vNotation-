const express = require('express');
const app = express();
const videosRouter = require('./routes/videos');
const notesRouter = require('./routes/notes');

app.use(express.json());  // Middleware to parse JSON bodies

// Routes
app.use('/api/videos', videosRouter);
app.use('/api/videos', notesRouter);

// Set up the server to listen on a port
app.listen(5000, () => {
  console.log('====================================');
  console.log('🚀 NODEMON TEST! - ' + new Date().toISOString());
  console.log('====================================');
});
