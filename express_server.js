// TINY APP MINI PROJECT - W3D1 to W3D4 - html, ejs, JS (server) -- @cknowles90 : github/cknowles90 //


const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
const morgan = require('morgan');

// configuration of express app
app.set("view engine", "ejs");

// this is middleware
app.use(express.urlencoded({ extended: true})); // creates req.body vs (false)???
app.use(morgan('dev')); // (req, res, next) vs ('tiny')???
// morgan is middleware to test URL/GET/POST connections/errors

// allowing cookies to be stored and used by the server
app.use(cookieParser()); // creates req.cookies


// random string generator to simulate tinyURL

const generateRandomString = Math.random().toString(36).substring(2, 8); // generates a random 6 character string

// const generateRandomString = function() {    
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for (let x = 0; x < 6; x++) {
//     result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
  
//   return result;
// }; 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

// POST requests are sent as a BUFFER (great for transmitting data but isnt readable without this)

// redirects to a page with the shortURLId
app.post("/urls", (req, res) => {
  const shortURLId = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[shortURLId] = longURL;
  res.redirect(`/urls/${shortURLId}`);
});

// logs the POST request body to the console and responds 
app.post('/urls/:id', (req, res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id]}
  res.render('urls_show.ejs', templateVars)
});

// deletes the stored URL id, longURL and shortID URL from the urlDatabase
app.post('/urls/:id/delete', (req, res) => {
  const idToDelete = req.params.id;
  delete urlDatabase[idToDelete]; 
  res.redirect('/urls');
});

// replaces the old longURL with the new input URL - new Edit feature/page
app.post('/urls/:id', (req, res) => {
  const idToUpdate = req.params.id;
  const newLongURL = req.body.longURL;

  urlDatabase[idToUpdate] = newLongURL;

  res.redirect('/urls');
});

// allows user to input their username (and cookies to store that data for next time)
app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

// gives a logout endpoint and clears the username cookie - redirects back to /urls
app.post('/logout', (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// registration request for email and password
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  res.cookie("email", email);

  if (!email || !password) {
    res.render('register');

    res.status(400).send('please input a valid email and/or password');
  } 

  let foundUser = null;

  for (const userId in user) {
    const user = user[userId];
    if (user.email === email) {
      foundUser = user;
    }
  }
  if (foundUser) {
    return res.status(400).send('Error: email is already registered');
  }

  const id = Math.random().toString(36).substring(2, 6); // creates a 4 random character string

  const user = {
    id: id,
    email: email,
    password: password
  };

  user[id] = user;
  console.log(users);

  // if (foundUser.password !== password) {
  //   res.status(400).send('Error: email and/or password does not match');
  // }
  res.cookie('userId', foundUser.id);

  res.redirect("/login");
});



// GET requests information/data from the browser and servers, and returns to the client

// redirect any request to ("u/:id") to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// new route handler for /urls - Added USERNAME and cookies
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render("urls_index", templateVars);
});

// new route for /urls/new - the form
app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  res.render("urls_new", templateVars);
});

// new route for URL tinyIDs
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    username: req.cookies["username"]
  };
  res.render("urls_show", templateVars);
});

// new registration page
app.get("/register", (req, res) => {
  res.render("register");
});

// adds JSON string that reprents the entire urlDatabase objects at time of request
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// get /protected
app.get('/protected', (req, res) => {

  const userId = req.cookies.userId

  if (!userId) {
    return res.status(401).send("Please log in to view this page")
  }
  
  const user = user[userId];
  const templateVars = {
    email: user.email
  };

  res.render('protected', templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

