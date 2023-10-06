// function to help get a user by email
const getUserByEmail = (users, email) => {
  for (const userId in users)  {
    const user = users[userId];
    if (user.email === email) {
      return user;
    }
  }
  console.log("GetUserByEmail:", users, email);
  return undefined;
};

// function similar to above - but to filter through urls associated with userID's
const getUserUrls = (urlDatabase, userID) => {
  let userUrls = {}; // added this so that the return statement can account for non-existant users
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      userUrls[url] = (urlDatabase[url]);
    }
  };
  return userUrls;
};



module.exports = {
  getUserByEmail: getUserByEmail,
  getUserUrls: getUserUrls,
};