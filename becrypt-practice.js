
bcrypt.genSalt(saltRounds, (err, salt) => {
  if (err) {
    return res.status(500).send("Error generating salt:", err)
  }

  bcrypt.hash(password, salt, (err, hash) => {
    if (err) {
      return res.status(500).send("Error hashing password:", err);
    }
    users[userId] = {
      id: userId,
      email: email,
      password: hash,
    };
  });
});






// // setting a cookie
// res.cookie("userId", userId) => req.session.userId = value;

// // reading a cookie
// req.cookies.userId => req.session.userId;

// // clearing cookies

// res.clearCookie("userId") => req.session = null;


// app.post("/logout", (req, res) => {

//   delete req.session.userId = null;
//   req.session = null; // clear all cookies

//   res.redirect("/login");
// });