const express = require('express');

const router = express.Router();

//Requiring Database Models
const Post = require('../schemas/post');

//Delete Post Point
router.delete('/post-delete/:id', (req, res, next) => {
  const id = req.params.id;
  Post.deleteOne({_id: id}).
  then(result => {
    res.status(200).json({message: "Post Deleted!"})
  }).
  catch(err => {
    const error = err;
    error.status = 500;
    next(error);
  })
});

//Edit Post
router.patch('/edit-post/:id', (req, res, next) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    _id: id,
    title: title,
    content: content
  })
  Post.updateOne({_id: id}, post).
  then(result => {
    res.status(200).json({message: "Post Updated Succesfully!"})
  }).
  catch(err => {
    const error = err;
    error.status = 500;
    next(error);
  })
});

//Get Post Endpoint
router.get('', (req, res, next) => {
  Post.find().
  then(result => {
    res.status(200).json({posts: result})
  }).
  catch(err => {
    const error = err;
    error.status = 500;
    next(error);
  })
});

//Fetch Single Post
router.get('/singlepost/:id', (req, res, next) => {
  const id = req.params.id
  Post.find({_id:id}).select('_id title content').
  then(post => {
    if(!post || post.length > 1){
      const error = new Error('Post not found!')
      error.status = 404;
      throw error;
    }
    console.log(post);
    res.status(200).json({post:post})
  }).
  catch(err => {
    const error = err;
    error.status = 500;
    next(error);
  })
});

//Add Post Endpoint
router.post('/addpost', (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title:title,
    content:content
  })
  post.save().
  then(result => {
    res.status(201).json({posts: result._id})
  }).
  catch(err => {
    const error = err;
    error.status = 404;
    next(error);
  })
});

module.exports = router;
