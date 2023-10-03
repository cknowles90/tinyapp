
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

// configuration of express app
app.set("view engine", "ejs");

// POST requests are sent as a BUFFER (great for transmitting data but isnt readable without this)
app.use(express.urlencoded({ extended: true})); // this is middleware

// random string generator to simulate tinyURL
function generateRandomString() {    
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
for (let x = 0; x < 6; x++) {
  result += characters.charAt(Math.floor(Math.random() * characters.length));
}

return result;
}; 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

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

// 
app.post('/urls/:id', (req, res) => {
  const idToUpdate = req.params.id;
  const newLongURL = req.body.longURL;

  urlDatabase[idToUpdate] = newLongURL;

  res.redirect('/urls');
});

// redirect any request to ("u/:id") to its longURL
app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

// new route handler for /urls
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// new route for /urls/new - the form
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});
// new route for URL tinyIDs
app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

// adds JSON string that reprents the entire urlDatabase objects at time of request
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// displays HTML content that the /hello path responds with
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// set path created to display scope
app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

// fetch path created to show erro that you can't access value of a because of reference/scope error
app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

