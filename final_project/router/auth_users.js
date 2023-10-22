const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let flag=false;
  for(var i in users){
    if(users[i].username=username)flag=true;
  }
  return flag;
}

const authenticatedUser = (username,password)=>{ 
  let user={};
  for(let i in users){
    if(users[i].username==username ){
      if(users[i].password == password){
        user=users[i];
      }
    
    }
  }
  console.log(user)
  return user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let token;
  try{
    console.log(req.body);
    let username=req.body.username;
    let password=req.body.password;
    if(!isValid(username)){
      res.status(401).send({message:'username or passwor undifined'});
    }else if (!authenticatedUser(username,password)) {
      throw new Error('Invalid Username/Password');
    }else{
      token = jwt.sign({ user: req.body},'secret',{expiresIn:'2h'})
    }
    }
    catch(e){
      return res.status(500).send({auth:false,message:e.toString()})
    }
    res.status(200).send({auth:true,token:token})

    

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) =>{
  const bookReview ={
    title : req.body.title,
    description : req.body.description,
    isbn : req.params.isbn
  }
  books.findOneAndUpdate({isbn:bookReview.isbn},{$push:{reviews:bookReview}},{new:true})
  .then((doc)=>console.log(doc))
  .catch((err)=>console.error(err));
  res.redirect('/books');
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
