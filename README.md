# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs into a unique ID.
This app was built over the course of 4 days while attending Lighthouse Labs Web-Development bootcamp.

Using a mixture of Node, Express and EJS, this project has a number of displayed pages for the user to navigate logically and provides the user with relevant feedback - through displayed error messages - in regards to their limitations and intentions.

When a user first signs up to use the features of TinyApp they are routed to a registration page where they will input their (and valid) email and a password of their choosing. They are then issued a random, unique user ID.

For the protection of the users information, their password is not stored as plainText on the server end, and an encryption module is used to hash the password into a encoded password. When the user logs out of the TinyApp all information stored on their session cookies is deleted.

Once a Tiny URL is created, the user can share that URL with anyone they like, and that individual is able to input that unique ShortURL ID into the TinyApp web browser and be redirected to the appropriate website. Regardless of if the user has registered with TinyApp or not, and regardless of whether they are logged in or not.

TinyApp allows users to see their stored shortURLs that they have created, and provides the option for them to edit or delete those URLs. If a user tries to create a shortURL using an original URL that was already created/owned by another user, they are unable to do so an will receieve a relevent error message.

## Final Product

!["screenshot description"](#)
!["screenshot description"](#)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).

- Run the development web server using the `node express_server.js` command.

- A message containing the sweet, sweet words "TinyApp listening on port8080!" will be displayed on your terminal

- You're off! Excellent, now, visit http://localhost.8080/ in your preferred browser (better not be Explorer...)

- If alls well you will be redirected to the login page (for existing, returning and loyal users) or you will have to register (using the Register tab at the top of your screen - right side... yep, there it is, you found it - beautifully displayed dont you think *wink*) and once on the registration page you can fill out the appropriate fields, and Voila! Hey presto! you're part of the cool kids now!

- Once on the inside, feel free to explore; but we know you really came to make Tiny URLs...

- Create, edit, delete all the Tiny URLs your heart desires. Share them with friends, or hoard them secretly like Smaug, (except I dont think you'll be able to sleep on top of these Tiny URLs...).

- IF! you do decide to share your creations, be sure to send the following link (with your shortURL ID included) http://localhost:8080/u/:id <-- shortURL ID goes here.

Now, stay tuned because there are new features planned for the future! So it is not all she/he/they wrote!

Thank-you for reading this far, 

and I hope you enjoy my first project, and enjoy creating Tiny URLs

- Charlie