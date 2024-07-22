const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req,res){
  try {
    const allbooks = await JSON.stringify(books,null,4);
    res.send(allbooks);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!!" });
}
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try{
    const isbn = req.params.isbn;
    const bookByIsbn = await JSON.stringify(books[isbn], null, 4);
    res.send(bookByIsbn)
  } catch (error){
    res.status(500).json({ message: "Internal Server Error!!" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try{
    const author = req.params.author;
    const bookByAuthor = await Object.values(books).filter(book => book.author === author)
    res.send(bookByAuthor)
  } catch (error){
    res.status(500).json({ message: "Internal Server Error!!" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try{
    const title = req.params.title;
    const bookByTitle = await Object.values(books).filter(book => book.title === title)
    res.send(bookByTitle)
  }catch (error){
    res.status(500).json({ message: "Internal Server Error!!" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(JSON.stringify(books[isbn].reviews, null, 4))
});

module.exports.general = public_users;
