const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://chavdasandip2908:Sandip1105@cluster0.8gbqypn.mongodb.net/exam-portal?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Define routes here

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});