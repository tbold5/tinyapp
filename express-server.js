var express = require('express');
var app = express();
var PORT = 8080; //default port
const bodyParser = require("body-parser");
var cookie = require('cookie-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookie());
app.set("view engine", "ejs");


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
        let templateVars = { 
            urls: urlDatabase,
            username: req.cookies["username"]
        };
        res.render("urls_index", templateVars);
    });
    app.get("/urls/:id", (req, res) => {
        let templateVars = {shortURL: req.params.id};
        res.render("urls_show", templateVars);
    }); 
    app.post("/urls", (req, res) => {
        const shortURL = generateRandomString();
        urlDatabase[shortURL] = req.body.longURL;
        console.log(urlDatabase);
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
        res.cookie('username', req.body.login)
        res.redirect("/urls");
    });
    app.post("/logout", (req,res) => {
        res.clearCookie('username');
        res.redirect("/urls");
    })
    app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}!`);
        });