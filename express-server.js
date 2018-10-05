var express = require('express');
var app = express();
var PORT = 8080; //default port
const bodyParser = require("body-parser");
var cookie = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
app.set("view engine", "ejs");

const users = { 
    "userRandomID": {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    },
   "user2RandomID": {
      id: "user2RandomID", 
      email: "user2@example.com", 
      password: "dishwasher-funk"
    }
  }

function generateRandomString() {
    // toString method 0-9 gives numbers, 10-36 gives alphabets
    // substr(2,6) because Math.random takes 0 and period as (0, 1)
     return Math.random().toString(36).substr(2,6);
    };

var urlDatabase = {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  };

    app.get("/", (req, res) => {
        res.send("Hello Trae!");
    });
    app.get("/urls/new", (req, res) => {
        res.render("urls_new")
    });
    app.get("/urls.json", (req, res) => {
        res.json(urlDatabase);
    });
    app.get("/hello", (req, res) => {
        res.send("<html><body>Hello <b>World</b></body></html>\n");
    });
    app.get("/urls", (req, res) => {
        var user_id = users.id;         // help help this is wrong, what do we do?!?!?!!
        let templateVars = { 
            urls: urlDatabase,
            userID: req.cookies["user_id"],
            user: users[user_id]
        };
        res.render("urls_index", templateVars);
    });
    app.get("/urls/:id", (req, res) => {
        var user_id = users.id;
        let templateVars = {
            shortURL: req.params.id,
            userID: req.cookies["user_id"],
            users: users[user_id]
        };
        res.render("urls_show", templateVars);
    }); 
    app.post("/urls", (req, res) => {
        const shortURL = generateRandomString();
        urlDatabase[shortURL] = req.body.longURL;
        res.redirect("/urls/" + shortURL);
    });
    app.get("/u/:shortURL", (req, res) => {
        let shortURL = req.params.shortURL;
        let longURL = urlDatabase[shortURL];
        if (longURL === undefined){
            res.status(404).send('Not Found')
        } else {
            res.redirect(longURL)
        }
    });
    app.post("/urls/:id/delete", (req, res) => {
        delete urlDatabase[req.params.id];
        res.redirect("/urls");
    });
    app.post("/urls/:id", (req, res) => {
        let updatedURL = req.body.longURL;
        let shortURL = req.params.id;
        urlDatabase[shortURL] = updatedURL;
        res.redirect("/urls");
    });
    app.post("/login", (req, res) => {
        res.cookie('user_id', req.cookies["user_id"])
        res.redirect("/urls");
    });
    app.post("/logout", (req,res) => {
        res.clearCookie('user_id');
        res.redirect("/urls");
    });
    app.get("/register", (req, res) => {
        var user_id = users.id;
        let templateVars = {
            shortURL: req.params.id,
            userID: req.cookies["user_id"],
            user: users[user_id]
        };
        res.render('urls_register', templateVars)
    });
    app.post("/register", (req, res) => {
        let userID = generateRandomString()
        let email = req.body.email;
        let password = req.body.password;
        var error = false;
        if(email === "" || password === "") {
            res.status(400).send('Registration Empty')
            return;
        } 
        for (var user in users) {
            if(users[user].email === email) {
                res.status(400).send('Email already exists')
                return;
            };
        };
        users[userID] = {                   
            id: userID,
            email: email,
            password: password,
        }
    
        res.cookie("user_id", userID);
        res.redirect("/urls")
    });
    
    app.get("/login", (req, res) => {
      res.render('urls_login');
    });

    app.listen(PORT, () => {
        console.log(`Example app listening on port ${PORT}!`);
    });