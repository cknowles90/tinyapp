// TINY APP MINI PROJECT - W3D1 to W3D4 - html, ejs, JS (server) -- @cknowles90 : github/cknowles90 //

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require('morgan');

const app = express();
const PORT = 8080; // default port 8080

// configuration of express app
app.set("view engine", "ejs");

// this is middleware
app.use(express.urlencoded({ extended: true})); // creates req.body vs (false)???
app.use(morgan('dev')); // (req, res, next) vs ('tiny')???
// morgan is middleware to test URL/GET/POST connections/errors

// allowing cookies to be stored and used by the server
app.use(cookieParser()); // creates req.cookies

// random string generator to simulate tinyURL
const generateRandomString = (length) => Math.random().toString(36).substring(2, (length + 2)); // generates a random 6 character string

// databases for URLs and usernames
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

const users = { happyTimes: {
  id: "happyTimes",
  email: "user@example.com",
  password: "purple-monkey-dinosaur",
},
cknowles90: {
  id: "cknowles90",
  email: "user2@example.com",
  password: "dishwasher-funk",
},
};;


// POST requests are sent as a BUFFER (great for transmitting data but isnt readable without this)
// logs the POST request body to the console and responds 
app.post('/urls/:id', (req, res) => {
  const templateVars = {id: req.params.id, longURL: urlDatabase[req.params.id]}
  res.render('urls_show', templateVars)
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
  const users = req.body.users;

  if (!users) {
    return res.status(400).send("Username does not exist");
  }

  let foundUser = null;

  for (const userId of users) {
    const user = users[userId];
    if (users.userId === user) {
      found = user;
    }
  }
  if (!foundUser) {
    return res.status(400).send("Username does not exist because we couldn't find them!");
  }

  res.cookie("users", users);
  res.cookie('user.id', foundUser.id);
  res.redirect("/urls");
});

// gives a logout endpoint and clears the username cookie - redirects back to /urls
app.post('/logout', (req, res) => {
  res.clearCookie("users");
  res.redirect("/urls");
});

// redirects to a page with the shortURLId
app.post("/urls", (req, res) => {
  const shortURLId = generateRandomString(6);
  const longURL = req.body.longURL;
  urlDatabase[shortURLId] = longURL;
  res.redirect(`/urls/${shortURLId}`);
});

// registration request for email and password
app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).send('please input a valid email and/or password');
  }
  
  let foundUser = null;
  
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      foundUser = user;
    }
  }

  if (foundUser) {
    return res.status(400).send('Error: email is already registered');
  }
  
  const id = generateRandomString(6);
  
  const user = {
    id: id,
    email: email,
    password: password
  };
  
  users[id] = user;
  console.log(users);
 
  res.cookie("user.id", user.id);
  res.redirect("/urls");
});


// GET requests information/data from the browser and servers, and returns to the client
// new route handler for /urls - Added USERNAME and cookies
app.get("/urls", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    user: users[req.cookies["user.id"]]
  };
  res.render("urls_index", templateVars);
});

// new route for /urls/new - the form
app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user.id"]]
  };
  res.render("urls_new", templateVars);
});

// redirect any request to ("u/:id") to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// new route for URL tinyIDs
app.get("/urls/:id", (req, res) => {
  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id],
    user: users[req.cookies["user.id"]]
  };
  res.render("urls_show", templateVars);
});

// new registration page
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user.id"]]
  };
  res.render("urls_register", templateVars);
});

// // get /protected
// app.get('/protected', (req, res) => {

//   const userId = req.cookies.userId

//   if (!userId) {
//     return res.status(401).send("Please log in to view this page")
//   }
  
//   const user = username[userId];
//   const templateVars = {
//     email: user.email
//   };

//   res.render('urls_protected', templateVars);
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

