const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const testRoutes = require('./Routes/TestRoute'); // Correct the route to the file
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect('mongodb+srv://chavdasandip2908:Sandip1105@cluster0.8gbqypn.mongodb.net/exam-portal?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define routes here
app.use('/api/test', testRoutes); // Apply your Test routes correctly here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
