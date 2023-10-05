// TINY APP MINI PROJECT - W3D1 to W3D4 - html, ejs, JS (server) -- @cknowles90 : github/cknowles90 //

const express = require("express");
const cookieSession = require("cookie-session");
const morgan = require('morgan');

const bcrypt = require("bcryptjs");

const app = express();
const PORT = 8080; // default port 8080

// configuration of express app
app.set("view engine", "ejs");

// this is middleware
// allowing cookies to be stored and used by the server
// morgan is middleware to test URL/GET/POST connections/errors
app.use(express.urlencoded({ extended: true})); // creates req.body vs (false)???
app.use(morgan('dev')); // (req, res, next) vs ('tiny')???
app.use(cookieSession({
  name: 'session',
  keys: ['qws2ef2sd8'],
}));

// random string generator to simulate tinyURL
const generateRandomString = (length) => Math.random().toString(36).substring(2, (length + 2)); // generates a random 6 character string

// auto-generating a salt and hash for password encryption using bcryptjs

// converting passwords to hash
let passwordOne = '123454321'
let passwordTwo = 'password'

const hashed1 = bcrypt.hashSync(passwordOne, 10);
const hashed2 = bcrypt.hashSync(passwordTwo, 10);

// function to help get a user by email
const getUserByEmail = (users, email) => {
  for (const userId in users)  {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

// function similar to above - but to filter through urls associated with userID's
const getUserUrls = (urlDatabase, userID) => {
  const newUrls = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      newUrls[url] = urlDatabase[url];
    }
  };
  return newUrls;
};

// databases for URLs and usernames
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


// new updated database for the users info: id, email, password
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

// Now `users` only contains the hardcoded users
for (const userId in users) {
  if (!(userId in users)) {
    delete users[userId];
  }
}
console.log(users);



// POST requests are sent as a BUFFER (great for transmitting data but isnt readable without this)
// GET requests information/data from the browser and servers, and returns to the client


// redirects to a page with the shortURLId
app.post("/urls", (req, res) => {
  console.log("POST /urls route handler called");
  const userID = req.session.user ? req.session["user.id"] : null;
  console.log("Cookies:", req.cookies, req.session);

  if (!userID) { // cheeky hyperlink within message to redirect to /register page. Thank-you stackOverflow and html in-line CSS;
    return res.status(400).send(`<center><a href="/register">Join Us!</a><br>If you want Tiny URLs...</center>`)
  }

  const shortURLId = generateRandomString(6);
  const longURL = req.body.longURL;
  console.log("shortURLId:", shortURLId);
  console.log("longURL:", longURL);

  urlDatabase[shortURLId] = {
    longURL: longURL,
    userID: userID,
  };

  console.log("urlDatabase:", urlDatabase);
  res.redirect(`/urls/${shortURLId}`);
});

// new route handler for /urls - Added USERNAME and cookies
app.get("/urls", (req, res) => {
  
  const userID = req.session["user.id"];
  console.log("UserID:", userID);

  const userUrls = getUserUrls(urlDatabase, userID);
  console.log("userURLs:", userUrls);
  
  const templateVars = { 
    user: users[userID],
    urls: userUrls,
    urlDatabase: urlDatabase,
  };

  res.render("urls_index", templateVars);
});

// new route for /urls/new - the form
app.get("/urls/new", (req, res) => {
  if (!req.session["user.id"]) {
    res.redirect("/login");
  } else {
  const templateVars = {
    user: users[req.session["user.id"]]
  };
  res.render("urls_new", templateVars);
  }
});

