//require path
const path = require("path");
//require express
const express = require("express");
//require controllers
const routes = require("./controllers");
//require sequelize
const sequelize = require("./config/connection");
//require helpers
const helpers = require("./utils/helpers");
//require handlebars
const exphbs = require("express-handlebars");
//handlebars
const hbs = exphbs.create({ helpers });
//require socket io
const io = require("socket.io");

//require session
const session = require("express-session");
//session store
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// session const
const sess = {
  secret: process.env.DB_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
    checkExpirationInterval: 1000 * 60 * 10, // will check every 10 minutes
    expiration: 1000 * 60 * 30, // will expire after 30 minutes
  }),
};

//express app
const app = express();
//port
const PORT = process.env.PORT || 3001;

//handlebars app
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

//session app
app.use(session(sess));
app.use(express.static(path.join(__dirname, "public")));
//express app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//require routes
app.use(routes);

//sync sequelize models to the database, then turn on the server
sequelize.sync();

//server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
