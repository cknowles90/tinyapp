// TINY APP MINI PROJECT - W3D1 to W3D4 - html, ejs, JS (server) -- @cknowles90 : github/cknowles90 //

// importing the necessary modules and dependencies
const express = require("express");
const cookieSession = require("cookie-session");
const morgan = require('morgan');
const { getUserByEmail, getUserUrls } = require("./helpers"); // imported helper functions

const bcrypt = require("bcryptjs"); // imported module for password hashing

const app = express();
const PORT = 8080; // default port 8080

// configuration of express app
app.set("view engine", "ejs"); // EJS is the view engine

// middleware in use
app.use(express.urlencoded({ extended: true})); // URL encoded request bodies
app.use(morgan('dev')); // logging middleware for debugging
app.use(cookieSession({
  name: 'session',
  keys: ['qws2ef2sd8'], // secret keys for session encryption
}));

// random generator function used to create the TinyURLs
const generateRandomString = (length) => Math.random().toString(36).substring(2, (length + 2)); // generates a random 6 character string

// password hashing for hardcoded user authentication
let passwordOne = '123454321';
let passwordTwo = 'password';
const hashed1 = bcrypt.hashSync(passwordOne, 10);
const hashed2 = bcrypt.hashSync(passwordTwo, 10);

// databases for URLs and user information
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "b2xVn2",
  },
  e9m5xk: {
    longURL: "http://www.google.com",
    userID: "e9m5xk",
  },
};

// database for user information
const users = { b2xVn2: {
  id: "b2xVn2",
  email: "user@example.com",
  password: hashed1,
},
e9m5xk: {
  id: "e9m5xk",
  email: "user2@example.com",
  password: hashed2,
},
};

// global loop to clean up the users databse
for (const userId in users) {
  if (!(userId in users)) {
    delete users[userId];
  }
}

// POST route handler for creating short URLs
app.post("/urls", (req, res) => {
  const userID = req.session["user.id"]; // retrieves the users ID from the session

  if (!userID) { // if user is not logged in error message is displayed and prompts user to clickable link to sign up to TinyApp
    return res.status(401).send(`<center><a href="/register">Join Us!</a><br>If you want Tiny URLs...</center>`);
  } // Thank-you stackOverflow and html in-line CSS for the syntax

  let isDuplicateURL = false; // the start of checks to see if the URL already exists
  const userURLs = getUserUrls(urlDatabase, userID); // gets the users existing URLs

  // iterates through the users URLs to check for duplicates
  for (const urlID in userURLs) {
    if (
      // checks if the submitted URL already exists for the user
      (userURLs[urlID].longURL === req.body.longURL) ||
      // checks if the submitted URL already exists for ANY user
      (urlDatabase[urlID].userID === userID && urlDatabase[urlID].longURL === req.body.longURL)
    ) {
      isDuplicateURL = true; // if a match (duplicate) is found, becomes true;
      break; // exits the loop as a duplicate is found
    }
  }

  if (isDuplicateURL) {
    // if a duplicate is found, error messages to the user - contains a clickable link to their My URLs page
    return res.status(400).send(`<center>Silly Billy! You've already shortened this URL and it exists on your <a href="/urls">'My URLs'</a>page!</center>`);
  }

  let shortURLId = generateRandomString(6); // uses the global function to generate a random 6-character string
  const longURL = req.body.longURL; // gets the longURL from the request body

  // adds the newly created short URL and its details to the urlDatabse
  urlDatabase[shortURLId] = {
    longURL: longURL,
    userID: userID,
  };

  res.redirect(`/urls`); // redirects the user to the /urls page if successful
});

// GET route handler for displaying the users URLs
app.get("/urls", (req, res) => {
  const userID = req.session["user.id"]; // retrieves the users ID from the session
  const userUrls = getUserUrls(urlDatabase, userID); // gets the URL/s associated with the user
  
  // creates a template variable for rendering the urls_index EJS template
  const templateVars = {
    user: users[userID], // passes the user object to the template
    urls: userUrls, // passes the users URLs to the template
  };

  res.render("urls_index", templateVars); // renders the urls_index template
});

// GET route handler for displaying the "Create New URL" page
app.get("/urls/new", (req, res) => {
  if (!req.session["user.id"]) { // checks if the user is NOT logged in
    res.redirect("/login"); // redirects the user to the login page if they are NOT logged in
  } else { // if they are logged in, it proceeds with the rendering of the page 
    // creates a template variable for rendering the urls_new EJS template
    const templateVars = {
      user: users[req.session["user.id"]] // passes the user object to the template
    };
    res.render("urls_new", templateVars); // renders the urls_new template
  }
});

// POST route handler for editing an existing URL
app.post('/urls/:id', (req, res) => {
  const userID = req.session["user.id"]; // retrieves the users ID from the session
  const user = users[userID]; // gets the user object

  const id = req.params.id; // gets the URL ID from the request parameters
  const newLongURL = req.body.newLongURL; // gets the newLongURL from the request body
  const destinationURL = urlDatabase[id]; // gets the destination URL from the database

  if (!destinationURL) { // if the destination URL is NOT correct/stored
    return res.status(400).send("Invalid short URL"); // error message displayed for invalid URL
  }

  if (!user) { // if the user is not logged in - displays a error message
    return res.status(400).send("You must be logged in as a registered Tiny APP member to access this content");
  }

  if (user.id !== destinationURL.userID) { // if the logged in user doesnt own the destination URL a error message is displayed
    return res.status(401).send("Access Denied: This URL does not belong to you. Nice try!");
  }
  
  urlDatabase[id].longURL = newLongURL; // updates the users URLs (new)longURL in the databse
  
  res.redirect(`/urls`); // redirects to the /urls page after successfully updating the URL
});

