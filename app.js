const express = require('express');
const app = express();
const APIRouter = require('./routes/index')
const StatsRouter = require('./routes/statistics/index')

app.use('/api', APIRouter)
app.use('/stats', StatsRouter)

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});