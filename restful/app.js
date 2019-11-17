const express = require('express');
const parser = require('body-parser');
const mongoose = require('mongoose');
const config = require('../rest-config')
const Post = require('./schemas/post');

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


//Get Post Endpoint
app.get('/post', (req, res, next) => {
  const posts = [
    {id:'1', title:'Hello', content: 'Checking if this works'},
    {id:'2', title:'Second Text', content: 'Checking if this works. This is coming from the server'}
  ]
  res.status(200).json({posts: posts})
});

//Add Post Endpoint
app.post('/addpost', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title:title,
    content:content
  })
  post.save().
  then(result => {
    res.status(201).json({message: 'Post Added Successfully!'})
  }).
  catch(err => {
    const error = err;
    error.status = 404;
    next(error);
  })
});

module.exports = app;

