const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const config = require('../rest-config');

const postRoutes = require('./routes/posts');

//Starting Express
const app = express();

//Database connection
mongoose.connect(config, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(result => {
  return;
}).catch(err => {
  const error = new Error('Server DB Connection Error!')
  error.status = 500
  next(error);
})

//Body Parser
app.use(parser.json());
app.use(parser.urlencoded({extended:false}));

//Resolving CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  next();
})

app.use("/posts", postRoutes);



module.exports = app;

