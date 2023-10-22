const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const user={
    username: req.body.username,
    password: req.body.password,
  }
  console.log(user)
  const pos=users.findIndex((u)=>u.username==user.username)
  console.log(user)
 if(pos!=-1){
  res.status(400).json({message : "user already exist"});
  return;
 }
 users.push({...user});
 console.log(users);
 res.status(201).json({message:"success"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let foundBook = null;
  for (let number in books) {
    if (parseInt(number) == req.params.isbn) {
      foundBook = books[number];
      break; // Exit the loop once the book is found
    }
  }
  if(foundBook==null){
     res.status(404).json({message:"book not found !!!!!"})
     return
  }
   res.status(201).send(foundBook)
 });

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const {author}=req.params;
   const foundBook=[];
   for (let key in books) {
    if(books[key].author==author){
      foundBook.push(books[key]);
    }

  }
   if(foundBook.length==0){
    res.status(404).json({message:"book not found !!!!!"})
    return
   }
   res.status(200).send(foundBook)

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title}=req.params;
  const foundBook=[];
  for (let key in books) {
   if(books[key].title==title){
     foundBook.push(books[key]);
   }

 }
  if(foundBook.length==0){
   res.status(404).json({message:"book not found !!!!!"})
   return
  }
  res.status(200).send(foundBook)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let foundBook = null;
  for (let number in books) {
    if (parseInt(number) == req.params.isbn) {
      foundBook = books[number];
      break; // Exit the loop once the book is found
    }
  }
  if(foundBook==null){
     res.status(404).json({message:"book not found !!!!!"})
     return
  }
    res.status(200).send(foundBook.reviews)

});

module.exports.general = public_users;
