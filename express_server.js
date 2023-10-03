const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true}));

app.set("view engine", "ejs");

function generateRandomString() {}; 

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xk": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("urls", (req, res) => {
  console.log(req.body);
  res.send("Ok");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  const templateVars = { id: req.params.id,         longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

// app.get("?urls/:id:", (req, res) => {
//   const templateVars = { id: "9sm5xk" , longURL: "http://www.google.com" };
//   res.render("urls_show", templateVars);
// });

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

