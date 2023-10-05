




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