// GET route handler for displaying the details of a specific URL 
app.get("/urls/:id", (req, res) => {
  const userID = req.session["user.id"]; // retrieves the users ID from the session
  const user = users[userID]; // gets the user object

  if (!user) { // if the user is not logged in an error message is displayed
    return res.status(400).send("You must be logged in to access this content");
  }

  if (!urlDatabase[req.params.id]) { // if the URL is incorrect or doesnt match the URL in the database
    return res.status(404).send("URL not found"); // an error message is displayed
  }

  if (user.id !== urlDatabase[req.params.id].userID) { // if the user does not own the URL then a error message is displayed
    return res.status(401).send("Access Denied: This URL does not belong to you!");
  }
  // creates a template variable for rendering the urls_show EJS template
  const templateVars = {
    id: req.params.id, // passes the URL ID to the template
    longURL: urlDatabase[req.params.id].longURL, // passes the longURL to the template
    user: users[req.session["user.id"]] // passes the user object to the template
  };
  res.render("urls_show", templateVars); // renders the urls_show template
});

// GET route handler that redirects any request to/of the ("u/:id") to its longURL - ie, the website
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL; // retrieves that longURL based on the :id parameters

  if (!longURL) { // if the longURL is not found an error message is displayed
    const errorMessage = "Invalid Tiny URL.";
    return res.status(404).render("error", { errorMessage });
  }
  res.redirect(longURL); // if the longURL does exist, then the user is redirected to that website
});

// POST route handler for deleting a stored URL
app.post('/urls/:id/delete', (req, res) => {
  const user = users[req.session["user.id"]]; // gets the user object from the session
  const id = req.params.id; // gets the URL ID from the route parameter
  const destinationURL = urlDatabase[id]; // gets the URL object from the database

  if (!destinationURL) { // if the short URL doesnt exist, a error message is displayed
    return res.status(400).send("Invalid short URL");
  }

  if (!user) { // if the user is not logged then a error message is displayed
    return res.status(400).send("You must be logged in as a registered Tiny APP member to access this content");
  }

  if (user.id !== destinationURL.userID) { // if the user is logged in and does not own the short URL, then a error message is displayed
    return res.status(401).send("Access Denied: This URL does not belong to you. Nice try!");
  }

  const idToDelete = req.params.id; // gets the ID to delete from the route path

  delete urlDatabase[idToDelete]; // deletes the URL from the database
  delete req.session[idToDelete]; // deletes the URL from the users session cookies
  
  res.redirect('/urls'); // redirects the user back to the /urls page
});

// POST route handler for user login
app.post('/login', (req, res) => {
  const user = getUserByEmail(users, req.body.email); // gets the user by their email stored in the database
  
  if (!user) { // if the email and/or password entered is incorrect, an error message is displayed
    return res.status(403).send("Incorrect email and/or password");
  }
  
  const passwordsMatch = bcrypt.compareSync(req.body.password, user.password); // compares the stored password to the hashed password

  if (!passwordsMatch) { // if the password does not match, then an unspecific error message is displayed
    return res.status(403).send("Incorrect email and/or password - this error");
  }

  req.session["user.id"] = user.id; // stores the users ID for the session if they successfully login
  res.redirect("/urls"); // redirects to the /urls page after a successful login
});

// GET route handler redirects userif they are already logged in
app.get('/login', (req, res) => {
  if (req.session["user.id"]) {
    res.redirect("/urls"); // if the user is already logged in they are redirected to the My URLs page
  } else {
    // creates a template variable for rendering the urls_login EJS template
    const templateVars = {
      user: users[req.session["user.id"]] // passes the user data if user is logged in to the login page - ie the redirect code above
    };
    res.render("urls_login", templateVars); // renders the urls_login page if the user is not logged in
  }
});

// POST route handler that logs the user our and clears their cookies
app.post('/logout', (req, res) => {
  req.session = null; // clears the users session cookies if they logout
  res.redirect("/login"); // redirects the user to /login page once they logout
});

// POST route handler for a registration page
app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10); // hashes the provided email

  if (!email || !password) { // if the user enters an invalid and/or password a error message is displayed
    res.status(400).send('Please enter a valid email and/or password');
  }

  const userExists = getUserByEmail(users, email); // checks if the user already exists in the database

  if (userExists) { // if the email is already in use, a error message is displayed
    return res.status(400).send('Error: This email is already registered');
  }
  
  const id = generateRandomString(6); // if a new user is registering, a unique user ID is generated
  
  const user = {
    id: id,
    email: email,
    password: password
  };

  users[id] = user; // adds the newly created user to the users database following the same structure

  req.session["user.id"] = user.id; // stores the users ID in the session for registration/login
  res.redirect("/urls"); // redirects the user to the 'home', My URLs page after a successfull registration
});

// GET route handler for the registration page
app.get("/register", (req, res) => {
  if (req.session["user.id"]) {
    res.redirect("/urls"); // redirects the user to /urls if they are already logged in
  }
  // creates a template variable for rendering the urls_register EJS template
  const templateVars = {
    user: users[req.session["user.id"]] // passes the user information from the users database if logged in
  };
  res.render("urls_register", templateVars); // renders the urls_register page 
});

// GET route handler for the root path ('/')
app.get('/', (req, res) => {
  if (!users[req.session["user.id"]]) {
    res.redirect('/login'); // redirects the user to the login page if they are not logged in
  }
  res.redirect('/urls'); // redirects the user to the My URLs page if they are logged in
});

// tells the server to start and binds it to the PORT input
app.listen(PORT, () => {
});