// replaces the old longURL with the new input URL - new Edit feature/page
app.post('/urls/:id', (req, res) => {

  const userID = req.session["user.id"];
  const user = users[userID];
  console.log("User ID:", userID);
  console.log("User:", user);

  const id = req.params.id;
  const newLongURL = req.body.newLongURL;
  const destinationURL = urlDatabase[id];
  console.log("Destination URL:", destinationURL);

  if (!destinationURL) {
    return res.status(400).send("Invalid short URL");
  }

  if (!user) {
    return res.status(400).send("You must be logged in as a registered Tiny APP member to access this content");
  }

  if (user.id !== destinationURL.userID) {
    console.log("Desination URL and ID:", destinationURL.userID);
    return res.status(401).send("Access Denied: This URL does not belong to you. Nice try!")
  }
  
  urlDatabase[id].longURL = newLongURL;
  
  res.redirect('/urls');
});

// new route for URL tinyIDs
app.get("/urls/:id", (req, res) => {

  const userID = req.session["user.id"];
  console.log("User ID:", req.session["user.id"]);
  const user = users[userID];
  console.log("User:", user);

  if (!user) {
    return res.status(400).send("You must be logged in to access this content");
  }

  if (user.id !== urlDatabase[req.params.id].userID) {
    return res.status(401).send("Access Denied: This URL does not belong to you!")
  }

  const templateVars = { 
    id: req.params.id, 
    longURL: urlDatabase[req.params.id].longURL,
    user: users[req.session["user.id"]]
  };
  res.render("urls_show", templateVars);
});

// redirect any request to ("u/:id") to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;

  if (!longURL) {
    const errorMessage = "Invalid Tiny URL.";
    return res.status(404).render("error", { errorMessage });
  }
  res.redirect(longURL);
});

// deletes the stored URL id, longURL and shortID URL from the urlDatabase
app.post('/urls/:id/delete', (req, res) => {

  const user = users[req.session["user.id"]];
  const id = req.params.id;
  const destinationURL = urlDatabase[id];

  if (!destinationURL) {
    return res.status(400).send("Invalid short URL");
  }

  if (!user) {
    return res.status(400).send("You must be logged in as a registered Tiny APP member to access this content");
  }

  if (user.id !== destinationURL.userID) {
    return res.status(401).send("Access Denied: This URL does not belong to you. Nice try!")
  }

  const idToDelete = req.params.id;

  delete urlDatabase[idToDelete]; 

  req.session = null;
  res.redirect('/urls');
});

// allows user to input their username (and cookies to store that data for next time)
app.post('/login', (req, res) => {
  const user = getUserByEmail(users, req.body.email);
  const passwordsMatch = bcrypt.compareSync(req.body.password, user.password);
  console.log("Passwords Match:", passwordsMatch);
  console.log("User logged in:", user.id);
  
  if (!user) {
    console.log("User not found");
    return res.status(403).send("Incorrect email and/or password");
  }

  if (!passwordsMatch) {
    console.log("Passwords do not match");
    return res.status(403).send("Incorrect email and/or password - this error");
  }
  req.session["user.id"] = user.id;
  console.log("User logged in:", req.session["user.id"]);
  res.redirect("/urls");
});

// redirects user from login page if they are already logged in
app.get('/login', (req, res) => {
  if (req.session["user.id"]) {
    res.redirect("/urls");
  } else {
  const templateVars = {
    user: null
  };
  res.render("urls_login", templateVars);
  }
});

// gives a logout endpoint and clears the username cookie - redirects back to /urls
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// registration request for email and password
app.post('/register', (req, res) => {

  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (!email || !password) {
    res.status(400).send('Please enter a valid email and/or password');
  }

  const userExists = getUserByEmail(users, email);
  if (userExists) {
    return res.status(400).send('Error: email is already registered');
  }
  
  const id = generateRandomString(6);
  
  const user = {
    id: id,
    email: email,
    password: password
  };

  users[id] = user;

  req.session["user.id"] = user.id;

  res.redirect("/urls");
  });

// new registration page
app.get("/register", (req, res) => {
  if (req.session["user.id"]) {
    res.redirect("/urls");
  } 

  const templateVars = {
    user: users[req.session["user.id"]]
  };
  res.render("urls_register", templateVars);
});

app.get('/', (req, res) => {

  if (!users[req.session["user.id"]]) {
    res.redirect('/login');
  }

  res.redirect('/urls')
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

